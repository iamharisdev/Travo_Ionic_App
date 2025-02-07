import React, { useEffect, useState } from 'react';
import { IonContent, IonPage, IonProgressBar, IonText, useIonViewWillEnter } from "@ionic/react";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../state/store';
import usePresentToast from '../../hooks/usePresentToast';
import { useHistory, useLocation } from 'react-router';
import { getMeAction } from '../../state/providerSlice';
import { getBusinessInformationAction, getCountriesAction, getPhoneCodesAction } from '../../state/practiceSlice';
import { getPaymentMethodAction, getProductDetailsAction, getProductsDetailsAction } from '../../state/billingSlice';
import { getEventsAction, getServicesAction } from '../../state/schedulingSlice';
import dayjs from 'dayjs';
import { getStorageValue } from '../../storage/storage.util';
import { STORAGE_TOKEN } from '../../constant/storage.constant';
import { reloadAuth } from '../../state/authSlice';
import { CALENDAR_MONTH, LOADING } from '../../shared/routes/routes';

import './Loading.scss';

const CSSprefix = 'loading';

const Loading: React.FC = (): React.ReactElement => {
  const history = useHistory();
  const [progress, setProgress] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const [presentToast] = usePresentToast();
  const location = useLocation();
  const {
    auth,
    provider,
    practice,
    billing,
    scheduling,
    calendar,
    patient,
  } = useSelector((state: RootState) => state);

  useIonViewWillEnter(() => {
    setProgress(0);
  }, []);

  useEffect(() => {
    const initialLoad = async () => {
      try {

        setProgress((prevProgress) => prevProgress + 0.08);
        const profileResponse = await dispatch<any>(getMeAction());
        await dispatch(getCountriesAction());
        await dispatch(getPhoneCodesAction());

        if (profileResponse.payload?.providerPractices?.length > 0 && profileResponse.payload?.principal?.countryCode) {
          const [providerPractice] = profileResponse.payload.providerPractices;
          if (providerPractice) {
            setProgress((prevProgress) => prevProgress + 0.08);
            await dispatch(getBusinessInformationAction(providerPractice.practiceId));
            await dispatch(getPaymentMethodAction({
              practiceId: providerPractice.practiceId,
              providerId: providerPractice.providerId
            }));
            setProgress((prevProgress) => prevProgress + 0.08);
            await dispatch(getProductDetailsAction({
              practiceId: providerPractice.practiceId,
              providerId: providerPractice.providerId
            }));
            setProgress((prevProgress) => prevProgress + 0.08);
            await dispatch(getProductsDetailsAction({
              practiceId: providerPractice.practiceId,
              countryCode: profileResponse.payload?.principal?.countryCode
            }));
            setProgress((prevProgress) => prevProgress + 0.08);
            await dispatch(getEventsAction({
              practiceId: providerPractice.practiceId,
              providerId: providerPractice.providerId,
              start: dayjs().subtract(3, 'months').toISOString(),
              end: dayjs().add(1, 'year').endOf('year').toISOString(),
              pageNumber: 0,
              pageSize: 999,
            }));
            setProgress((prevProgress) => prevProgress + 0.08);
            await dispatch(getServicesAction({
              practiceId: providerPractice.practiceId,
              providerId: providerPractice.providerId,
              pageNumber: 0,
              pageSize: 999,
            }));
            setProgress((prevProgress) => prevProgress + 0.60);

            setTimeout(() => {
              history.push(CALENDAR_MONTH, { prevPath: LOADING });
            }, 1000);
          }
        }
      } catch (error) {
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
        !billing.state.success &&
        !scheduling.state.success &&
        !calendar.state.success &&
        !patient.state.success
      )
      && location.pathname.includes(LOADING)
    ) {
      initialLoad();
    }

    if (!auth.state.success) {
      checkTokenHandler();
    }
  }, [auth.state.success, location.pathname]);

  return (
    <IonPage className={CSSprefix}>
      <IonContent fullscreen={true}>
        <div className={`${CSSprefix}-main`}>
          <div className={`${CSSprefix}-container`}>
            <IonText>Loading appointments</IonText>
            <IonProgressBar value={progress} />
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Loading;