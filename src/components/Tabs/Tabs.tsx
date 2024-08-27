import React, { useEffect } from "react";
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { calendarOutline, clipboardOutline, personCircleOutline } from "ionicons/icons";
import { Redirect, Route } from "react-router-dom";
import { APPOINTMENTS, CALENDAR, DASHBOARD, PROFILE } from "../../shared/routes/routes";
import Appointments from "../../pages/Appointments/Appointments";
import { IonReactRouter } from "@ionic/react-router";
import Calendar from "../../pages/Calendar/Calendar";
import Profile from "../../pages/Profile/Profile";

import "./Tabs.scss";

const Tabs: React.FC = (): React.ReactElement => {
  return (
    <IonReactRouter>
      <IonTabs className="tabs">
        <IonRouterOutlet defaultValue={APPOINTMENTS}>
          <Redirect exact path={DASHBOARD} to={APPOINTMENTS} />
          <Route exact path={APPOINTMENTS} component={Appointments} />
          <Route exact path={CALENDAR} component={Calendar} />
          <Route exact path={PROFILE} component={Profile} />
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="appointments" href={APPOINTMENTS}>
            <IonIcon icon={clipboardOutline} />
            <IonLabel>Appointments</IonLabel>
          </IonTabButton>
          <IonTabButton tab="calendar" href={CALENDAR}>
            <IonIcon icon={calendarOutline} />
            <IonLabel>Calendar</IonLabel>
          </IonTabButton>
          <IonTabButton tab="profile" href={PROFILE}>
            <IonIcon icon={personCircleOutline} />
            <IonLabel>Profile</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
};

export default Tabs;
