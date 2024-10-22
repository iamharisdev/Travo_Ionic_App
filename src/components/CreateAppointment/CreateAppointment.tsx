import React, { useEffect, useMemo, useState } from 'react';
import { CreateAppointmentProps } from './createAppointment.type';
import { IonButton, IonButtons, IonContent, IonHeader, IonModal, IonToolbar } from '@ionic/react';
import SelectClient from './Steps/SelectClient/SelectClient';
import { Patient } from '../../state/patientSlice';
import SelectService from './Steps/SelectService/SelectService';
import { Services } from '../../shared/types/appointment.type';
import SelectDateTime from './Steps/SelectDateTime/SelectDateTime';
import ReviewDetails from './Steps/ReviewDetails/ReviewDetails';

export interface AppointmentDateTime {
  startTime: string;
  endTime: string;
}

export interface NavigateTo {
  step: number,
  comesFromStep: number,
}

const CreateAppointment: React.FC<CreateAppointmentProps> = ({ modalRef, trigger }) => {
  const [selectedClient, setSelectedClient] = useState<Patient>();
  const [selectedService, setSelectedService] = useState<Services>();
  const [selectedDateTime, setSelectedDateTime] = useState<AppointmentDateTime>();
  const [step, setStep] = useState<number>(0);
  const [navigateTo, setNavigateTo] = useState<NavigateTo>({ step: -1, comesFromStep: -1 });

  const closeHandler = () => {
    modalRef.current?.dismiss();
    setStep(0);
    setNavigateTo({
      step: -1,
      comesFromStep: -1
    });
  };

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
        return <SelectDateTime setSelectedDateTime={(selectedDateTime) => {
          setSelectedDateTime({ ...selectedDateTime });
          setStep(navigateTo.comesFromStep !== -1 ? navigateTo.comesFromStep : 3);
        }} />;
      case 3:
        return <ReviewDetails
          selectedClient={selectedClient}
          selectedService={selectedService}
          selectedDateTime={selectedDateTime}
          setSelectedService={setSelectedService}
          setNavigateTo={setNavigateTo}
          closeHandler={closeHandler}
        />;

      default:
        <SelectClient setSelectedClient={setSelectedClient} />;
    }
  }, [step, selectedClient, selectedService, selectedDateTime, navigateTo]);

  useEffect(() => {
    if (navigateTo.step !== -1 && navigateTo.comesFromStep - 1) {
      setStep(navigateTo.step)
    }
  }, [navigateTo]);

  return (
    <IonModal
      ref={modalRef}
      trigger={trigger}
    >
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton
              color="primary"
              onClick={closeHandler}
            >
              Cancel
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