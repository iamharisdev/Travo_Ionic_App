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
import { CALENDAR_MENU_ID } from "../../shared/constants/menu";

import "./Calendar.scss";

const CSSprefix = 'calendar';

const Calendar: React.FC = (): React.ReactElement => {
  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => { };
  const calendarRef = useRef();

  return (
    <>
      <Menu menuId={CALENDAR_MENU_ID} contentId="calendar-content" />
      <IonPage ref={calendarRef} className={CSSprefix} id="calendar-content">
        <SwipeGesture parentRef={calendarRef} menuId={CALENDAR_MENU_ID} />
        <Header showMenu menuId={CALENDAR_MENU_ID} />
        <IonContent fullscreen={true}>
          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent />
          </IonRefresher>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Calendar;
