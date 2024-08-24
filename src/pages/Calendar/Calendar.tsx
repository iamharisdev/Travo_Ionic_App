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

import "./Calendar.scss";

const CSSprefix = 'calendar';

const Calendar: React.FC = (): React.ReactElement => {
  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => { };
  const calendarRef = useRef();

  return (
    <IonPage ref={calendarRef} className={CSSprefix}>
      <LeftSwipeGesture parentRef={calendarRef} />
      <IonHeader>
        <IonToolbar>
          <IonTitle>Calendar</IonTitle>
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

export default Calendar;
