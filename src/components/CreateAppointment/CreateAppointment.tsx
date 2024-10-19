import React from 'react';
import { CreateAppointmentProps } from './createAppointment.type';
import { IonButton, IonButtons, IonContent, IonHeader, IonModal, IonToolbar } from '@ionic/react';
import SelectClient from './Steps/SelectClient/SelectClient';

const CreateAppointment: React.FC<CreateAppointmentProps> = ({ modalRef, trigger }) => {
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
        <SelectClient />
      </IonContent>
    </IonModal>
  );
}

export default CreateAppointment;