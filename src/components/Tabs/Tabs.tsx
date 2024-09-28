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
import { APPOINTMENT_CANCEL, APPOINTMENT_DETAILS, APPOINTMENT_DETAILS_EDIT, APPOINTMENT_REQUESTS, APPOINTMENTS, BRANDING, BUSINESS_INFORMATION, CALENDAR, DASHBOARD, MY_PROFILE, PROFILE, PROFILE_INFORMATION, SUBSCRIPTION_DETAILS } from "../../shared/routes/routes";
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
import { getPaymentMethodAction, getProductDetailsAction, getProductsDetailsAction } from "../../state/billingSlice";
import { getEventsAction, getServicesAction } from "../../state/schedulingSlice";
import AppointmentDetails from "../../pages/AppointmentDetails/AppointmentDetails";
import AppointmentDetailsEdit from "../../pages/AppointmentDetailsEdit/AppointmentDetailsEdit";
import dayjs from "dayjs";
import AppointmentRequests from "../../pages/AppointmentRequests/AppointmentRequests";
import AppointmentCancel from "../../pages/CancelAppointment/AppointmentCancel";

import "./Tabs.scss";

const Tabs: React.FC = (): React.ReactElement => {
  const dispatch = useDispatch<AppDispatch>();
  const [presentToast] = usePresentToast();
  const location = useLocation();
  const { auth, provider, practice, billing } = useSelector((state: RootState) => state);

  useEffect(() => {
    const initialLoad = async () => {
      try {
        dispatch(setLoading({ loading: true, message: 'Loading data' }));
        const profileResponse = await dispatch<any>(getMeAction());
        await dispatch(getCountriesAction());
        await dispatch(getPhoneCodesAction());

        if (profileResponse.payload?.providerPractices?.length > 0 && profileResponse.payload?.principal?.countryCode) {
          const [providerPractice] = profileResponse.payload.providerPractices;
          if (providerPractice) {
            await dispatch(getBusinessInformationAction(providerPractice.practiceId));
            await dispatch(getPaymentMethodAction({
              practiceId: providerPractice.practiceId,
              providerId: providerPractice.providerId
            }));
            await dispatch(getProductDetailsAction({
              practiceId: providerPractice.practiceId,
              providerId: providerPractice.providerId
            }));
            await dispatch(getProductsDetailsAction({
              practiceId: providerPractice.practiceId,
              countryCode: profileResponse.payload?.principal?.countryCode
            }));
            await dispatch(getEventsAction({
              practiceId: providerPractice.practiceId,
              providerId: providerPractice.providerId,
              start: dayjs().toISOString(),
              end: dayjs().add(7, 'days').toISOString(),
              pageNumber: 0,
              pageSize: 999,
            }));
            await dispatch(getServicesAction({
              practiceId: providerPractice.practiceId,
              providerId: providerPractice.providerId,
              pageNumber: 0,
              pageSize: 999,
            }));
          }
        }

        dispatch(setLoading({ loading: false, message: undefined }));
      } catch (error) {
        dispatch(setLoading({ loading: false, message: undefined }));
        presentToast(
          '¡Error at loading data!',
          1000,
          'top',
          'danger'
        );
      }
    };

    const checkTokenHandler = async () => {
      const token = await getStorageValue(STORAGE_TOKEN);

      if (token) {
        dispatch(reloadAuth({ token }));
      }
    };

    if (
      auth.state.success && (
        !provider.state.success &&
        !practice.state.success &&
        !billing.state.success
      )
      && location.pathname.includes(DASHBOARD)
    ) {
      initialLoad();
    }

    if (!auth.state.success) {
      checkTokenHandler();
    }
  }, [auth.state.success, location.pathname]);

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
        <Route exact path={`${APPOINTMENT_DETAILS}/:id`} component={AppointmentDetails} />
        <Route exact path={`${APPOINTMENT_DETAILS_EDIT}/:id`} component={AppointmentDetailsEdit} />
        <Route exact path={APPOINTMENT_REQUESTS} component={AppointmentRequests} />
        <Route exact path={APPOINTMENT_CANCEL} component={AppointmentCancel} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom" defaultValue="appointments">
        <IonTabButton tab="calendar" href={CALENDAR}>
          <IonIcon icon={calendarOutline} />
          <IonLabel>Calendar</IonLabel>
        </IonTabButton>
        <IonTabButton tab="appointments" href={APPOINTMENTS}>
          <IonIcon icon={clipboardOutline} />
          <IonLabel>Appointments</IonLabel>
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
