import React from "react";
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { calendarOutline, clipboardOutline, personCircleOutline } from "ionicons/icons";
import { Redirect, Route, useLocation } from "react-router-dom";
import { APPOINTMENT_CANCEL, APPOINTMENT_DETAILS, APPOINTMENT_DETAILS_EDIT, APPOINTMENT_REQUESTS, APPOINTMENTS, BRANDING, BUSINESS_INFORMATION, CALENDAR_DAY, CALENDAR_MONTH, CALENDAR_WEEK, DASHBOARD, MY_PROFILE, PROFILE, PROFILE_INFORMATION, SUBSCRIPTION_DETAILS } from "../../shared/routes/routes";
import Appointments from "../../pages/Appointments/Appointments";
import Profile from "../../pages/Profile/Profile";
import MyProfile from "../../pages/MyProfile/MyProfile";
import ProfileInformation from "../../pages/ProfileInformation/ProfileInformation";
import BusinessInformation from "../../pages/BusinessInformation/BusinessInformation";
import Branding from "../../pages/Branding/Branding";
import SubscriptionDetails from "../../pages/SubscriptionDetails/SubscriptionDetails";
import AppointmentDetails from "../../pages/AppointmentDetails/AppointmentDetails";
import AppointmentDetailsEdit from "../../pages/AppointmentDetailsEdit/AppointmentDetailsEdit";
import AppointmentRequests from "../../pages/AppointmentRequests/AppointmentRequests";
import AppointmentCancel from "../../pages/CancelAppointment/AppointmentCancel";
import CalendarDay from "../../pages/CalendarDay/CalendarDay";
import CalendarWeek from "../../pages/CalendarWeek/CalendarWeek";
import CalendarMonth from "../../pages/CalendarMonth/CalendarMonth";
import { App } from "@capacitor/app";
import useBiometrics from "../../hooks/useBiometrics";

import "./Tabs.scss";

const Tabs: React.FC = (): React.ReactElement => {
  const location = useLocation();
  const { checkSessionHandler } = useBiometrics();

  App.addListener('appStateChange', async ({ isActive }) => {
    console.log('App state changed. Is active?', isActive);
    if (
      (location.pathname === APPOINTMENTS
        || location.pathname === CALENDAR_DAY
        || location.pathname === CALENDAR_WEEK
        || location.pathname === CALENDAR_MONTH
        || location.pathname === PROFILE
        || location.pathname === MY_PROFILE
        || location.pathname === PROFILE_INFORMATION
        || location.pathname === BUSINESS_INFORMATION
        || location.pathname === BRANDING
        || location.pathname === SUBSCRIPTION_DETAILS
        || location.pathname === APPOINTMENT_DETAILS
        || location.pathname === APPOINTMENT_DETAILS_EDIT
        || location.pathname === APPOINTMENT_REQUESTS
        || location.pathname === APPOINTMENT_CANCEL) && isActive
    ) {
      // TODO: review this logic that affect session once we are logged in and pass from background to foreground
      await checkSessionHandler();
    }
  });

  return (
    <IonTabs className="tabs">
      <IonRouterOutlet>
        <Redirect exact path={DASHBOARD} to={APPOINTMENTS} />
        <Route exact path={APPOINTMENTS} component={Appointments} />
        <Route exact path={CALENDAR_DAY} component={CalendarDay} />
        <Route exact path={CALENDAR_WEEK} component={CalendarWeek} />
        <Route exact path={CALENDAR_MONTH} component={CalendarMonth} />
        <Route exact path={PROFILE} component={Profile} />
        <Route exact path={MY_PROFILE} component={MyProfile} />
        <Route exact path={PROFILE_INFORMATION} component={ProfileInformation} />
        <Route exact path={BUSINESS_INFORMATION} component={BusinessInformation} />
        <Route exact path={BRANDING} component={Branding} />
        <Route exact path={SUBSCRIPTION_DETAILS} component={SubscriptionDetails} />
        <Route exact path={`${APPOINTMENT_DETAILS}/:id`} component={AppointmentDetails} />
        <Route exact path={`${APPOINTMENT_DETAILS_EDIT}/:id`} component={AppointmentDetailsEdit} />
        <Route exact path={APPOINTMENT_REQUESTS} component={AppointmentRequests} />
        <Route exact path={APPOINTMENT_CANCEL} component={AppointmentCancel} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom" defaultValue="appointments">
        <IonTabButton tab="calendar" href={CALENDAR_MONTH}>
          <IonIcon icon={calendarOutline} />
          <IonLabel>Calendar</IonLabel>
        </IonTabButton>
        <IonTabButton tab="appointments" href={APPOINTMENTS}>
          <IonIcon icon={clipboardOutline} />
          <IonLabel>Appointments</IonLabel>
        </IonTabButton>
        <IonTabButton tab="profile" href={PROFILE}>
          <IonIcon icon={personCircleOutline} />
          <IonLabel>Profile</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
