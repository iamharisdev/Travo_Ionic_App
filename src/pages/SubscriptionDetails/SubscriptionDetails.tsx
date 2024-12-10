import React, { useMemo, useRef } from "react";
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
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import UseSwipeGesture from "../../hooks/useSwipeGesture";
import { useHistory } from "react-router";
import SwipeHandler from "../../components/SwipeHandler/SwipeHandler";

import "./SubscriptionDetails.scss";

const CSSprefix = 'subscription-deatils';

const SubscriptionDetails: React.FC = (): React.ReactElement => {
  const subscriptionDetailsRef = useRef();
  const history = useHistory();
  const { billing } = useSelector((state: RootState) => state);
  const productName = useMemo(() => billing.productDetails?.productName, [billing.productDetails]);
  const productDetail = useMemo(() => billing.productsDetails.find(({ name }) => name === productName), [productName, billing.productsDetails]);
  // Uncomment this if it's required in the feature
  // const cardBrand = useMemo(() => billing.paymentMethod?.cardBrand, [billing?.paymentMethod?.cardBrand]);
  // const last4 = useMemo(() => billing.paymentMethod?.last4, [billing.paymentMethod?.last4]);

  const { handlers, refPassthrough } = UseSwipeGesture({
    parentRef: subscriptionDetailsRef,
    onSwipedRight: () => history.goBack(),
  });

  return (
    <IonPage className={CSSprefix} {...handlers} ref={refPassthrough}>
      <SwipeHandler parentRef={subscriptionDetailsRef} />
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
                <IonCardTitle>{productName}</IonCardTitle>
                <div className={`${CSSprefix}-subscription-wrapper`}>
                  <IonText className={`${CSSprefix}-subscription-price`}>{`${productDetail?.currencySymbol}${productDetail?.price}`}</IonText>
                  <IonText slot="end" className={`${CSSprefix}-subscription-month`}>/ Monthly</IonText>
                </div>
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
                {/* Uncomment this if it's required in the future */}
                {/* <div className={`${CSSprefix}-next-payment-card-details-container`}>
                  <IonText className={`${CSSprefix}-next-payment-card-details-text`}>
                    {cardBrand}
                  </IonText>
                  <IonText className={`${CSSprefix}-next-payment-card-details-text`}>
                    ************{last4}
                  </IonText>
                </div> */}
              </IonItem>
              <IonItem lines="none" className="ion-no-padding">
                <IonText className={`${CSSprefix}-next-payment-description`}>
                  Only the account creator has the permission to change payment method on file. Please contact your account creator.
                  <br />
                  <br />
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
