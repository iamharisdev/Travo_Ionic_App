import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
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
import { setNextMonth, setPrevMonth, setDates, setDate } from "../../state/calendarSlice";
import UseSwipeGesture from "../../hooks/useSwipeGesture";
import SwipeHandler from "../../components/SwipeHandler/SwipeHandler";
import CreateAppointment from "../../components/CreateAppointment/CreateAppointment";
import { addOutline } from "ionicons/icons";
import { APPOINTMENT_DETAILS, CALENDAR_DAY } from "../../shared/routes/routes";
import { AppointmentDetailTypeEnum } from "../../shared/types/appointment.type";
import { useHistory } from "react-router";
import DatePicker from "../../components/DatePicker/DatePicker";

import "./CalendarMonth.scss";

const localizer = dayjsLocalizer(dayjs);

const CSSprefix = 'calendar-month';

const CalendarMonth: React.FC = (): React.ReactElement => {
  const { provider, scheduling: { events, state }, calendar: { selectedDate, selectedDates } } = useSelector((state: RootState) => state);
  const calendarMonthRef = useRef();
  const createAppointmentRef = useRef<HTMLIonModalElement>(null);
  const mappedEvents = useMemo(() => events.events.filter(({ startTime }) =>
    dayjs(startTime).valueOf() >= dayjs(selectedDates[0]).valueOf() &&
    dayjs(startTime).valueOf() <= dayjs(selectedDates[1]).valueOf()
  ).map((event) => ({
    id: event?.id,
    title: JSON.stringify({
      id: event?.id,
      service: event?.patientServiceName,
      patient: event?.patientName,
      color: event?.color,
    }),
    start: dayjs(event?.startTime || '').toDate(),
    end: dayjs(event.endTime || '').toDate(),
  })), [events.events]);
  const dispatch = useDispatch<AppDispatch>();
  const history = useHistory();
  const datePickerRef = useRef<HTMLIonPopoverElement>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const dateText = useMemo(() => months[dayjs(selectedDates[0]).month()], [selectedDates]);

  const openDatePickerHandler = useCallback((e: any) => {
    if (datePickerRef.current) {
      datePickerRef.current!.event = e;
    }
    setDatePickerOpen(true);
  }, [datePickerRef.current]);

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
          showDatePicker={true}
          datePickerText={dateText}
          datePickerCB={openDatePickerHandler}
        />
        <IonContent {...handlers} ref={refPassthrough}>
          <Calendar
            defaultDate={selectedDates[0]}
            date={selectedDates[0]}
            defaultView={Views.MONTH}
            events={mappedEvents}
            localizer={localizer}
            showAllEvents={true}
            toolbar={false}
            views={{
              month: true
            }}
            timeslots={2}
            components={{
              eventWrapper: (props) => (
                <EventCard
                  {...props}
                  isMonth={true}
                  onClick={(id: string) => history.push(`${APPOINTMENT_DETAILS}/${id}`, {
                    eventId: id,
                    type: AppointmentDetailTypeEnum.RESCHEDULE
                  })}
                />
              ),
              header: (props) => <HeaderCalendar {...props} type="month" />,
            }}
            onNavigate={() => { }}
          />
          <IonFab slot="fixed" vertical="bottom" horizontal="end">
            <IonFabButton id="create-appointment-from-calendar-month">
              <IonIcon icon={addOutline} />
            </IonFabButton>
          </IonFab>
        </IonContent>
        <IonPopover
          ref={datePickerRef}
          className={`${CSSprefix}-date-picker-popover`}
          isOpen={datePickerOpen}
          size="auto"
          onDidDismiss={() => setDatePickerOpen(false)}
        >
          <IonContent fullscreen={true}>
            <DatePicker
              date={selectedDate}
              onSelectedDate={(date) => {
                setDatePickerOpen(false);
                dispatch(setDate(date as string));
                history.push(CALENDAR_DAY);
              }}
              onTriggerAction={getAppointmentsHandler}
            />
          </IonContent>
        </IonPopover>
        <CreateAppointment modalRef={createAppointmentRef} trigger="create-appointment-from-calendar-month" />
      </IonPage>
    </>
  );
};

export default CalendarMonth;
