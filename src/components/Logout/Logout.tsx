import React from 'react';
import { IonButton, IonContent, IonItem, IonLabel, IonList, IonModal, IonText } from "@ionic/react";
import { useRef } from "react";

import './Logout.scss';
import { useTranslation } from 'react-i18next';

interface LogoutProps {
  id: string;
  trigger: string;
  cancel: () => void;
  logout: () => void;
}

const CSSprefix = 'logout';

const Logout: React.FC<LogoutProps> = ({ id, trigger, cancel, logout }) => {
  const modal = useRef<HTMLIonModalElement>(null);
  const { t } = useTranslation();
  const dismiss = () => {
    modal.current?.dismiss();
  }

  return (
    <IonModal className={CSSprefix} id={id} ref={modal} trigger={trigger}>
      <IonContent>
        <IonList>
          <IonItem lines="none">
            <IonText className={`${CSSprefix}-title`}>
              {t("log_out")}
              <p className={`${CSSprefix}-description`}>{t("log_out_are_you_sure_want_to_log_out")}?</p>
            </IonText>
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
              {t("log_out_cancel")}
            </IonButton>
            <IonButton
              color="danger"
              fill="solid"
              onClick={() => {
                dismiss();
                logout();
              }}
            >
              {t("log_out")}
            </IonButton>
          </IonItem>
        </IonList>
      </IonContent>
    </IonModal>
  );
}

export default Logout;