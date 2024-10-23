import React, { useMemo } from 'react';
import { IonButton, IonIcon, IonItem, IonLabel, IonText } from '@ionic/react';
import { Patient } from '../../../../state/patientSlice';
import { Services } from '../../../../shared/types/appointment.type';
import { AppointmentDateTime } from '../../CreateAppointment';
import dayjs from 'dayjs';
import { informationCircle } from 'ionicons/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../state/store';
import { setLoading } from '../../../../state/loadingSlice';
import { createAppointmentAction, getEventsAction } from '../../../../state/schedulingSlice';
import usePresentToast from '../../../../hooks/usePresentToast';

import './ReviewDetails.scss';

const CSSPrefix = 'review-details';

interface ReviewDetailsProps {
  selectedClient?: Patient;
  selectedService?: Services;
  selectedDateTime?: AppointmentDateTime;
  closeHandler: (close?: boolean) => void;
}

const ReviewDetails: React.FC<ReviewDetailsProps> = ({
  selectedClient,
  selectedService,
  selectedDateTime,
  closeHandler
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [presentToast] = usePresentToast();
  const {
    provider,
    scheduling: { services: { patientServiceRequestDtos } },
    calendar: { selectedDate, selectedDates }
  } = useSelector((state: RootState) => state);

  const dateTime = useMemo(() => {
    if (selectedDateTime) {
      return dayjs(selectedDateTime.startTime).format('MMMM D, HH:mm A')
    }
    return '';
  }, [selectedDateTime]);

  const createAppointmentsHandler = async () => {
    try {
      dispatch(setLoading({ loading: true, message: 'Creating appointment' }));

      const [providerPractice] = provider.providerPractices;
      if (
        providerPractice &&
        selectedService?.id &&
        selectedClient?.id &&
        selectedClient?.email &&
        selectedClient?.firstName &&
        selectedClient?.lastName &&
        selectedClient?.patientNumber &&
        selectedDateTime?.startTime &&
        selectedDateTime?.endTime
      ) {
        let start = '';
        let end = '';

        const response = await dispatch(createAppointmentAction({
          practiceId: providerPractice.practiceId,
          providerId: providerPractice.providerId,
          payload: {
            patientServiceId: selectedService.id,
            patientId: selectedClient.id,
            patientEmail: selectedClient.email,
            patientName: `${selectedClient.firstName} ${selectedClient.lastName}`,
            patientNumber: selectedClient.patientNumber,
            startTime: selectedDateTime.startTime,
            endTime: selectedDateTime.endTime
          }
        }));

        if (response.payload) {
          dispatch(setLoading({ loading: false, message: '' }));
          closeHandler(true);
          presentToast(
            'Appointment added',
            1000,
            'middle',
            'success'
          );

          if (selectedDates.length === 2) {
            start = selectedDates[0];
            end = selectedDates[1];
          } else {
            start = selectedDate;
            end = selectedDate;
          }

          await dispatch(getEventsAction({
            practiceId: providerPractice.practiceId,
            providerId: providerPractice.providerId,
            start: dayjs(start).startOf('day').toISOString(),
            end: dayjs(end).endOf('day').toISOString(),
            pageNumber: 0,
            pageSize: 999,
          }));
        }

        if (!response.payload) {
          dispatch(setLoading({ loading: false, message: '' }));
          closeHandler(true);
          presentToast(
            'Error at create appointment',
            1000,
            'middle',
            'danger'
          );
        }
      }
    } catch (error) {
      dispatch(setLoading({ loading: false, message: '' }));
      closeHandler();
      presentToast(
        'Error at create appointment',
        1000,
        'top',
        'danger'
      );
      console.error('error at create appointment: ', error);
    }
  }


  return (
    <div className={CSSPrefix}>
      <IonItem lines="none">
        <IonText className={`${CSSPrefix}-title`}>
          Schedule appointment
        </IonText>
      </IonItem>
      <IonItem lines="none" className={`${CSSPrefix}-subtitle`}>
        <IonText>
          Review appointment details
        </IonText>
      </IonItem>
      <IonItem
        lines="none"
        className={`custom-input ion-margin-vertical ion-padding-horizontal`}
      >
        <IonLabel position="stacked">Client</IonLabel>
        <IonLabel position="stacked">{`${selectedClient?.firstName} ${selectedClient?.lastName}`}</IonLabel>
      </IonItem>
      <IonItem
        lines="none"
        className={`custom-input ion-margin-vertical ion-padding-horizontal`}
      >
        <IonLabel position="stacked">Service</IonLabel>
        <IonLabel position="stacked">{selectedService?.name}</IonLabel>
      </IonItem>
      <IonItem
        lines="none"
        className={`custom-input ion-margin-vertical ion-padding-horizontal`}
      >
        <IonLabel position="stacked">Date and time</IonLabel>
        <IonLabel position="stacked">{dateTime}</IonLabel>
      </IonItem>
      <IonItem
        lines="none"
        className={`custom-input ion-margin-vertical ion-padding-horizontal`}
      >
        <IonLabel position="stacked">
          Payment type
          <IonIcon className={`${CSSPrefix}-info-icon`} icon={informationCircle} />
        </IonLabel>
        <IonLabel position="stacked">At session completion</IonLabel>
      </IonItem>
      <div className={`${CSSPrefix}-button-container ion-padding-horizontal`}>
        <IonButton
          color="primary"
          expand="block"
          onClick={async () => createAppointmentsHandler()}
        >
          Schedule appointment
        </IonButton>
      </div>
    </div>
  );
}

export default ReviewDetails;