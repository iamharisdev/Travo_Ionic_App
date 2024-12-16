import React, { useCallback, useMemo, useState } from 'react';
import { CreateAppointmentProps } from './createAppointment.type';
import { IonButton, IonButtons, IonContent, IonHeader, IonModal, IonToolbar } from '@ionic/react';
import SelectClient from './Steps/SelectClient/SelectClient';
import { Patient } from '../../state/patientSlice';
import SelectService from './Steps/SelectService/SelectService';
import { Services } from '../../shared/types/appointment.type';
import SelectDateTime from './Steps/SelectDateTime/SelectDateTime';
import ReviewDetails from './Steps/ReviewDetails/ReviewDetails';

import './CreateAppointment.scss';

const CSSPrefix = 'create-appointment';

export interface AppointmentDateTime {
  startTime: string;
  endTime: string;
}

const CreateAppointment: React.FC<CreateAppointmentProps> = ({ isOpen, selectedSlot, setIsOpen }) => {
  const [selectedClient, setSelectedClient] = useState<Patient>();
  const [selectedService, setSelectedService] = useState<Services>();
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
      setIsOpen(false);
      setStep(0);
    }
  }, [step]);


  // Android native back button
  document.addEventListener('ionBackButton', (ev: any) => {
    ev.detail.register(140, () => {
      closeHandler();
    });
  });

  const steps = useMemo(() => {
    switch (step) {
      case 0:
        return <SelectClient setSelectedClient={(client) => {
          setSelectedClient(client);
          setStep(1);
        }} />;
      case 1:
        return <SelectService setSelectedService={(service) => {
          setSelectedService(service);
          setStep(2);
        }} />;
      case 2:
        return (
          <SelectDateTime
            selectedDate={selectedSlot?.start}
            start_time={selectedSlot?.start}
            end_time={selectedSlot?.end}
            setSelectedDateTime={(selectedDateTime) => {
              setSelectedDateTime({ ...selectedDateTime });
              setStep(3);
            }}
          />
        );
      case 3:
        return <ReviewDetails
          selectedClient={selectedClient}
          selectedService={selectedService}
          selectedDateTime={selectedDateTime}
          closeHandler={closeHandler}
        />;

      default:
        <SelectClient setSelectedClient={setSelectedClient} />;
    }
  }, [step, selectedClient, selectedService, selectedDateTime]);

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

export default CreateAppointment;