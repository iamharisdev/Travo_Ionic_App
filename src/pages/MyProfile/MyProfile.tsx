import React, { useMemo, useRef } from "react";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonPage,
  IonText,
} from "@ionic/react";
import Header from "../../components/Header/Header";
import { caretForwardOutline } from "ionicons/icons";
import { BRANDING, BUSINESS_INFORMATION, PROFILE_INFORMATION } from "../../shared/routes/routes";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import UseSwipeGesture from "../../hooks/useSwipeGesture";
import SwipeHandler from "../../components/SwipeHandler/SwipeHandler";

import "./MyProfile.scss";

const CSSprefix = 'my-profile';

const MyProfile: React.FC = (): React.ReactElement => {
  const myProfileRef = useRef();
  const history = useHistory();
  const { provider } = useSelector((state: RootState) => state);
  const isAdmin = useMemo(() => {
    if (provider.providerPractices.length > 0) {
      const [providerPractice] = provider.providerPractices;
      if (providerPractice.profileRole === 'Clinical Administrator' || 'Admin') return true;
    }
    return false;
  }, [provider.providerPractices]);

  const { handlers, refPassthrough } = UseSwipeGesture({
    parentRef: myProfileRef,
    onSwipedRight: () => history.goBack(),
  });

  return (
    <IonPage className={CSSprefix} {...handlers} ref={refPassthrough}>
      <SwipeHandler parentRef={myProfileRef} />
      <Header showBack showMenu={false} />
      <IonContent fullscreen={true} className={CSSprefix}>
        <IonItem className="ion-margin-vertical" lines="none">
          <IonText className={`${CSSprefix}-title ion-margin-top`}>
            My profile
          </IonText>
        </IonItem>
        <IonItem
          className="ion-margin-vertical"
          lines="none"
          onClick={() => history.push(PROFILE_INFORMATION)}
        >
          <IonText>
            My profile information
          </IonText>
          <IonButton slot="end" fill="clear" size="small" className="ion-no-margin">
            <IonIcon slot="icon-only" color="dark" icon={caretForwardOutline} size="small" />
          </IonButton>
        </IonItem>
        {isAdmin && (
          <>
            <IonItem
              className="ion-margin-bottom"
              lines="none"
              onClick={() => history.push(BUSINESS_INFORMATION)}
            >
              <IonText>
                Business information
              </IonText>
              <IonButton slot="end" fill="clear" size="small" className="ion-no-margin">
                <IonIcon slot="icon-only" color="dark" icon={caretForwardOutline} size="small" />
              </IonButton>
            </IonItem>
            <IonItem
              className="ion-margin-bottom"
              lines="none"
              onClick={() => history.push(BRANDING)}
            >
              <IonText>
                Branding
              </IonText>
              <IonButton slot="end" fill="clear" size="small" className="ion-no-margin">
                <IonIcon slot="icon-only" color="dark" icon={caretForwardOutline} size="small" />
              </IonButton>
            </IonItem>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default MyProfile;
