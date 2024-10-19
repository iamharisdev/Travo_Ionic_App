import React, { useMemo, useState } from 'react';
import { CreateAppointmentProps } from './createAppointment.type';
import { IonButton, IonButtons, IonContent, IonHeader, IonModal, IonToolbar } from '@ionic/react';
import SelectClient from './Steps/SelectClient/SelectClient';
import { Patient } from '../../state/patientSlice';
import SelectService from './Steps/SelectService/SelectService';
import { Services } from '../../shared/types/appointment.type';

const CreateAppointment: React.FC<CreateAppointmentProps> = ({ modalRef, trigger }) => {
  const [selectedClient, setSelectedClient] = useState<Patient>();
  const [selectedService, setSelectedService] = useState<Services>();
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

      default:
        <SelectClient setSelectedClient={setSelectedClient} />;
    }
  }, [step]);
  console.log('step: ', step);
  console.log('appointmentData: ', {
    selectedClient,
    selectedService,
  })

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
              onClick={() => modalRef.current?.dismiss()}
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