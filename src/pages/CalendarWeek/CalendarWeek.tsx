import React, { useEffect, useMemo, useRef } from "react";
import {
  IonContent,
  IonPage,
  useIonViewWillEnter,
} from "@ionic/react";
import Header from "../../components/Header/Header";
import Menu from "../../components/Menu/Menu";
import { CALENDAR_WEEK_MENU_ID } from "../../shared/constants/menu";
import { Calendar, dayjsLocalizer, Views } from 'react-big-calendar';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import EventCard from "../../components/EventCard/EventCard";
import { months } from "../../shared/constants/dates";
import { setLoading } from "../../state/loadingSlice";
import { getEventsAction } from "../../state/schedulingSlice";
import HeaderCalendar from "../../components/HeaderCalendar/HeaderCalendar";
import { useSwipeable } from "react-swipeable";
import { setNextWeek, setPrevWeek } from "../../state/calendarSlice";

import "./CalendarWeek.scss";

const localizer = dayjsLocalizer(dayjs);

const CSSprefix = 'calendar-week';

const CalendarWeek: React.FC = (): React.ReactElement => {
  const { provider, scheduling: { events, state }, calendar: { selectedDate, selectedDates } } = useSelector((state: RootState) => state);
  const calendarWeekRef = useRef();
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

  const getAppointmentsHandler = async () => {
    try {
      dispatch(setLoading({ loading: true, message: 'Loading appointments' }));

      const [providerPractice] = provider.providerPractices;
      if (providerPractice) {
        await dispatch(getEventsAction({
          practiceId: providerPractice.practiceId,
          providerId: providerPractice.providerId,
          start: dayjs(selectedDates[0]).startOf('day').toISOString(),
          end: dayjs(selectedDates[1]).endOf('day').toISOString(),
          pageNumber: 0,
          pageSize: 999,
        }));
      }

      dispatch(setLoading({ loading: false, message: '' }));
    } catch (error) {
      dispatch(setLoading({ loading: false, message: '' }));
      console.error('error at load appointments by date: ', error);
    }
  }

  const handlers = useSwipeable({
    onSwipedLeft: () => dispatch(setNextWeek()),
    onSwipedRight: () => dispatch(setPrevWeek()),
    delta: 10,
    preventScrollOnSwipe: false,
    trackTouch: true,
    trackMouse: false,
    rotationAngle: 0,
    swipeDuration: Infinity,
    touchEventOptions: { passive: true },
  });

  useEffect(() => {
    if (selectedDates.length === 2) {
      getAppointmentsHandler();
    }
  }, [selectedDates, state.success]);

  useIonViewWillEnter(() => {
    getAppointmentsHandler();
  }, []);

  return (
    <>
      <Menu menuId={CALENDAR_WEEK_MENU_ID} contentId="calendar-week-content" />
      <IonPage ref={calendarWeekRef} className={CSSprefix} id="calendar-week-content">
        <Header
          showMenu
          menuId={CALENDAR_WEEK_MENU_ID}
          leftLabel={dateText}
        />
        <IonContent {...handlers}>
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
        </IonContent>
      </IonPage>
    </>
  );
};

export default CalendarWeek;
