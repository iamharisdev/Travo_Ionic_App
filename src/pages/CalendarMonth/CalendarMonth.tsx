import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  IonContent,
  IonPage,
  IonPopover,
  useIonViewWillEnter,
} from "@ionic/react";
import Header from "../../components/Header/Header";
import Menu from "../../components/Menu/Menu";
import { CALENDAR_MONTH_MENU_ID } from "../../shared/constants/menu";
import { Calendar, dayjsLocalizer, Views } from 'react-big-calendar';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import EventCard from "../../components/EventCard/EventCard";
import { months } from "../../shared/constants/dates";
import { setLoading } from "../../state/loadingSlice";
import { getEventsAction } from "../../state/schedulingSlice";
import HeaderCalendar from "../../components/HeaderCalendar/HeaderCalendar";
import { setNextMonth, setPrevMonth, setDates } from "../../state/calendarSlice";
import UseSwipeGesture from "../../hooks/useSwipeGesture";
import SwipeHandler from "../../components/SwipeHandler/SwipeHandler";
// import DatePicker from "../../components/DatePicker/DatePicker";

import "./CalendarMonth.scss";

const localizer = dayjsLocalizer(dayjs);

const CSSprefix = 'calendar-month';

const CalendarMonth: React.FC = (): React.ReactElement => {
  const { provider, scheduling: { events, state }, calendar: { selectedDate, selectedDates } } = useSelector((state: RootState) => state);
  const calendarMonthRef = useRef();
  // const datePickerRef = useRef<HTMLIonPopoverElement>(null);
  // const [datePickerOpen, setDatePickerOpen] = useState(false);
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

  // const openDatePickerHandler = useCallback((e: any) => {
  //   if (datePickerRef.current) {
  //     datePickerRef.current!.event = e;
  //   }
  //   setDatePickerOpen(true);
  // }, [datePickerRef.current]);

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

  const { handlers, refPassthrough } = UseSwipeGesture({
    parentRef: calendarMonthRef,
    onSwipedLeft: () => dispatch(setNextMonth()),
    onSwipedRight: () => dispatch(setPrevMonth()),
  });

  useEffect(() => {
    if (selectedDates.length === 2) {
      getAppointmentsHandler();
    }
  }, [selectedDates, state.success]);

  useIonViewWillEnter(() => {
    const start = dayjs().startOf('month').format('YYYY-MM-DD');
    const end = dayjs().endOf('month').format('YYYY-MM-DD');
    dispatch(setDates({ selectedDates: [start, end] }));
    getAppointmentsHandler();
  }, []);

  return (
    <>
      <Menu menuId={CALENDAR_MONTH_MENU_ID} contentId="calendar-week-content" />
      <IonPage ref={calendarMonthRef} className={CSSprefix} id="calendar-week-content">
        <SwipeHandler parentRef={calendarMonthRef} />
        <Header
          showMenu
          menuId={CALENDAR_MONTH_MENU_ID}
          leftLabel={dateText}
        />
        <IonContent {...handlers} ref={refPassthrough}>
          <Calendar
            defaultDate={selectedDate}
            date={selectedDate}
            defaultView={Views.MONTH}
            events={mappedEvents}
            localizer={localizer}
            toolbar={false}
            views={{
              month: true
            }}
            timeslots={2}
            components={{
              eventWrapper: (props) => <EventCard {...props} />,
              header: (props) => <HeaderCalendar {...props} type="month" />,
            }}
            onNavigate={() => { }}
          />
        </IonContent>
        {/* // TODO: check if we neet date picker for this month view */}
        {/* <IonPopover
          ref={datePickerRef}
          className={`${CSSprefix}-date-picker-popover`}
          isOpen={datePickerOpen}
          size="auto"
          onDidDismiss={() => setDatePickerOpen(false)}
        >
          <IonContent fullscreen={true}>
            <DatePicker multiple dates={selectedDates} onSelectedDates={(dates) => {
              console.log('selectedDAtes: ', dates);
              if (dates.length === 2) {
                dispatch(setDates({ selectedDates: dates }))
              }
            }} onTriggerAction={getAppointmentsHandler} />
          </IonContent>
        </IonPopover> */}
      </IonPage>
    </>
  );
};

export default CalendarMonth;
