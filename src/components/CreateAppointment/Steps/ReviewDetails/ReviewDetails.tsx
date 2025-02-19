import React, { useMemo, useRef, useState } from 'react';
import { IonButton, IonIcon, IonItem, IonLabel, IonPopover, IonText } from '@ionic/react';
import { Patient } from '../../../../state/patientSlice';
import { Services } from '../../../../shared/types/appointment.type';
import { AppointmentDateTime } from '../../CreateAppointment';
import dayjs from 'dayjs';
import { caretDownOutline, informationCircle } from 'ionicons/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../state/store';
import { setLoading } from '../../../../state/loadingSlice';
import { createAppointmentAction, getEventsAction } from '../../../../state/schedulingSlice';
import usePresentToast from '../../../../hooks/usePresentToast';
import { useHistory } from 'react-router';
import { APPOINTMENTS } from '../../../../shared/routes/routes';
import { setDate } from '../../../../state/calendarSlice';

import './ReviewDetails.scss';

const CSSPrefix = 'review-details';

interface ReviewDetailsProps {
  selectedClient?: Patient;
  selectedService?: Services;
  selectedDateTime?: AppointmentDateTime;
  invoiceDataId?: string;
  closeHandler: (close?: boolean) => void;
  goToStep?: (step: number) => void;
}

const ReviewDetails: React.FC<ReviewDetailsProps> = ({
  selectedClient,
  selectedService,
  selectedDateTime,
  invoiceDataId,
  closeHandler,
  goToStep,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [presentToast] = usePresentToast();
  const {
    provider,
    calendar: { selectedDate, selectedDates }
  } = useSelector((state: RootState) => state);
  const history = useHistory();
  const popover = useRef<HTMLIonPopoverElement>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const openPopover = (e: any) => {
    popover.current!.event = e;
    setPopoverOpen(true);
  };

  const dateTime = useMemo(() => {
    if (selectedDateTime) {
      return dayjs(selectedDateTime.startTime).format('MMMM D, HH:mm A')
    }
    return '';
  }, [selectedDateTime]);

  const paymentType = useMemo(() => {
    if (selectedService?.paymentType === 'At Completion') {
      return 'At session completion';
    }

    return 'In advance of session';
  }, [selectedService?.paymentType]);

  const createAppointmentsHandler = async () => {
    let redirect = false;

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
        const payload = {
          practiceId: providerPractice.practiceId,
          providerId: providerPractice.providerId,
          payload: {
            patientServiceId: selectedService.id,
            patientId: selectedClient.id,
            patientEmail: selectedClient.email,
            patientName: `${selectedClient.firstName} ${selectedClient.lastName}`,
            patientNumber: selectedClient.patientNumber,
            startTime: selectedDateTime.startTime,
            endTime: selectedDateTime.endTime,
            invoiceDataId,
          }
        };

        const response: any = await dispatch(createAppointmentAction(payload));

        if (response?.payload?.id && response.type === 'scheduling/createAppointment/fulfilled') {
          await dispatch(getEventsAction({
            practiceId: providerPractice.practiceId,
            providerId: providerPractice.providerId,
            start: dayjs(selectedDateTime?.startTime).startOf('day').toISOString(),
            end: dayjs(selectedDateTime?.startTime).endOf('day').toISOString(),
            pageNumber: 0,
            pageSize: 999,
          }));

          dispatch(setDate(dayjs(selectedDateTime?.startTime).startOf('day').toISOString()));
          dispatch(setLoading({ loading: false, message: '' }));
          redirect = true;
          closeHandler(true);
        }

        if (!response.payload) {
          closeHandler(true);
          presentToast(
            'Error at create appointment',
            1000,
            'middle',
            'danger'
          );
          dispatch(setLoading({ loading: false, message: '' }));
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
    } finally {
      if (redirect) {
        history.push(APPOINTMENTS);
      }
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
        onClick={() => goToStep && goToStep(0)}
      >
        <IonLabel position="stacked">
          Client
        </IonLabel>
        <IonIcon className={`${CSSPrefix}-at-the-very-right`} icon={caretDownOutline} />
        <IonLabel position="stacked">{`${selectedClient?.firstName} ${selectedClient?.lastName}`}</IonLabel>
      </IonItem>
      <IonItem
        lines="none"
        className={`custom-input ion-margin-vertical ion-padding-horizontal`}
        onClick={() => goToStep && goToStep(1)}
      >
        <IonLabel position="stacked">Service</IonLabel>
        <IonIcon className={`${CSSPrefix}-at-the-very-right`} icon={caretDownOutline} />
        <IonLabel position="stacked">{selectedService?.name}</IonLabel>
      </IonItem>
      <IonItem
        lines="none"
        className={`custom-input ion-margin-vertical ion-padding-horizontal`}
        onClick={() => goToStep && goToStep(2)}
      >
        <IonLabel position="stacked">Date and time</IonLabel>
        <IonIcon className={`${CSSPrefix}-at-the-very-right`} icon={caretDownOutline} />
        <IonLabel position="stacked">{dateTime}</IonLabel>
      </IonItem>
      <IonItem
        lines="none"
        className={`custom-input ion-margin-vertical ion-padding-horizontal`}
      >
        <IonLabel position="stacked">
          Payment type
          <IonIcon
            className={`${CSSPrefix}-info-icon`}
            icon={informationCircle}
            onClick={openPopover}
          />
        </IonLabel>
        <IonLabel position="stacked">{paymentType}</IonLabel>
      </IonItem>
      <IonButton
        className={`${CSSPrefix}-schedule-button ion-padding`}
        color="primary"
        expand="block"
        onClick={async () => createAppointmentsHandler()}
      >
        Schedule Appointment
      </IonButton>
      <IonPopover
        className="info-popover"
        ref={popover}
        isOpen={popoverOpen}
        onDidDismiss={() => setPopoverOpen(false)}
        triggerAction="hover"
      >
        <div className="info-popover-content">
          <IonIcon
            className={`${CSSPrefix}-info-icon`}
            icon={informationCircle}
            onClick={openPopover}
          />
          Payment type is set by the service
        </div>
      </IonPopover>
    </div>
  );
}

export default ReviewDetails;