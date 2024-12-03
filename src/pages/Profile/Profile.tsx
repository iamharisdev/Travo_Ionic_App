import React, { useRef } from "react";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonPage,
  IonText,
} from "@ionic/react";
import Header from "../../components/Header/Header";
import { caretForwardOutline, exitOutline } from "ionicons/icons";
import { MY_PROFILE, SUBSCRIPTION_DETAILS } from "../../shared/routes/routes";
import { useHistory } from "react-router";
import Menu from "../../components/Menu/Menu";
import { PROFILE_MENU_ID } from "../../shared/constants/menu";
import SwipeHandler from "../../components/SwipeHandler/SwipeHandler";
import UseSwipeGesture from "../../hooks/useSwipeGesture";
import { closeMenuHandler, openMenuHandler } from "../../shared/utils/menu.util";
import Logout from "../../components/Logout/Logout";

import "./Profile.scss";

const CSSprefix = 'profile';

const Profile: React.FC = (): React.ReactElement => {
  const profileRef = useRef();
  const history = useHistory();

  const { handlers, refPassthrough } = UseSwipeGesture({
    parentRef: profileRef,
    onSwipedLeft: async () => closeMenuHandler(PROFILE_MENU_ID),
    onSwipedRight: async () => openMenuHandler(PROFILE_MENU_ID),
  });

  return (
    <>
      <Menu menuId={PROFILE_MENU_ID} contentId="profile-content" />
      <IonPage className={CSSprefix} id="profile-content" {...handlers} ref={refPassthrough}>
        <SwipeHandler parentRef={profileRef} />
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
          <IonItem
            id="open-logout-modal"
            lines="none"
          >
            <IonText color="danger">Log out</IonText>
            <IonButton fill="clear" size="small" className="ion-no-margin">
              <IonIcon slot="icon-only" color="danger" icon={exitOutline} size="medium" />
            </IonButton>
          </IonItem>
        </IonContent>
        <Logout
          id="logout-modal"
          trigger="open-logout-modal"
          cancel={() => null}
          logout={() => null}
        />
      </IonPage>
    </>
  );
};

export default Profile;
