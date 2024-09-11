import React, { useEffect } from "react";
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { calendarOutline, clipboardOutline, personCircleOutline } from "ionicons/icons";
import { Redirect, Route, useLocation } from "react-router-dom";
import { APPOINTMENTS, BRANDING, BUSINESS_INFORMATION, CALENDAR, DASHBOARD, MY_PROFILE, PROFILE, PROFILE_INFORMATION, SUBSCRIPTION_DETAILS } from "../../shared/routes/routes";
import Appointments from "../../pages/Appointments/Appointments";
import Calendar from "../../pages/Calendar/Calendar";
import Profile from "../../pages/Profile/Profile";
import MyProfile from "../../pages/MyProfile/MyProfile";
import ProfileInformation from "../../pages/ProfileInformation/ProfileInformation";
import BusinessInformation from "../../pages/BusinessInformation/BusinessInformation";
import Branding from "../../pages/Branding/Branding";
import SubscriptionDetails from "../../pages/SubscriptionDetails/SubscriptionDetails";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import usePresentToast from "../../hooks/usePresentToast";
import { setLoading } from "../../state/loadingSlice";
import { getMeAction } from "../../state/providerSlice";
import { getStorageValue } from "../../storage/storage.util";
import { STORAGE_TOKEN } from "../../constant/storage.constant";
import { reloadAuth } from "../../state/authSlice";
import { getBusinessInformationAction, getCountriesAction, getPhoneCodesAction } from "../../state/practiceSlice";

import "./Tabs.scss";

const Tabs: React.FC = (): React.ReactElement => {
  const dispatch = useDispatch<AppDispatch>();
  const [presentToast] = usePresentToast();
  const location = useLocation();
  const { auth, provider } = useSelector((state: RootState) => state);

  // TODO: handle error toast in a function

  useEffect(() => {
    const initialLoad = async () => {
      dispatch(setLoading({ loading: true, message: 'Loading data' }));
      const profileResponse = await dispatch<any>(getMeAction());
      await dispatch(getCountriesAction());
      await dispatch(getPhoneCodesAction());

      if (profileResponse.payload?.providerPractices?.length > 0) {
        const [providerPractice] = profileResponse.payload.providerPractices;
        if (providerPractice) {
          const businessInformation = await dispatch(getBusinessInformationAction(providerPractice.practiceId));
          if (businessInformation.meta.requestStatus === 'fulfilled') {
            dispatch(setLoading({ loading: false, message: undefined }));
          }

          if (businessInformation.meta.requestStatus === 'rejected') {
            presentToast(
              '¡Error at loading business information!',
              1000,
              'top',
              'danger'
            );
          }
        }
      }

      if (profileResponse.meta.requestStatus === 'fulfilled') {
        dispatch(setLoading({ loading: false, message: undefined }));
      }

      if (profileResponse.meta.requestStatus === 'rejected') {
        presentToast(
          '¡Error at loading profile!',
          1000,
          'top',
          'danger'
        );
      }
      dispatch(setLoading({ loading: false, message: undefined }));
    };

    const checkTokenHandler = async () => {
      const token = await getStorageValue(STORAGE_TOKEN);

      if (token) {
        dispatch(reloadAuth({ token }));
      }
    };

    if (
      auth.state.success &&
      !provider.state.success &&
      location.pathname.includes(DASHBOARD)
    ) {
      initialLoad();
    }

    if (!auth.state.success) {
      checkTokenHandler();
    }
  }, [auth.state.success, provider.state.success, location.pathname, location, dispatch, presentToast]);

  return (
    <IonTabs className="tabs">
      <IonRouterOutlet>
        <Redirect exact path={DASHBOARD} to={APPOINTMENTS} />
        <Route exact path={APPOINTMENTS} component={Appointments} />
        <Route exact path={CALENDAR} component={Calendar} />
        <Route exact path={PROFILE} component={Profile} />
        <Route exact path={MY_PROFILE} component={MyProfile} />
        <Route exact path={PROFILE_INFORMATION} component={ProfileInformation} />
        <Route exact path={BUSINESS_INFORMATION} component={BusinessInformation} />
        <Route exact path={BRANDING} component={Branding} />
        <Route exact path={SUBSCRIPTION_DETAILS} component={SubscriptionDetails} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="appointments" href={APPOINTMENTS}>
          <IonIcon icon={clipboardOutline} />
          <IonLabel>Appointments</IonLabel>
        </IonTabButton>
        <IonTabButton tab="calendar" href={CALENDAR}>
          <IonIcon icon={calendarOutline} />
          <IonLabel>Calendar</IonLabel>
        </IonTabButton>
        <IonTabButton tab="profile" href={PROFILE}>
          <IonIcon icon={personCircleOutline} />
          <IonLabel>Profile</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
