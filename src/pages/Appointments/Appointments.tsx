import React, { useRef } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  RefresherEventDetail,
} from "@ionic/react";
import LeftSwipeGesture from "../../components/LeftSwipeGesture/LeftSwipeGesture";

import "./Appointments.scss";

const CSSprefix = 'appointments';

const Appointments: React.FC = (): React.ReactElement => {
  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => { };
  const appointmentsRef = useRef();

  return (
    <IonPage ref={appointmentsRef} className={CSSprefix}>
      <LeftSwipeGesture parentRef={appointmentsRef} />
      <IonHeader>
        <IonToolbar>
          <IonTitle>Appointments</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true}>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>
      </IonContent>
    </IonPage>
  );
};

export default Appointments;
