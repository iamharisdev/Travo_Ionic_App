import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RescheduleAppointmentProps } from './rescheduleAppointment.type';
import { IonButton, IonButtons, IonContent, IonHeader, IonModal, IonToolbar } from '@ionic/react';
import SelectDateTime from './Steps/SelectDateTime/SelectDateTime';
import ReviewDetails from './Steps/ReviewDetails/ReviewDetails';

export interface AppointmentDateTime {
  startTime: string;
  endTime: string;
}

const RescheduleAppointment: React.FC<RescheduleAppointmentProps> = ({ isOpen, appointment, setIsOpen }) => {
  const [selectedDateTime, setSelectedDateTime] = useState<AppointmentDateTime>();
  const [step, setStep] = useState<number>(0);

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
    }
  }, [step]);

  const steps = useMemo(() => {
    switch (step) {
      case 0:
        return <ReviewDetails
          patientName={appointment?.patientName || ''}
          patientServiceName={appointment?.patientServiceName || ''}
          selectedDateTime={selectedDateTime}
          setStep={setStep}
          rescheduleHandler={() => { }}
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
          selectedDateTime={selectedDateTime}
          setStep={setStep}
          rescheduleHandler={() => { }}
        />;
    }
  }, [step, appointment, selectedDateTime]);

  useEffect(() => {
    if (!selectedDateTime) {
      setSelectedDateTime({
        startTime: appointment?.startTime as string || '',
        endTime: appointment?.endTime as string || ''
      })
    }
  }, [selectedDateTime]);

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