import React from "react";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonIcon,
  IonItem,
  IonList,
  IonPage,
  IonText,
} from "@ionic/react";
import Header from "../../components/Header/Header";
import { cardOutline } from "ionicons/icons";

import "./SubscriptionDetails.scss";

const CSSprefix = 'subscription-deatils';

const SubscriptionDetails: React.FC = (): React.ReactElement => {

  return (
    <IonPage className={CSSprefix}>
      <Header showBack showMenu={false} />
      <IonContent fullscreen={true}>
        <IonItem className="ion-margin-vertical" lines="none">
          <IonText className={`${CSSprefix}-title ion-margin-top`}>
            Subscription details
          </IonText>
        </IonItem>
        <IonList className="ion-no-padding">
          <IonCard className={`${CSSprefix}-subscription`}>
            <div className={`${CSSprefix}-subscription-container-gradient`} />
            <IonCardHeader>
              <IonItem lines="none" className="ion-no-padding ion-no-margin">
                <IonCardTitle>Pro</IonCardTitle>
                <IonItem lines="none" className="ion-no-padding ion-no-margin" slot="end">
                  <IonText className={`${CSSprefix}-subscription-price`}>R999.00</IonText>
                  <IonText slot="end" className={`${CSSprefix}-subscription-month`}>/ Monthly</IonText>
                </IonItem>
              </IonItem>
            </IonCardHeader>
          </IonCard>
          <IonCard className={`${CSSprefix}-next-payment`}>
            <IonCardHeader>
              <IonCardTitle>Next payment</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonItem lines="none" className="ion-no-padding">
                <IonIcon icon={cardOutline} />
                <div className={`${CSSprefix}-next-payment-card-details-container`}>
                  <IonText className={`${CSSprefix}-next-payment-card-details-text`}>
                    amex
                  </IonText>
                  <IonText className={`${CSSprefix}-next-payment-card-details-text`}>
                    ************4764
                  </IonText>
                </div>
              </IonItem>
              <IonItem lines="none" className="ion-no-padding">
                <IonText className={`${CSSprefix}-next-payment-description`}>
                  For changing or adding a card, please do it on the desktop version.
                  {"\n"}
                  {"\n"}
                  Please Contact Support at hello@trova.health to cancel your Subscription.
                </IonText>
              </IonItem>
            </IonCardContent>
          </IonCard>
        </IonList>
      </IonContent>
    </IonPage >
  );
};

export default SubscriptionDetails;
