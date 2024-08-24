import React from "react";
import {
  IonContent,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
} from "@ionic/react";
import Header from "../../components/Header/Header";
import Menu from "../../components/Menu/Menu";

import "./Calendar.scss";

const CSSprefix = 'calendar';

const Calendar: React.FC = (): React.ReactElement => {
  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => { };

  return (
    <IonPage className={CSSprefix} id="calendar-content">
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
