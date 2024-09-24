import React, { useMemo, useRef } from "react";
import {
  IonCol,
  IonContent,
  IonGrid,
  IonItem,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonRow,
  IonText,
  RefresherEventDetail,
} from "@ionic/react";
import Header from "../../components/Header/Header";
import Menu from "../../components/Menu/Menu";
import SwipeGesture from "../../components/SwipeGesture/SwipeGesture";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import AppointmentCard from "../../components/AppointmentCard/AppointmentCard";
import dayjs from "dayjs";
import { groupAppointmentsByDate } from "../../shared/utils/appointments.util";
import Badge from "../../components/Badge/Badge";

import "./Appointments.scss";

const CSSprefix = 'appointments';

const Appointments: React.FC = (): React.ReactElement => {
  const { scheduling: { events } } = useSelector((state: RootState) => state);

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => { };
  const appointmentsRef = useRef();
  const sortedEvents = useMemo(() => [...events?.events || []].sort(
    (a, b) => dayjs(a.startTime).valueOf() - dayjs(b.startTime).valueOf()
  ), [events?.events]);
  const groupedAppointments = useMemo(() => groupAppointmentsByDate(sortedEvents), [sortedEvents]);

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
          {groupedAppointments.map((event) => (
            <IonGrid key={event.date} fixed={true} className="ion-no-padding ion-no-margin">
              <IonRow className="ion-margin-start ion-no-margin">
                <IonCol size="auto" className="ion-margin-top">
                  <Badge appointmentDate={event.date} />
                </IonCol>
                <IonCol>
                  {event.appointments.map((appointment) => (
                    <AppointmentCard key={appointment?.id} appointment={appointment} />
                  ))}
                </IonCol>
              </IonRow>
            </IonGrid>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Appointments;
