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
import { APPOINTMENTS } from '../../shared/routes/routes';
import { setDate } from '../../state/calendarSlice';
import PaidInAdvance from './Steps/PaidInAdvance/PaidInAdvance';

import './RescheduleAppointment.scss';
import { useTranslation } from 'react-i18next';

const CSSPrefix = 'reschedule-appointment';

export interface AppointmentDateTime {
  startTime: string;
  endTime: string;
}

const RescheduleAppointment: React.FC<RescheduleAppointmentProps> = ({ isOpen, appointment, setIsOpen }) => {
  const { services: { patientServiceRequestDtos } } = useSelector((state: RootState) => state.scheduling)
  const [selectedDateTime, setSelectedDateTime] = useState<AppointmentDateTime>();
  const [step, setStep] = useState<number>(0);
  const dispatch = useDispatch<AppDispatch>();
  const [presentToast] = usePresentToast();
  const history = useHistory();
      const { t } = useTranslation();
  const {
    provider,
  } = useSelector((state: RootState) => state)
  const [invoiceDataId, setInvoiceDataId] = useState<string>();

  const duration = useMemo(() => {
    if (patientServiceRequestDtos && appointment?.patientServiceId) {
      return patientServiceRequestDtos.find(({ id }) => id === appointment.patientServiceId)?.duration!!;
    }

    return 0;
  }, [patientServiceRequestDtos, appointment?.patientServiceId]);

  const selectedService = useMemo(() => {
    if (patientServiceRequestDtos && appointment?.patientServiceId) {
      return patientServiceRequestDtos.find(({ id }) => id === appointment.patientServiceId);
    }

    return;
  }, [patientServiceRequestDtos, appointment?.patientServiceId]);

  const selectedClientId = useMemo(() => appointment?.patientId, [patientServiceRequestDtos, appointment?.patientServiceId]);

  const paymentType = useMemo(() => {
    if (selectedService?.paymentType === 'At Completion') {
      return `${t("scheduling_at_session_completion")}`;
    }

    return `${t("schedule_appointment_in_advance_of_session")}`;
  }, [selectedService?.paymentType]);

  const disableSaveChanges = useMemo(() => {
    if (dayjs(selectedDateTime?.startTime).valueOf() < dayjs().valueOf()) return true;

    if (selectedService?.paymentType === 'In Advance' && !invoiceDataId) {
      return true;
    }

    return false;
  }, [selectedService?.paymentType, selectedDateTime?.startTime, invoiceDataId]);

  const cancelOrBackText = useMemo(() => {
    if (step === 1 || step === 2 || step === 3) return 'Back';

    return `${t("log_out_cancel")}`;
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
    let redirect = false;

    try {
      dispatch(setLoading({ loading: true, message: `${t("loading_rescheduling_appointment")}` }));

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
        const startTime = dayjs(selectedDateTime.startTime);
        const endTimeByDuration = startTime.add(duration || 0, 'minutes');
        const response = await dispatch(rescheduleAppointmentAction({
          practiceId: providerPractice.practiceId,
          providerId: providerPractice.providerId,
          appointmentId: appointment.id,
          payload: {
            invoiceDataId: invoiceDataId || '',
            patientEmail: appointment.patientEmail,
            patientId: appointment.id,
            patientName: appointment.patientName,
            patientNumber: appointment.patientNumber,
            patientServiceId: appointment.patientServiceId,
            price: appointment.price,
            startTime: startTime.toISOString(),
            endTime: endTimeByDuration.toISOString(),
          }
        }));

        if (response.payload) {
          dispatch(setLoading({ loading: false, message: '' }));
          presentToast(
            `${t("toast_messages_reschedule_success")}`,
            1000,
            'middle',
            'success'
          );

          await dispatch(getEventsAction({
            practiceId: providerPractice.practiceId,
            providerId: providerPractice.providerId,
            start: dayjs(selectedDateTime.startTime).startOf('day').toISOString(),
            end: dayjs(selectedDateTime.endTime).endOf('day').toISOString(),
            pageNumber: 0,
            pageSize: 999,
          }));

          dispatch(setDate(dayjs(selectedDateTime.startTime).startOf('day').toISOString()));
          dispatch(setLoading({ loading: false, message: '' }));
          redirect = true;
          closeHandler(true);
        }

        if (!response.payload) {
          dispatch(setLoading({ loading: false, message: '' }));
          closeHandler(true);
          presentToast(
            `${t("toast_messages_error_reschedule_appointment")}`,
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
        `${t("toast_messages_error_reschedule_appointment")}`,
        1000,
        'top',
        'danger'
      );
      console.error(`${t("toast_messages_error_reschedule_appointment")} :`, error);
    } finally {
      if (redirect) {
        history.push(APPOINTMENTS);
      }
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
          paymentType={paymentType}
          disableSaveChanges={disableSaveChanges}
          setStep={setStep}
          rescheduleHandler={rescheduleAppointmentHandler}
        />;
      case 1:
        return (
          <SelectDateTime
            duration={duration}
            selectedDateTime={selectedDateTime}
            setSelectedDateTime={(selectedDateTime) => {
              setSelectedDateTime({ ...selectedDateTime });
              if (selectedService?.paymentType === 'In Advance') {
                setStep(2);
              } else {
                setStep(0);
              }
            }}
          />
        );
      case 2:
        return <PaidInAdvance
          selectedService={selectedService}
          selectedClientId={selectedClientId}
          selectedDateTime={selectedDateTime}
          setInvoiceDataId={(id) => {
            setInvoiceDataId(id);
            setStep(0);
          }}
        />;

      default:
        <ReviewDetails
          patientName={appointment?.patientName || ''}
          patientServiceName={appointment?.patientServiceName || ''}
          price={appointment?.price || 0}
          location={appointment?.location || ''}
          selectedDateTime={selectedDateTime}
          paymentType={paymentType}
          disableSaveChanges={disableSaveChanges}
          setStep={setStep}
          rescheduleHandler={rescheduleAppointmentHandler}
        />;
    }
  }, [
    step,
    appointment,
    selectedDateTime,
    duration,
    selectedService,
    selectedClientId,
    invoiceDataId,
    paymentType,
    disableSaveChanges,
  ]);

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

  useEffect(() => setInvoiceDataId(undefined), []);

  return (
    <IonModal
      isOpen={isOpen}
      className={CSSPrefix}
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