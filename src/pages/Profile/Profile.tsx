import React, { useRef } from "react";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonText,
} from "@ionic/react";
import SwipeGesture from "../../components/SwipeGesture/SwipeGesture";
import Header from "../../components/Header/Header";
import { caretForwardOutline } from "ionicons/icons";
import { MY_PROFILE, SUBSCRIPTION_DETAILS } from "../../shared/routes/routes";
import { useHistory } from "react-router";
import Menu from "../../components/Menu/Menu";
import { PROFILE_MENU_ID } from "../../shared/constants/menu";

import "./Profile.scss";

const CSSprefix = 'profile';

const Profile: React.FC = (): React.ReactElement => {
  const profileRef = useRef();
  const history = useHistory();

  return (
    <>
      <Menu menuId={PROFILE_MENU_ID} contentId="profile-content" />
      <IonPage ref={profileRef} className={CSSprefix} id="profile-content">
        <SwipeGesture parentRef={profileRef} menuId={PROFILE_MENU_ID} />
        <Header showMenu menuId={PROFILE_MENU_ID} />
        <IonContent fullscreen={true} className={CSSprefix}>
          <IonItem className="ion-margin-vertical" lines="none">
            <IonText className={`${CSSprefix}-title`}>
              Profile settings
            </IonText>
          </IonItem>
          <IonItem
            className="ion-margin-vertical"
            lines="none"
            onClick={() => history.push(MY_PROFILE)}
          >
            <IonText>My profile</IonText>
            <IonButton slot="end" fill="clear" size="small" className="ion-no-margin">
              <IonIcon slot="icon-only" color="dark" icon={caretForwardOutline} size="small" />
            </IonButton>
          </IonItem>
          <IonItem
            lines="none"
            onClick={() => history.push(SUBSCRIPTION_DETAILS)}
          >
            <IonText>Subscription details</IonText>
            <IonButton slot="end" fill="clear" size="small" className="ion-no-margin">
              <IonIcon slot="icon-only" color="dark" icon={caretForwardOutline} size="small" />
            </IonButton>
          </IonItem>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Profile;
