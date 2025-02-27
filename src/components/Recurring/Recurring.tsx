import React from 'react';
import { IonButton, IonContent, IonItem, IonList, IonModal, IonText } from "@ionic/react";

import './Recurring.scss';

interface LogoutProps {
  isOpen: boolean;
  close: () => void;
}

const CSSprefix = 'recurring';

const Recurring: React.FC<LogoutProps> = ({ isOpen, close }) => {
  return (
    <IonModal className={CSSprefix} id="recurring-modal" isOpen={isOpen}>
      <IonContent>
        <IonList>
          <IonItem lines="none">
            <IonText className={`${CSSprefix}-title`}>
              Reschedule appointment
              <p className={`${CSSprefix}-description`}>
                This is a recurring appointment. Please reschedule on the Trova web platform.
              </p>
            </IonText>
          </IonItem>
          <IonItem className={`${CSSprefix}-buttons`} lines="none">
            <IonButton
              color="primary"
              fill="solid"
              expand="block"
              onClick={close}
            >
              close
            </IonButton>
          </IonItem>
        </IonList>
      </IonContent>
    </IonModal>
  );
}

export default Recurring;