import React from "react";
import {
  IonButton,
  IonContent,
  IonImg,
  IonItem,
  IonList,
  IonPage,
  IonRow,
  IonText,
} from "@ionic/react";
import Header from "../../components/Header/Header";

import "./Branding.scss";

const CSSprefix = 'branding';

const Branding: React.FC = (): React.ReactElement => {

  return (
    <IonPage className={CSSprefix}>
      <Header showBack showMenu={false} />
      <IonContent fullscreen={true} className={CSSprefix}>
        <IonItem className="ion-margin-vertical" lines="none">
          <IonText className={`${CSSprefix}-title ion-margin-top`}>
            Branding
          </IonText>
        </IonItem>
        <IonItem className="ion-margin-vertical" lines="none">
          <IonText className={`${CSSprefix}-description ion-margin-top`}>
            Your logo will appear on your public profile and your invoices.
          </IonText>
        </IonItem>
        <IonList>
          <IonRow className="ion-justify-content-center">
            <IonImg src="https://picsum.photos/300/100" />
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonItem lines="none">
              <IonButton fill="clear" color="primary">Upload logo</IonButton>
              <div className={`${CSSprefix}-divider`} />
              <IonButton fill="clear" color="danger">Remove logo</IonButton>
            </IonItem>
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonText className={`${CSSprefix}-image-description`}>
              Preferred image size: 240px x 240px @ 72DPI
              Maximum size of 1MB.
            </IonText>
          </IonRow>
          <IonButton
            className={`${CSSprefix}-save-button`}
            color="primary"
            expand="block"
            onClick={() => null}
          >
            Save and update
          </IonButton>
        </IonList>
      </IonContent>
    </IonPage >
  );
};

export default Branding;
