import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RescheduleAppointmentProps } from './rescheduleAppointment.type';
import { IonButton, IonButtons, IonContent, IonHeader, IonModal, IonToolbar } from '@ionic/react';
import SelectDateTime from './Steps/SelectDateTime/SelectDateTime';
import ReviewDetails from './Steps/ReviewDetails/ReviewDetails';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../state/store';
import usePresentToast from '../../hooks/usePresentToast';
import { setLoading } from '../../state/loadingSlice';
import { getEventsAction, rescheduleAppointmentAction } from '../../state/schedulingSlice';
import dayjs from 'dayjs';
import { useHistory } from 'react-router';
import { CALENDAR_MONTH } from '../../shared/routes/routes';

export interface AppointmentDateTime {
  startTime: string;
  endTime: string;
}

const RescheduleAppointment: React.FC<RescheduleAppointmentProps> = ({ isOpen, appointment, setIsOpen }) => {
  const [selectedDateTime, setSelectedDateTime] = useState<AppointmentDateTime>();
  const [step, setStep] = useState<number>(0);
  const dispatch = useDispatch<AppDispatch>();
  const [presentToast] = usePresentToast();
  const history = useHistory();
  const {
    provider,
    calendar: { selectedDate, selectedDates }
  } = useSelector((state: RootState) => state)

  const cancelOrBackText = useMemo(() => {
    if (step === 1 || step === 2 || step === 3) return 'Back';

    return 'Cancel';
  }, [step]);

  const closeHandler = useCallback((close?: boolean) => {
    if ((step === 1 || step === 2 || step === 3) && !close) {
      setStep(step - 1);
    }

    if (step === 0 || close) {
      setIsOpen(false)
      setStep(0);
      setSelectedDateTime(undefined);
    }
  }, [step]);

  const rescheduleAppointmentHandler = async () => {
    try {
      dispatch(setLoading({ loading: true, message: 'Rescheduling appointment' }));

      const [providerPractice] = provider.providerPractices;
      if (
        providerPractice &&
        appointment?.id &&
        appointment?.patientServiceId &&
        appointment?.patientEmail &&
        appointment?.patientId &&
        appointment?.patientName &&
        appointment?.patientNumber &&
        appointment?.price &&
        selectedDateTime?.startTime &&
        selectedDateTime?.endTime
      ) {
        let start = '';
        let end = '';

        const response = await dispatch(rescheduleAppointmentAction({
          practiceId: providerPractice.practiceId,
          providerId: providerPractice.providerId,
          appointmentId: appointment.id,
          payload: {
            invoiceDataId: '',
            patientEmail: appointment.patientEmail,
            patientId: appointment.id,
            patientName: appointment.patientName,
            patientNumber: appointment.patientNumber,
            patientServiceId: appointment.patientServiceId,
            price: appointment.price,
            startTime: selectedDateTime.startTime,
            endTime: selectedDateTime.endTime
          }
        }));

        if (response.payload) {
          dispatch(setLoading({ loading: false, message: '' }));
          presentToast(
            'Reschedule success',
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

          closeHandler(true);
          history.push(CALENDAR_MONTH);
        }

        if (!response.payload) {
          dispatch(setLoading({ loading: false, message: '' }));
          closeHandler(true);
          presentToast(
            'Error at reschedule appointment',
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
        'Error at reschedule appointment',
        1000,
        'top',
        'danger'
      );
      console.error('error at reschedule appointment: ', error);
    }
  };

  const steps = useMemo(() => {
    switch (step) {
      case 0:
        return <ReviewDetails
          patientName={appointment?.patientName || ''}
          patientServiceName={appointment?.patientServiceName || ''}
          price={appointment?.price || 0}
          location={appointment?.location || ''}
          selectedDateTime={selectedDateTime}
          setStep={setStep}
          rescheduleHandler={rescheduleAppointmentHandler}
        />;
      case 1:
        return <SelectDateTime setSelectedDateTime={(selectedDateTime) => {
          setSelectedDateTime({ ...selectedDateTime });
          setStep(0);
        }} />;

      default:
        <ReviewDetails
          patientName={appointment?.patientName || ''}
          patientServiceName={appointment?.patientServiceName || ''}
          price={appointment?.price || 0}
          location={appointment?.location || ''}
          selectedDateTime={selectedDateTime}
          setStep={setStep}
          rescheduleHandler={rescheduleAppointmentHandler}
        />;
    }
  }, [step, appointment, selectedDateTime]);

  useEffect(() => {
    if (
      !selectedDateTime ||
      (
        selectedDateTime.startTime === '' &&
        selectedDateTime.endTime === '' &&
        isOpen
      )
    ) {
      setSelectedDateTime({
        startTime: appointment?.startTime as string || '',
        endTime: appointment?.endTime as string || ''
      })
    }
  }, [selectedDateTime, isOpen]);

  return (
    <IonModal
      isOpen={isOpen}
    >
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton
              color="primary"
              onClick={() => closeHandler()}
            >
              {cancelOrBackText}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-no-padding">
        {steps}
      </IonContent>
    </IonModal>
  );
}

export default RescheduleAppointment;