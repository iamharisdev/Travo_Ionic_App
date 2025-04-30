import React, { useRef } from "react";
import {
  IonContent,
  IonItem,
  IonPage,
  IonText,
  IonList,
  IonLabel,
  IonNote,
} from "@ionic/react";

import Header from "../../components/Header/Header";
import UseSwipeGesture from "../../hooks/useSwipeGesture";
import { useHistory } from "react-router";
import SwipeHandler from "../../components/SwipeHandler/SwipeHandler";

import "./Notifications.scss";

const CSSprefix = "notifications";

const notifications = [
  {
    id: 1,
    title: "1:1 Coaching for Peter Parker starts in 10 mins.",
    date: "Wed, Aug 28, 2024, 3:20 PM",
    unread: true,
  },
  {
    id: 2,
    title: "Bruce Wayne has canceled his 1:1 Coaching appointment.",
    date: "Wed, Aug 28, 2024, 9:42 AM",
    unread: true,
  },
  {
    id: 3,
    title: "Supportive Therapy for Lana Lang starts in 30 mins.",
    date: "Wed, Aug 28, 2024, 10:00 AM",
    unread: true,
  },
  {
    id: 4,
    title: "You have an appointment request from Sarah Connor.",
    date: "Wed, Aug 28, 2024, 9:42 AM",
    unread: true,
  },
  {
    id: 5,
    title: "Bruce Wayne has canceled his Psychoanalysis appointment.",
    date: "Wed, Aug 28, 2024, 9:42 AM",
    unread: false,
  },
  {
    id: 6,
    title: "Supportive Therapy for Harry Potter starts in 30 mins.",
    date: "Wed, Aug 28, 2024, 10:00 AM",
    unread: false,
  },
];

const NotificationsPage: React.FC = (): React.ReactElement => {
  const notificationsRef = useRef();
  const history = useHistory();
  const { handlers, refPassthrough } = UseSwipeGesture({
    parentRef: notificationsRef,
    onSwipedRight: () => history.goBack(),
  });

  return (
    <IonPage className={CSSprefix} {...handlers} ref={refPassthrough}>
      <SwipeHandler parentRef={notificationsRef} />
      <IonContent className={`${CSSprefix}-content`}>
        <IonItem className="ion-margin-vertical" lines="none">
          <IonText className={`${CSSprefix}-mark-read`}>Mark all as read</IonText>
        </IonItem>

        <IonList className={`${CSSprefix}-list`}>
          {notifications.map((notification) => (
            <IonItem key={notification.id} lines="none" className={`${CSSprefix}-item`}>
              <IonLabel className={`${CSSprefix}-message-label`}>
                <IonText className={`${CSSprefix}-message`}>{notification.title}</IonText>
                <IonNote className={`${CSSprefix}-date`}>
                  {notification.date}
                </IonNote>
              </IonLabel>

              {notification.unread && <span className={`${CSSprefix}-dot`} />}
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default NotificationsPage;
