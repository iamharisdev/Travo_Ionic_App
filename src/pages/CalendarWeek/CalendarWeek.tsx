import React, { useMemo, useRef, useState } from "react";
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
import { CALENDAR_WEEK_MENU_ID } from "../../shared/constants/menu";
import { Calendar, dayjsLocalizer, Views } from 'react-big-calendar';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import EventCard from "../../components/EventCard/EventCard";
import { months, SEVEN_DAYS_FROM_TODAY, TODAY } from "../../shared/constants/dates";
import { setLoading } from "../../state/loadingSlice";
import { getEventsAction } from "../../state/schedulingSlice";
import HeaderCalendar from "../../components/HeaderCalendar/HeaderCalendar";
import CalendarSwipeGesture from "../../components/CalendarSwipeGesture/CalendarSwipeGesture";

import "./CalendarWeek.scss";

const localizer = dayjsLocalizer(dayjs);

const CSSprefix = 'calendar-week';

const CalendarWeek: React.FC = (): React.ReactElement => {
  const { provider, scheduling: { events }, calendar: { selectedDate } } = useSelector((state: RootState) => state);
  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => { };
  const calendarWeekRef = useRef();
  const calendarRef = useRef<HTMLDivElement | null>(null);
  // TODO: replace this with a dispatch of an action create date slide in redux toolkit
  const [selectedDates, setSelectedDates] = useState<string[]>([TODAY, SEVEN_DAYS_FROM_TODAY]);
  const mappedEvents = useMemo(() => events.events.filter(({ startTime }) =>
    dayjs(startTime).valueOf() >= dayjs(selectedDates[0]).valueOf() &&
    dayjs(startTime).valueOf() <= dayjs(selectedDates[1]).valueOf()
  ).map((event) => ({
    id: event?.id,
    title: JSON.stringify({
      service: event?.patientServiceName,
      patient: event?.patientName,
      color: event?.color,
    }),
    start: dayjs(event?.startTime || '').toDate(),
    end: dayjs(event.endTime || '').toDate(),
  })), [events.events]);
  const dispatch = useDispatch<AppDispatch>();
  const dateText = useMemo(() => months[dayjs(selectedDate).month()], [selectedDate]);

  // TODO: getAppointmentsHandler over the week
  const getAppointmentsHandler = async (dates: string[] | string) => {
    try {
      setSelectedDates(dates as string[]);
      dispatch(setLoading({ loading: true, message: 'Loading appointments' }));

      const [providerPractice] = provider.providerPractices;
      if (providerPractice) {
        await dispatch(getEventsAction({
          practiceId: providerPractice.practiceId,
          providerId: providerPractice.providerId,
          start: dayjs(dates[0]).startOf('day').toISOString(),
          end: dayjs(dates[1]).endOf('day').toISOString(),
          pageNumber: 0,
          pageSize: 999,
        }));
      }

      dispatch(setLoading({ loading: false, message: '' }));
    } catch (error) {
      dispatch(setLoading({ loading: false, message: '' }));
      setSelectedDates([]);
      console.error('error at load appointments by date: ', error);
    }
  }

  return (
    <>
      <Menu menuId={CALENDAR_WEEK_MENU_ID} contentId="calendar-week-content" />
      <IonPage ref={calendarWeekRef} className={CSSprefix} id="calendar-week-content">
        <SwipeGesture
          parentRef={calendarWeekRef}
          menuId={CALENDAR_WEEK_MENU_ID}
        />
        <Header
          showMenu
          menuId={CALENDAR_WEEK_MENU_ID}
          leftLabel={dateText}
        />
        <IonContent fullscreen={true}>
          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent />
          </IonRefresher>
          <div ref={calendarRef}>
            <CalendarSwipeGesture parentRef={calendarRef} />
            <Calendar
              defaultDate={selectedDate}
              date={selectedDate}
              defaultView={Views.WEEK}
              events={mappedEvents}
              localizer={localizer}
              toolbar={false}
              views={{
                week: true
              }}
              timeslots={2}
              components={{
                eventWrapper: (props) => <EventCard {...props} />,
                header: (props) => <HeaderCalendar {...props} />,
              }}
              onNavigate={() => { }}
            />
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default CalendarWeek;
