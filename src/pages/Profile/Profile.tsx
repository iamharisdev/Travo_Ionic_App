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
import LeftSwipeGesture from "../../components/LeftSwipeGesture/LeftSwipeGesture";
import Header from "../../components/Header/Header";
import { caretForwardOutline } from "ionicons/icons";
import { MY_PROFILE } from "../../shared/routes/routes";
import { useHistory } from "react-router";

import "./Profile.scss";

const CSSprefix = 'profile';

const Profile: React.FC = (): React.ReactElement => {
  const profileRef = useRef();
  const history = useHistory();

  return (
    <IonPage ref={profileRef} className={CSSprefix}>
      <LeftSwipeGesture parentRef={profileRef} />
      <Header showMenu menuId="profile-menu" />
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
        <IonItem lines="none">
          <IonText>Subscription details</IonText>
          <IonButton slot="end" fill="clear" size="small" className="ion-no-margin">
            <IonIcon slot="icon-only" color="dark" icon={caretForwardOutline} size="small" />
          </IonButton>
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
