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
import SwipeGesture from "../../components/SwipeGesture/SwipeGesture";

import "./Appointments.scss";

const CSSprefix = 'appointments';

const Appointments: React.FC = (): React.ReactElement => {
  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => { };
  const appointmentsRef = useRef();

  return (
    <IonPage ref={appointmentsRef} className={CSSprefix} id="appointments-content">
      <SwipeGesture parentRef={appointmentsRef} menuId="appointments-menu" />
      <Header showMenu menuId="appointments-menu" />
      <Menu menuId="appointments-menu" contentId="appointments-content" />
      <IonContent fullscreen={true}>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>
      </IonContent>
    </IonPage>
  );
};

export default Appointments;
