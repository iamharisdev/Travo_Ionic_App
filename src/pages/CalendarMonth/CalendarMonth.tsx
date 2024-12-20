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
import { Calendar, dayjsLocalizer, SlotInfo, Views } from 'react-big-calendar';
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
import { APPOINTMENT_DETAILS, CALENDAR_DAY, CALENDAR_MONTH, LOADING } from "../../shared/routes/routes";
import { AppointmentDetailTypeEnum } from "../../shared/types/appointment.type";
import { useHistory, useLocation } from "react-router";
import DatePicker from "../../components/DatePicker/DatePicker";
import { getDefaultDates } from "../../shared/utils/dates.util";

import "./CalendarMonth.scss";

const localizer = dayjsLocalizer(dayjs);

const CSSprefix = 'calendar-month';

const CalendarMonth: React.FC = (): React.ReactElement => {
  const { provider, scheduling: { events, state }, calendar: { selectedDate, selectedDates } } = useSelector((state: RootState) => state);
  const calendarMonthRef = useRef();
  const mappedEvents = useMemo(() => {
    if (state.loading) return getDefaultDates(selectedDates[0], selectedDates[1], 'month');

    return events.events.filter(({ startTime }) =>
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
    })).reverse();
  }, [events.events, state.loading, selectedDates]);
  const dispatch = useDispatch<AppDispatch>();
  const history = useHistory();
  const datePickerRef = useRef<HTMLIonPopoverElement>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const dateText = useMemo(() => months[dayjs(selectedDates[0]).month()], [selectedDates]);
  const [isCreateAppointmentOpen, setIsCreateAppointmentOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo>();
  const location = useLocation<{ prevPath?: string }>();
  const eventsInSameDate = useMemo(() => {
    let eventsInSameDate: Array<{ date: string, ids: Array<string> }> = [];
    mappedEvents.forEach(({ id, start }) => {
      const startDate = dayjs(start).format('YYYY-MM-DD');
      const exist = eventsInSameDate.find(({ date }) => date === startDate);

      if (exist) {
        eventsInSameDate = eventsInSameDate.map((e) => {
          if (e.date === startDate) {
            const newIds = [...e.ids];
            newIds.push(id!);
            return {
              ...e,
              ids: newIds
            }
          }

          return { ...e };
        });
      }

      if (!exist) {
        eventsInSameDate.push({ date: startDate, ids: [id!] });
      }
    });

    return eventsInSameDate;
  }, [mappedEvents]);

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
      }
    } catch (error) {
      console.error('error at load appointments by date: ', error);
    }
  }

  const { handlers, refPassthrough } = UseSwipeGesture({
    parentRef: calendarMonthRef,
    onSwipedLeft: () => dispatch(setNextMonth()),
    onSwipedRight: () => dispatch(setPrevMonth()),
    onSwipedDown: () => getAppointmentsHandler(),
  });

  const handleSelectSlot = useCallback(
    (slot: SlotInfo) => {
      setIsCreateAppointmentOpen(true);
      setSelectedSlot(slot);
    },
    [mappedEvents, isCreateAppointmentOpen]
  );

  useEffect(() => {
    if (location.pathname === CALENDAR_MONTH) {
      if (state.loading) {
        dispatch(setLoading({ loading: true, message: 'Loading appointments' }));
      }

      if (!state.loading) {
        dispatch(setLoading({ loading: false, message: '' }));
      }
    }
  }, [state.loading, location.pathname]);

  useIonViewWillEnter(() => {
    const start = dayjs().startOf('month').format('YYYY-MM-DD');
    const end = dayjs().endOf('month').format('YYYY-MM-DD');
    dispatch(setDates({ selectedDates: [start, end] }));
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
              eventWrapper: (props) => {
                const startDate = dayjs(props.event.start).format('YYYY-MM-DD');
                const currentDate = eventsInSameDate.find(({ date }) => date === startDate);
                let index = currentDate?.ids.findIndex((id: string) => id === props.event.id);
                let eventsLeft = (currentDate?.ids?.length! - index!) || 0;

                return (
                  <EventCard
                    {...props}
                    isMonth={true}
                    loading={state.loading}
                    index={index}
                    eventsLeft={eventsLeft}
                    onClick={(id: string) => history.push(`${APPOINTMENT_DETAILS}/${id}`, {
                      eventId: id,
                      type: AppointmentDetailTypeEnum.RESCHEDULE
                    })}
                  />
                );
              },
              header: (props) => <HeaderCalendar {...props} type="month" />,
            }}
            onNavigate={() => { }}
            selectable={true}
            longPressThreshold={300}
            onSelectSlot={handleSelectSlot}
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
          <IonContent>
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

export default CalendarMonth;
