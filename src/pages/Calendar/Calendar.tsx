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

import "./Calendar.scss";

const CSSprefix = 'calendar';

const Calendar: React.FC = (): React.ReactElement => {
  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => { };
  const calendarRef = useRef();

  return (
    <IonPage ref={calendarRef} className={CSSprefix} id="calendar-content">
      <LeftSwipeGesture parentRef={calendarRef} />
      <Header showMenu menuId="calendar-menu" />
      <Menu menuId="calendar-menu" contentId="calendar-content" />
      <IonContent fullscreen={true}>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>
      </IonContent>
    </IonPage>
  );
};

export default Calendar;
