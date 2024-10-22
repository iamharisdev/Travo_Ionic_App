import React, { useMemo } from 'react';
import { IonButton, IonIcon, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonText } from '@ionic/react';
import { Patient } from '../../../../state/patientSlice';
import { Services } from '../../../../shared/types/appointment.type';
import { AppointmentDateTime, NavigateTo } from '../../CreateAppointment';
import dayjs from 'dayjs';
import { caretDownOutline, caretUpOutline, informationCircle } from 'ionicons/icons';
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
  setSelectedService: (selectedService: Services) => void;
  setNavigateTo: (navigate: NavigateTo) => void;
  closeHandler: () => void;
}

const ReviewDetails: React.FC<ReviewDetailsProps> = ({
  selectedClient,
  selectedService,
  selectedDateTime,
  setSelectedService,
  setNavigateTo,
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

  const setSelectedServiceHandler = (serviceId: string) => {
    const service = patientServiceRequestDtos.find(({ id }) => id === serviceId);

    if (service) setSelectedService(service);
  }

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

        await dispatch(createAppointmentAction({
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

        dispatch(setLoading({ loading: false, message: '' }));
        closeHandler();
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
    } catch (error) {
      dispatch(setLoading({ loading: false, message: '' }));
      closeHandler();
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
        <IonLabel position="stacked" class="custom-input">Client</IonLabel>
        <IonInput
          disabled
          name="client"
          class="custom"
          type="text"
          placeholder="client"
          value={`${selectedClient?.firstName} ${selectedClient?.lastName}`}
        // onIonInput={(e) => setClient(e.detail.value)}
        />
      </IonItem>
      <IonItem
        lines="none"
        className={`custom-input ion-margin-vertical ion-padding-horizontal`}
      >
        <IonLabel position="stacked" class="custom-input">Service</IonLabel>
        <IonSelect
          name="service"
          toggleIcon={caretDownOutline}
          expandedIcon={caretUpOutline}
          selectedText={selectedService?.name}
          value={selectedService?.id}
          onIonChange={(e) => setSelectedServiceHandler(e.detail.value)}
        >
          {patientServiceRequestDtos.map(({ id, name }) => (
            <IonSelectOption key={id} value={id}>{name}</IonSelectOption>
          ))}
        </IonSelect>
      </IonItem>
      <IonItem
        lines="none"
        className={`custom-input ion-margin-vertical ion-padding-horizontal`}
        onClick={() => setNavigateTo({ step: 2, comesFromStep: 3 })}
      >
        <IonLabel position="stacked" class="custom-input">Date and time</IonLabel>
        <IonButton
          className="ion-no-padding"
          fill="clear"
          color="dark"
        >
          {dateTime}
          <IonIcon className={`${CSSPrefix}-caret-icon`} icon={caretDownOutline} />
        </IonButton>
      </IonItem>
      <IonItem
        lines="none"
        className={`custom-input ion-margin-vertical ion-padding-horizontal`}
      >
        <IonLabel position="stacked" class="custom-input">
          Payment type
          <IonIcon className={`${CSSPrefix}-info-icon`} icon={informationCircle} />
        </IonLabel>
        <IonInput
          disabled
          name="paymentType"
          class="custom"
          type="text"
          placeholder="date time"
          value="At session completion"
        // onIonInput={(e) => setClient(e.detail.value)}
        />
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