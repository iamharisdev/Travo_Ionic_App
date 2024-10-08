import React, { cloneElement, useMemo, useRef } from "react";
import {
  IonContent,
  IonItem,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonText,
  RefresherEventDetail,
} from "@ionic/react";
import Header from "../../components/Header/Header";
import Menu from "../../components/Menu/Menu";
import SwipeGesture from "../../components/SwipeGesture/SwipeGesture";
import { CALENDAR_DAY_MENU_ID } from "../../shared/constants/menu";
import { Calendar, dayjsLocalizer, Views } from 'react-big-calendar';
import dayjs from 'dayjs';
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import EventCard from "../../components/EventCard/EventCard";

import "./CalendarDay.scss";

const localizer = dayjsLocalizer(dayjs);

const CSSprefix = 'calendar-day';

const CalendarDay: React.FC = (): React.ReactElement => {
  const { scheduling: { events } } = useSelector((state: RootState) => state);
  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => { };
  const calendarDayRef = useRef();
  const mappedEvents = useMemo(() => events.events.filter(({ startTime }) => dayjs(startTime).date() === dayjs().date()).map((event) => ({
    id: event?.id,
    title: JSON.stringify({
      service: event?.patientServiceName,
      patient: event?.patientName,
      color: event?.color,
    }),
    start: dayjs(event?.startTime || '').toDate(),
    end: dayjs(event.endTime || '').toDate(),
  })), [events.events]);

  return (
    <>
      <Menu menuId={CALENDAR_DAY_MENU_ID} contentId="calendar-day-content" />
      <IonPage ref={calendarDayRef} className={CSSprefix} id="calendar-day-content">
        <SwipeGesture parentRef={calendarDayRef} menuId={CALENDAR_DAY_MENU_ID} />
        <Header showMenu menuId={CALENDAR_DAY_MENU_ID} />
        <IonContent fullscreen={true}>
          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent />
          </IonRefresher>
          <Calendar
            defaultDate={dayjs().toISOString()}
            defaultView={Views.DAY}
            events={mappedEvents}
            localizer={localizer}
            toolbar={false}
            views={{
              day: true
            }}
            timeslots={2}
            components={{
              timeGutterHeader: () => (
                <div className={`${CSSprefix}-date-container`}>
                  <IonText className={`${CSSprefix}-date`}>
                    {dayjs().format('dddd')}
                  </IonText>
                  <IonText className={`${CSSprefix}-day`}>
                    {dayjs().date()}
                  </IonText>
                </div>
              ),
              eventWrapper: (props) => <EventCard {...props} />,
            }}
          />
        </IonContent>
      </IonPage>
    </>
  );
};

export default CalendarDay;
