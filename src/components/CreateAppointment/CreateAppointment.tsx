import React, { useMemo, useState } from 'react';
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

const CreateAppointment: React.FC<CreateAppointmentProps> = ({ modalRef, trigger }) => {
  const [selectedClient, setSelectedClient] = useState<Patient>();
  const [selectedService, setSelectedService] = useState<Services>();
  const [selectedDateTime, setSelectedDateTime] = useState<AppointmentDateTime>();
  const [step, setStep] = useState<number>(0);
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
          setStep(3);
        }} />;
      case 3:
        return <ReviewDetails selectedClient={selectedClient} selectedService={selectedService} selectedDateTime={selectedDateTime} />;

      default:
        <SelectClient setSelectedClient={setSelectedClient} />;
    }
  }, [step]);
  console.log('step: ', step);
  console.log('appointmentData: ', {
    selectedClient,
    selectedService,
    selectedDateTime
  });

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
              onClick={() => {
                modalRef.current?.dismiss();
                setStep(0);
              }}
            >
              Cancel
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-no-padding">
        {steps}
      </IonContent>
    </IonModal>
  );
}

export default CreateAppointment;