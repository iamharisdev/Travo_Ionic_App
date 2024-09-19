import React, { useRef } from "react";
import {
  IonContent,
  IonItem,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonText,
  RefresherEventDetail,
} from "@ionic/react";
import Header from "../../components/Header/Header";
import Menu from "../../components/Menu/Menu";
import SwipeGesture from "../../components/SwipeGesture/SwipeGesture";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import AppointmentCard from "../../components/AppointmentCard/AppointmentCard";

import "./Appointments.scss";

const CSSprefix = 'appointments';

const Appointments: React.FC = (): React.ReactElement => {
  const { events } = useSelector((state: RootState) => state.scheduling);
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
        <IonList>
          <IonItem lines="none">
            <IonText className={`${CSSprefix}-from-to-date ion-text-center`}>
              August 4 - 10
            </IonText>
          </IonItem>
          {events?.events.map((event) => (
            <IonItem key={event.id} lines="none" className="ion-no-padding">
              <AppointmentCard event={event} />
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Appointments;
