import React from "react";
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
import { PROFILE_INFORMATION } from "../../shared/routes/routes";
import { useHistory } from "react-router";

import "./MyProfile.scss";

const CSSprefix = 'my-profile';

const MyProfile: React.FC = (): React.ReactElement => {
  const history = useHistory();

  return (
    <IonPage className={CSSprefix}>
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
        <IonItem className="ion-margin-bottom" lines="none">
          <IonText>
            Business information
          </IonText>
          <IonButton slot="end" fill="clear" size="small" className="ion-no-margin">
            <IonIcon slot="icon-only" color="dark" icon={caretForwardOutline} size="small" />
          </IonButton>
        </IonItem>
        <IonItem className="ion-margin-bottom" lines="none">
          <IonText>
            Branding
          </IonText>
          <IonButton slot="end" fill="clear" size="small" className="ion-no-margin">
            <IonIcon slot="icon-only" color="dark" icon={caretForwardOutline} size="small" />
          </IonButton>
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

export default MyProfile;
