import {
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonPage,
  IonPopover,
  IonText,
  RefresherEventDetail,
  useIonViewWillEnter,
} from '@ionic/react';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/pt'; // Portuguese
import { addOutline } from 'ionicons/icons';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Calendar, dayjsLocalizer, Event, SlotInfo, Views } from 'react-big-calendar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import CreateAppointment from '../../components/CreateAppointment/CreateAppointment';
import DatePicker from '../../components/DatePicker/DatePicker';
import EventCard from '../../components/EventCard/EventCard';
import Header from '../../components/Header/Header';
import HeaderCalendar from '../../components/HeaderCalendar/HeaderCalendar';
import Menu from '../../components/Menu/Menu';
import usePresentToast from '../../hooks/usePresentToast';
import UseSwipeGesture from '../../hooks/useSwipeGesture';
import { CALENDAR_MONTH_MENU_ID } from '../../shared/constants/menu';
import { CALENDAR_DAY, CALENDAR_MONTH } from '../../shared/routes/routes';
import { AppointmentStatusEnum } from '../../shared/types/appointment.type';
import { getDefaultDates } from '../../shared/utils/dates.util';
import { setDate, setDates, setNextMonth, setPrevMonth } from '../../state/calendarSlice';
import { setLoading } from '../../state/loadingSlice';
import {
  getEventsAction,
  getGoogleEventsAction,
  getMicrosoftEventsAction,
} from '../../state/schedulingSlice';
import { AppDispatch, RootState } from '../../state/store';
import './CalendarMonth.scss';

const CSSprefix = 'calendar-month';

const CalendarMonth: React.FC = (): React.ReactElement => {
  const {
    provider,
    scheduling: { events, microsoftEvents, googleEvents, state },
    calendar: { selectedDate, selectedDates },
    white: { lang },
  } = useSelector((state: RootState) => state);
  const calendarMonthRef = useRef();
  const { t } = useTranslation();
  const history = useHistory();

  const isDraggingRef = useRef(false);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);

  const setDayjsLocale = () => {
    dayjs.locale(lang); // Set global Day.js locale
    return dayjsLocalizer(dayjs); // Recreate localizer
  };

  const dateText = useMemo(() => {
    dayjs.locale(lang); // Ensure the locale is set before formatting

    return dayjs(selectedDates[0]).format('MMMM');
  }, [selectedDates]);

  const localizer = useMemo(() => setDayjsLocale(), [lang]);

  const mappedEvents: Array<Event & { id?: string }> = useMemo(() => {
    if (state.loading) return getDefaultDates(selectedDates[0], selectedDates[1], 'month');

    return [...events.events, ...microsoftEvents, ...googleEvents]
      .filter(
        ({ startTime, status }) =>
          dayjs(startTime).valueOf() >= dayjs(selectedDates[0]).valueOf() &&
          dayjs(startTime).valueOf() <= dayjs(selectedDates[1]).endOf('day').valueOf() &&
          status !== AppointmentStatusEnum.CANCELLED
      )
      .map(event => ({
        id: event?.id,
        title: JSON.stringify({
          id: event?.id,
          service: event?.patientServiceName || event?.title,
          patient: event?.patientName || event?.providerName,
          color: event?.color,
          redirect: event?.status !== AppointmentStatusEnum.BUSY,
          isMeetingEvent: event?.status === AppointmentStatusEnum.BUSY,
        }),
        start: event?.allDay
          ? dayjs(event.endTime).startOf('day').toDate()
          : dayjs(event?.startTime || '').toDate(),
        end: event?.allDay
          ? dayjs(event.endTime).endOf('day').toDate()
          : dayjs(event.endTime || '').toDate(),
        allDay: event?.allDay,
      }))
      .sort((a: any, b: any) => dayjs(a.start).valueOf() - dayjs(b.start).valueOf());
  }, [events.events, microsoftEvents, googleEvents, state.loading, selectedDates]);

  const dispatch = useDispatch<AppDispatch>();

  const datePickerRef = useRef<HTMLIonPopoverElement>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const [isCreateAppointmentOpen, setIsCreateAppointmentOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo>();
  const location = useLocation<{ prevPath?: string }>();
  const eventsInSameDate = useMemo(() => {
    let eventsInSameDate: Array<{ date: string; ids: Array<string> }> = [];
    mappedEvents.forEach(({ id, start }) => {
      const startDate = dayjs(start).format('YYYY-MM-DD');
      const exist = eventsInSameDate.find(({ date }) => date === startDate);

      if (exist) {
        eventsInSameDate = eventsInSameDate.map(e => {
          if (e.date === startDate) {
            const newIds = [...e.ids];
            newIds.push(id!);
            return {
              ...e,
              ids: newIds,
            };
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

  const openDatePickerHandler = useCallback(
    (e: any) => {
      if (datePickerRef.current) {
        datePickerRef.current!.event = e;
      }
      setDatePickerOpen(true);
    },
    [datePickerRef.current]
  );

  const getAppointmentsHandler = async () => {
    try {
      const [providerPractice] = provider?.providerPractices;

      if (providerPractice) {
        await dispatch(
          getEventsAction({
            practiceId: providerPractice.practiceId,
            providerId: providerPractice.providerId,
            start: dayjs().subtract(3, 'months').toISOString(),
            end: dayjs().add(5, 'months').toISOString(),
            pageNumber: 0,
            pageSize: 999,
          })
        );
        await dispatch(
          getMicrosoftEventsAction({
            practiceId: providerPractice.practiceId,
            providerId: providerPractice.providerId,
            start: dayjs(selectedDates[0]).startOf('day').toISOString(),
            end: dayjs(selectedDates[1]).add(5, 'months').endOf('day').toISOString(),
          })
        );
        await dispatch(
          getGoogleEventsAction({
            practiceId: providerPractice.practiceId,
            providerId: providerPractice.providerId,
            start: dayjs(selectedDates[0]).startOf('day').toISOString(),
            end: dayjs(selectedDates[1]).add(5, 'months').endOf('day').toISOString(),
          })
        );
      }
    } catch (error) {
      console.error('error at load appointments by date: ', error);
    }
  };

  const { handlers, refPassthrough } = UseSwipeGesture({
    parentRef: calendarMonthRef,
    onSwipedLeft: () => dispatch(setNextMonth()),
    onSwipedRight: () => dispatch(setPrevMonth()),
    onSwipedDown: () => console.log('Swipe down'),
  });

  useEffect(() => {
    if (location.pathname === CALENDAR_MONTH && !isCreateAppointmentOpen) {
      if (state.loading) {
        dispatch(setLoading({ loading: true, message: `${t('loading_appointments')}` }));
      }

      if (!state.loading) {
        dispatch(setLoading({ loading: false, message: '' }));
      }
    }
  }, [state.loading, location.pathname, isCreateAppointmentOpen]);

  useIonViewWillEnter(() => {
    const start = dayjs().startOf('month').format('YYYY-MM-DD');
    const end = dayjs().endOf('month').format('YYYY-MM-DD');
    dispatch(setDates({ selectedDates: [start, end] }));
    setSelectedSlot(undefined);
  }, []);

  const renderEventWrapper = useCallback(
    (props: any) => {
      const startDate = dayjs(props.event.start).format('YYYY-MM-DD');
      const currentDate = eventsInSameDate.find(({ date }) => date === startDate);
      const index = currentDate?.ids.findIndex((id: string) => id === props.event.id);
      const eventsLeft = currentDate?.ids?.length! - index! || 0;

      // Skip rendering if event data is missing/invalid
      if (!props.event || !props.event.id) {
        console.log('okay');
        return null;
      }

      return (
        <EventCard
          {...props}
          isMonth={true}
          loading={state.loading}
          index={index}
          eventsLeft={eventsLeft}
        />
      );
    },
    [eventsInSameDate, state.loading]
  );

  useEffect(() => {
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const point =
        'touches' in e
          ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
          : { x: e.clientX, y: e.clientY };

      dragStartPos.current = point;
      isDraggingRef.current = false;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!dragStartPos.current) return;

      const point =
        'touches' in e
          ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
          : { x: e.clientX, y: e.clientY };

      const dx = Math.abs(point.x - dragStartPos.current.x);
      const dy = Math.abs(point.y - dragStartPos.current.y);

      if (dx > 10 || dy > 10) {
        isDraggingRef.current = true;
      }
    };

    const handlePointerUp = () => {
      dragStartPos.current = null;
    };

    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    window.addEventListener('touchstart', handlePointerDown);
    window.addEventListener('touchmove', handlePointerMove);
    window.addEventListener('touchend', handlePointerUp);

    return () => {
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);

      window.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, []);

  return (
    <>
      <Menu menuId={CALENDAR_MONTH_MENU_ID} contentId="calendar-month-content" />
      <IonPage ref={calendarMonthRef} className={CSSprefix} id="calendar-month-content">
        {/* <SwipeHandler parentRef={calendarMonthRef} /> */}
        <Header
          showMenu
          menuId={CALENDAR_MONTH_MENU_ID}
          showDatePicker={true}
          datePickerText={dateText}
          reloadClick={getAppointmentsHandler}
          datePickerCB={openDatePickerHandler}
        />
        <IonContent {...handlers} ref={refPassthrough}>
          <Calendar
            key={selectedDates[0]}
            defaultDate={selectedDates[0]}
            date={selectedDates[0]}
            defaultView={Views.MONTH}
            events={mappedEvents}
            localizer={localizer}
            showAllEvents={true}
            toolbar={false}
            views={{
              month: true,
            }}
            timeslots={2}
            components={{
              eventWrapper: renderEventWrapper,
              header: props => <HeaderCalendar {...props} type="month" />,
              month: {
                dateHeader: props => (
                  <IonText
                    className={
                      props.isOffRange
                        ? `${CSSprefix}-header-date-off-range`
                        : `${CSSprefix}-header-date`
                    }
                  >
                    {dayjs(props.date).format('D')}
                  </IonText>
                ),
              },
            }}
            onNavigate={() => {}}
            selectable={true}
            longPressThreshold={0}
            onSelectSlot={slot => {
              if (isDraggingRef.current) {
                getAppointmentsHandler();
              } else {
                dispatch(setDate(dayjs(slot.start).toISOString()));
                history.push(CALENDAR_DAY);
              }
            }}
          />
        </IonContent>
        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton onClick={() => setIsCreateAppointmentOpen(true)}>
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>
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
              onSelectedDate={date => {
                setDatePickerOpen(false);
                dispatch(setDate(date as string));
                history.push(CALENDAR_DAY);
              }}
              onTriggerAction={() => setDatePickerOpen(false)}
            />
          </IonContent>
        </IonPopover>
        <CreateAppointment
          view="month"
          isOpen={isCreateAppointmentOpen}
          selectedSlot={selectedSlot}
          setIsOpen={setIsCreateAppointmentOpen}
        />
      </IonPage>
    </>
  );
};

export default CalendarMonth;
