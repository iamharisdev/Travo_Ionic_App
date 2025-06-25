import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonPage,
  IonPopover,
  IonText,
  useIonViewWillEnter,
} from '@ionic/react';
import Header from '../../components/Header/Header';
import Menu from '../../components/Menu/Menu';
import { CALENDAR_DAY_MENU_ID } from '../../shared/constants/menu';
import { Calendar, dayjsLocalizer, Event, SlotInfo, Views } from 'react-big-calendar';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../state/store';
import EventCard from '../../components/EventCard/EventCard';
import DatePicker from '../../components/DatePicker/DatePicker';
import { setLoading } from '../../state/loadingSlice';
import {
  getEventsAction,
  getGoogleEventsAction,
  getMicrosoftEventsAction,
} from '../../state/schedulingSlice';
import { setDate, setNextDay, setPrevDay } from '../../state/calendarSlice';
import UseSwipeGesture from '../../hooks/useSwipeGesture';
import SwipeHandler from '../../components/SwipeHandler/SwipeHandler';
import CreateAppointment from '../../components/CreateAppointment/CreateAppointment';
import { addOutline } from 'ionicons/icons';
import { APPOINTMENT_DETAILS, CALENDAR_DAY } from '../../shared/routes/routes';
import {
  AppointmentDetailTypeEnum,
  AppointmentStatusEnum,
} from '../../shared/types/appointment.type';
import { useHistory, useLocation } from 'react-router';
import { getDefaultDates } from '../../shared/utils/dates.util';
import './CalendarDay.scss';
import { useTranslation } from 'react-i18next';
const localizer = dayjsLocalizer(dayjs);

const CSSprefix = 'calendar-day';

const CalendarDay: React.FC = (): React.ReactElement => {
  const pageRef = useRef();
  const history = useHistory();
  const {
    provider,
    scheduling: { events, microsoftEvents, googleEvents, state },
    calendar: { selectedDate },
  } = useSelector((state: RootState) => state);
  const { t } = useTranslation();

  const mappedEvents: Array<Event & { id?: string }> = useMemo(() => {
    if (state.loading) return getDefaultDates(selectedDate, selectedDate, 'day');

    return events.events
      .filter(
        ({ endTime, status }) =>
          dayjs(endTime).format('YYYY-MM-DD') === dayjs(selectedDate).format('YYYY-MM-DD') &&
          status !== AppointmentStatusEnum.CANCELLED
      )
      .map(event => ({
        id: event?.id,
        title: JSON.stringify({
          id: event?.id,
          service: event?.patientServiceName || event?.title,
          patient: event?.patientName || event?.providerName,
          color: event?.color,
          start: event?.allDay
            ? dayjs(event.endTime).startOf('day').toDate()
            : dayjs(event?.startTime || '').toDate(),
          end: event?.allDay
            ? dayjs(event.endTime).endOf('day').toDate()
            : dayjs(event.endTime || '').toDate(),
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
      }));
  }, [events.events, selectedDate, state.loading]);

  const mappedBackgroundEvents: Array<Event & { id?: string }> = useMemo(() => {
    if (state.loading) return getDefaultDates(selectedDate, selectedDate, 'day');

    const externalCalendarEvents = [...microsoftEvents, ...googleEvents];

    return externalCalendarEvents
      .filter(
        ({ endTime, busy }) =>
          dayjs(endTime).format('YYYY-MM-DD') === dayjs(selectedDate).format('YYYY-MM-DD') && busy
      )
      .map(event => ({
        id: event?.id,
        title: JSON.stringify({
          id: event?.id,
          service: event?.patientServiceName || event?.title,
          patient: event?.patientName || event?.providerName,
          color: event?.color,
          start: event?.allDay
            ? dayjs(event.endTime).startOf('day').toDate()
            : dayjs(event?.startTime || '').toDate(),
          end: event?.allDay
            ? dayjs(event.endTime).endOf('day').toDate()
            : dayjs(event.endTime || '').toDate(),
          redirect: false,
          isMeetingEvent: event?.status === AppointmentStatusEnum.BUSY,
        }),
        start: event?.allDay
          ? dayjs(event.endTime).startOf('day').toDate()
          : dayjs(event?.startTime || '').toDate(),
        end: event?.allDay
          ? dayjs(event.endTime).endOf('day').toDate()
          : dayjs(event.endTime || '').toDate(),
        allDay: event?.allDay,
      }));
  }, [microsoftEvents, googleEvents, selectedDate, state.loading]);

  const dispatch = useDispatch<AppDispatch>();
  const datePickerRef = useRef<HTMLIonPopoverElement>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const dateText = useMemo(() => {
    const lang = localStorage.getItem('language') || 'en';
    dayjs.locale(lang); // Ensure the locale is set before formatting

    if (selectedDate) {
      return dayjs(selectedDate).format('MMMM');
    }

    return '';
  }, [selectedDate]);
  const [isCreateAppointmentOpen, setIsCreateAppointmentOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo>();
  const location = useLocation();

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
      setDatePickerOpen(false);

      const [providerPractice] = provider.providerPractices;
      if (providerPractice) {
        await dispatch(
          getEventsAction({
            practiceId: providerPractice.practiceId,
            providerId: providerPractice.providerId,
            start: dayjs(selectedDate).startOf('day').toISOString(),
            end: dayjs(selectedDate).endOf('day').toISOString(),
            pageNumber: 0,
            pageSize: 999,
          })
        );
        await dispatch(
          getMicrosoftEventsAction({
            practiceId: providerPractice.practiceId,
            providerId: providerPractice.providerId,
            start: dayjs(selectedDate).startOf('day').toISOString(),
            end: dayjs(selectedDate).endOf('day').toISOString(),
          })
        );
        await dispatch(
          getGoogleEventsAction({
            practiceId: providerPractice.practiceId,
            providerId: providerPractice.providerId,
            start: dayjs(selectedDate).startOf('day').toISOString(),
            end: dayjs(selectedDate).endOf('day').toISOString(),
          })
        );
      }
    } catch (error) {
      console.error('error at load appointments by date: ', error);
    }
  };

  const { handlers, scrollingUpOrDown, tapped, refPassthrough } = UseSwipeGesture({
    parentRef: pageRef,
    onSwipedLeft: () => dispatch(setNextDay()),
    onSwipedRight: () => dispatch(setPrevDay()),
    onSwipedDown: () => getAppointmentsHandler(),
  });

  const handleSelectSlot = useCallback(
    (value: SlotInfo) => {
      if (value && tapped && !scrollingUpOrDown) {
        if ('start' in value && 'end' in value) {
          const eventExist = [...mappedEvents, ...mappedBackgroundEvents].find(event => {
            if (
              dayjs(event.start).valueOf() <= dayjs(value.start).valueOf() &&
              dayjs(value.start).valueOf() <= dayjs(event.end).valueOf() &&
              !event?.allDay
            ) {
              return event;
            }
            if (
              dayjs(event.start).valueOf() <= dayjs(value.end).valueOf() &&
              dayjs(value.end).valueOf() <= dayjs(event.end).valueOf() &&
              !event?.allDay
            ) {
              return event;
            }
            if (
              dayjs(value.start).valueOf() < dayjs(event.start).valueOf() &&
              dayjs(event.end).valueOf() < dayjs(value.end).valueOf() &&
              !event?.allDay
            ) {
              return event;
            }
          });

          if (!eventExist) {
            setIsCreateAppointmentOpen(true);
            setSelectedSlot(value);
          }

          if (eventExist && 'id' in eventExist && 'title' in eventExist) {
            const redirect = JSON.parse((eventExist?.title as string) || '').redirect;
            if (redirect) {
              history.push(`${APPOINTMENT_DETAILS}/${eventExist.id}`, {
                eventId: eventExist.id,
                type: AppointmentDetailTypeEnum.RESCHEDULE,
              });
            }
          }
        }
      }
    },
    [mappedEvents, mappedBackgroundEvents, isCreateAppointmentOpen, tapped, scrollingUpOrDown]
  );
  const handleSelectEvent = useCallback((event: any) => {
    const redirect = JSON.parse((event.title as string) || '').redirect;
    if (redirect) {
      history.push(`${APPOINTMENT_DETAILS}/${event.id}`, {
        eventId: event.id,
        type: AppointmentDetailTypeEnum.RESCHEDULE,
      });
    }
  }, []);

  useIonViewWillEnter(() => {
    getAppointmentsHandler();
    if (!selectedDate) {
      dispatch(setDate(dayjs().format('YYYY-MM-DD')));
    }
    setSelectedSlot(undefined);
  }, []);

  useEffect(() => {
    if (location.pathname === CALENDAR_DAY && !isCreateAppointmentOpen) {
      if (state.loading) {
        dispatch(setLoading({ loading: true, message: `${t('loading_appointments')}` }));
      }

      if (!state.loading) {
        dispatch(setLoading({ loading: false, message: '' }));
      }
    }
  }, [state.loading, location.pathname, isCreateAppointmentOpen]);

  return (
    <>
      <Menu menuId={CALENDAR_DAY_MENU_ID} contentId="calendar-day-content" />
      <IonPage ref={pageRef} className={CSSprefix} id="calendar-day-content">
        <SwipeHandler parentRef={pageRef} />
        <Header
          showMenu
          menuId={CALENDAR_DAY_MENU_ID}
          showDatePicker={true}
          datePickerText={dateText}
          reloadClick={getAppointmentsHandler}
          datePickerCB={openDatePickerHandler}
        />
        <IonContent {...handlers} ref={refPassthrough}>
          <Calendar
            defaultDate={selectedDate}
            date={selectedDate}
            defaultView={Views.DAY}
            events={mappedEvents}
            backgroundEvents={mappedBackgroundEvents}
            localizer={localizer}
            toolbar={false}
            views={{
              day: true,
            }}
            timeslots={2}
            dayLayoutAlgorithm="no-overlap"
            showAllEvents={true}
            components={{
              timeGutterHeader: () => (
                <div className={`${CSSprefix}-date-container`}>
                  <IonText className={`${CSSprefix}-date`}>
                    {dayjs(selectedDate).format('ddd')}
                  </IonText>
                  <IonText className={`${CSSprefix}-day`}>{dayjs(selectedDate).date()}</IonText>
                </div>
              ),
              eventWrapper: props => <EventCard {...props} loading={state.loading} />,
            }}
            onNavigate={() => {}}
            selectable={true}
            longPressThreshold={0}
             onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
          />
        </IonContent>
        <IonFab className="big-z-index" slot="fixed" vertical="bottom" horizontal="end">
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
          <IonContent fullscreen={true}>
            <DatePicker
              date={selectedDate}
              onSelectedDate={date => dispatch(setDate(date as string))}
              onTriggerAction={() => setDatePickerOpen(false)}
            />
          </IonContent>
        </IonPopover>
        <CreateAppointment
          isOpen={isCreateAppointmentOpen}
          currentDate={selectedDate}
          selectedSlot={selectedSlot}
          setIsOpen={isOpen => {
            setIsCreateAppointmentOpen(isOpen);
            setSelectedSlot(undefined);
          }}
        />
      </IonPage>
    </>
  );
};

export default CalendarDay;
