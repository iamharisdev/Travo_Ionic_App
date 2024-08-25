import React, { useRef } from "react";
import {
  IonContent,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
} from "@ionic/react";
import Header from "../../components/Header/Header";
import Menu from "../../components/Menu/Menu";
import LeftSwipeGesture from "../../components/LeftSwipeGesture/LeftSwipeGesture";

import "./Profile.scss";

const CSSprefix = 'profile';

const Profile: React.FC = (): React.ReactElement => {
  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => { };
  const profileRef = useRef();

  return (
    <IonPage ref={profileRef} className={CSSprefix} id="profile-content">
      <LeftSwipeGesture parentRef={profileRef} menuId="profile-menu" />
      <Header showMenu menuId="profile-menu" />
      <Menu menuId="profile-menu" contentId="profile-content" />
      <IonContent fullscreen={true}>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
