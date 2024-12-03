import React from 'react';
import { IonButton, IonContent, IonItem, IonModal, IonText } from "@ionic/react";
import { useRef } from "react";

import './Logout.scss';

interface LogoutProps {
  id: string;
  trigger: string;
  cancel: () => void;
  logout: () => void;
}

const CSSprefix = 'logout';

const Logout: React.FC<LogoutProps> = ({ id, trigger, cancel, logout }) => {
  const modal = useRef<HTMLIonModalElement>(null);

  const dismiss = () => {
    modal.current?.dismiss();
  }

  return (
    <IonModal className={CSSprefix} id={id} ref={modal} trigger={trigger}>
      <IonContent>
        <IonItem lines="none">
          <IonText className={`${CSSprefix}-title`}>Log out</IonText>
        </IonItem>
        <IonItem lines="none">
          <IonText className={`${CSSprefix}-description`}>Are you sure you want to log out?</IonText>
        </IonItem>
        <IonItem className={`${CSSprefix}-buttons`} lines="none">
          <IonButton
            color="primary"
            fill="outline"
            onClick={() => {
              dismiss();
              cancel();
            }}
          >
            Cancel
          </IonButton>
          <IonButton
            color="danger"
            fill="solid"
            onClick={logout}
          >
            Log out
          </IonButton>
        </IonItem>
      </IonContent>
    </IonModal>
  );
}

export default Logout;