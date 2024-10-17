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
import { CALENDAR_MENU_ID } from "../../shared/constants/menu";
import Scheduling from "../../components/Scheduling/Scheduling";
import UseSwipeGesture from "../../hooks/useSwipeGesture";
import SwipeHandler from "../../components/SwipeHandler/SwipeHandler";
import { closeMenuHandler, openMenuHandler } from "../../shared/utils/menu.util";

import "./Calendar.scss";

const CSSprefix = 'calendar';

const Calendar: React.FC = (): React.ReactElement => {
  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => { };
  const calendarRef = useRef();

  const { handlers, refPassthrough } = UseSwipeGesture({
    parentRef: calendarRef,
    onSwipedLeft: async () => closeMenuHandler(CALENDAR_MENU_ID),
    onSwipedRight: async () => openMenuHandler(CALENDAR_MENU_ID),
  });

  return (
    <>
      <Menu menuId={CALENDAR_MENU_ID} contentId="calendar-content" />
      <IonPage {...handlers} ref={refPassthrough} className={CSSprefix} id="calendar-content">
        <SwipeHandler parentRef={calendarRef} />
        <Header showMenu menuId={CALENDAR_MENU_ID} />
        <IonContent fullscreen={true}>
          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent />
          </IonRefresher>
          <Scheduling />
        </IonContent>
      </IonPage>
    </>
  );
};

export default Calendar;
