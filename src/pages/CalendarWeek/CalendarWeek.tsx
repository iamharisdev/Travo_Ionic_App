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
import { CALENDAR_WEEK_MENU_ID } from "../../shared/constants/menu";
import { Calendar, dayjsLocalizer, Event, SlotInfo, Views } from 'react-big-calendar';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import EventCard from "../../components/EventCard/EventCard";
import { months } from "../../shared/constants/dates";
import { setLoading } from "../../state/loadingSlice";
import { getEventsAction, getGoogleEventsAction, getMicrosoftEventsAction } from "../../state/schedulingSlice";
import HeaderCalendar from "../../components/HeaderCalendar/HeaderCalendar";
import { setNextWeek, setPrevWeek, setDates, setDate } from "../../state/calendarSlice";
import UseSwipeGesture from "../../hooks/useSwipeGesture";
import SwipeHandler from "../../components/SwipeHandler/SwipeHandler";
import CreateAppointment from "../../components/CreateAppointment/CreateAppointment";
import { addOutline } from "ionicons/icons";
import { APPOINTMENT_DETAILS, CALENDAR_DAY, CALENDAR_WEEK } from "../../shared/routes/routes";
import { AppointmentDetailTypeEnum, AppointmentStatusEnum } from "../../shared/types/appointment.type";
import { useHistory, useLocation } from "react-router";
import DatePicker from "../../components/DatePicker/DatePicker";
import { getDefaultDates } from "../../shared/utils/dates.util";

import "./CalendarWeek.scss";

const localizer = dayjsLocalizer(dayjs);

const CSSprefix = 'calendar-week';

const CalendarWeek: React.FC = (): React.ReactElement => {
  const history = useHistory();
  const { provider, scheduling: { events, microsoftEvents, googleEvents, state }, calendar: { selectedDate, selectedDates } } = useSelector((state: RootState) => state);
  const calendarWeekRef = useRef();
  const mappedEvents: Array<Event & { id?: string }> = useMemo(() => {
    if (state.loading) return getDefaultDates(selectedDates[0], selectedDates[1], 'week')

    return events.events.filter(({ startTime, status }) =>
      dayjs(startTime).valueOf() >= dayjs(selectedDates[0]).valueOf() &&
      dayjs(startTime).valueOf() <= dayjs(selectedDates[1]).valueOf() &&
      (status === AppointmentStatusEnum.CONFIRMEND || status === AppointmentStatusEnum.BUSY)
    ).map((event) => ({
      id: event?.id,
      title: JSON.stringify({
        id: event?.id,
        service: event?.patientServiceName || event?.title,
        patient: event?.patientName || event?.providerName,
        color: event?.color,
        start: event?.allDay ? dayjs(event.endTime).startOf('day').toDate() : dayjs(event?.startTime || '').toDate(),
        end: event?.allDay ? dayjs(event.endTime).endOf('day').toDate() : dayjs(event.endTime || '').toDate(),
        redirect: event?.status !== AppointmentStatusEnum.BUSY,
        isMeetingEvent: event?.status === AppointmentStatusEnum.BUSY,
      }),
      start: event?.allDay ? dayjs(event.endTime).startOf('day').toDate() : dayjs(event?.startTime || '').toDate(),
      end: event?.allDay ? dayjs(event.endTime).endOf('day').toDate() : dayjs(event.endTime || '').toDate(),
      allDay: event?.allDay
    }))
  }, [events.events, state.loading, selectedDates]);

  const mappedBackgroundEvents: Array<Event & { id?: string }> = useMemo(() => {
    if (state.loading) return getDefaultDates(selectedDates[0], selectedDates[1], 'month');

    const externalCalendarEvents = [...microsoftEvents, ...googleEvents];

    return externalCalendarEvents.filter(({ startTime, status }) =>
      dayjs(startTime).valueOf() >= dayjs(selectedDates[0]).valueOf() &&
      dayjs(startTime).valueOf() <= dayjs(selectedDates[1]).valueOf() &&
      (status === AppointmentStatusEnum.OCCURRENCE)
    ).map((event) => ({
      id: event?.id,
      title: JSON.stringify({
        id: event?.id,
        service: event?.patientServiceName || event?.title,
        patient: event?.patientName || event?.providerName,
        color: event?.color,
        redirect: event?.status !== AppointmentStatusEnum.OCCURRENCE,
        isMeetingEvent: event?.status === AppointmentStatusEnum.BUSY,
      }),
      start: event?.allDay ? dayjs(event.endTime).startOf('day').toDate() : dayjs(event?.startTime || '').toDate(),
      end: event?.allDay ? dayjs(event.endTime).endOf('day').toDate() : dayjs(event.endTime || '').toDate(),
      allDay: event?.allDay
    })).sort((a: any, b: any) => dayjs(a.start).valueOf() - dayjs(b.start).valueOf());
  }, [microsoftEvents, googleEvents, state.loading, selectedDates]);

  const dispatch = useDispatch<AppDispatch>();
  const datePickerRef = useRef<HTMLIonPopoverElement>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const dateText = useMemo(() => months[dayjs(selectedDates[0]).month()], [selectedDates]);
  const [isCreateAppointmentOpen, setIsCreateAppointmentOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo>();
  const location = useLocation();

  const openDatePickerHandler = useCallback((e: any) => {
    if (datePickerRef.current) {
      datePickerRef.current!.event = e;
    }
    setDatePickerOpen(true);
  }, [datePickerRef.current]);

  const getAppointmentsHandler = async () => {
    try {
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
        await dispatch(getMicrosoftEventsAction({
          practiceId: providerPractice.practiceId,
          providerId: providerPractice.providerId,
          start: dayjs(selectedDates[0]).startOf('day').toISOString(),
          end: dayjs(selectedDates[1]).endOf('day').toISOString(),
        }));
        await dispatch(getGoogleEventsAction({
          practiceId: providerPractice.practiceId,
          providerId: providerPractice.providerId,
          start: dayjs(selectedDates[0]).startOf('day').toISOString(),
          end: dayjs(selectedDates[1]).endOf('day').toISOString(),
        }));
      }
    } catch (error) {
      dispatch(setLoading({ loading: false, message: '' }));
    }
  }

  const { handlers, refPassthrough } = UseSwipeGesture({
    parentRef: calendarWeekRef,
    onSwipedLeft: () => dispatch(setNextWeek()),
    onSwipedRight: () => dispatch(setPrevWeek()),
    onSwipedDown: () => getAppointmentsHandler(),
  });

  useEffect(() => {
    if (location.pathname === CALENDAR_WEEK && !isCreateAppointmentOpen) {
      if (state.loading) {
        dispatch(setLoading({ loading: true, message: 'Loading appointments' }));
      }

      if (!state.loading) {
        dispatch(setLoading({ loading: false, message: '' }));
      }
    }
  }, [state.loading, location.pathname, isCreateAppointmentOpen]);

  useIonViewWillEnter(() => {
    const start = dayjs().startOf('week').format('YYYY-MM-DD');
    const end = dayjs().endOf('week').format('YYYY-MM-DD');
    dispatch(setDates({ selectedDates: [start, end] }));
    setSelectedSlot(undefined);
  }, []);

  return (
    <>
      <Menu menuId={CALENDAR_WEEK_MENU_ID} contentId="calendar-week-content" />
      <IonPage ref={calendarWeekRef} className={CSSprefix} id="calendar-week-content">
        <SwipeHandler parentRef={calendarWeekRef} />
        <Header
          showMenu
          menuId={CALENDAR_WEEK_MENU_ID}
          showDatePicker={true}
          datePickerText={dateText}
          datePickerCB={openDatePickerHandler}
        />
        <IonContent {...handlers} ref={refPassthrough}>
          <Calendar
            defaultDate={selectedDates[0]}
            date={selectedDates[0]}
            defaultView={Views.WEEK}
            events={mappedEvents}
            backgroundEvents={mappedBackgroundEvents}
            localizer={localizer}
            showAllEvents={true}
            toolbar={false}
            views={{
              week: true
            }}
            timeslots={2}
            dayLayoutAlgorithm="no-overlap"
            components={{
              eventWrapper: (props) => (
                <EventCard
                  {...props}
                  loading={state.loading}
                />
              ),
              header: (props) => <HeaderCalendar {...props} />,
            }}
            onNavigate={() => { }}
            selectable={true}
            longPressThreshold={0}
            onSelectSlot={(slot) => {
              dispatch(setDate(dayjs(slot.start).toISOString()));
              history.push(CALENDAR_DAY);
            }}
          />
          <IonFab slot="fixed" vertical="bottom" horizontal="end">
            <IonFabButton onClick={() => setIsCreateAppointmentOpen(true)}>
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
              onTriggerAction={() => setDatePickerOpen(false)}
            />
          </IonContent>
        </IonPopover>
        <CreateAppointment isOpen={isCreateAppointmentOpen} selectedSlot={selectedSlot} setIsOpen={setIsCreateAppointmentOpen} />
      </IonPage>
    </>
  );
};

export default CalendarWeek;
