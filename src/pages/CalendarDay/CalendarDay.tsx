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

//Implement for time slots 12AM to 11PM

// import utc from 'dayjs/plugin/utc';
// import timezone from 'dayjs/plugin/timezone';

// dayjs.extend(utc);
// dayjs.extend(timezone);
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

    return [...events.events, ...microsoftEvents, ...googleEvents]
      .filter(
        ({ startTime, status }) =>
          dayjs(startTime).format('YYYY-MM-DD') === dayjs(selectedDate).format('YYYY-MM-DD') &&
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
            end: dayjs(selectedDate).add(5, 'months').endOf('day').toISOString(),
            pageNumber: 0,
            pageSize: 999,
          })
        );
        await dispatch(
          getMicrosoftEventsAction({
            practiceId: providerPractice.practiceId,
            providerId: providerPractice.providerId,
            start: dayjs(selectedDate).startOf('day').toISOString(),
            end: dayjs(selectedDate).add(5, 'months').endOf('day').toISOString(),
          })
        );
        await dispatch(
          getGoogleEventsAction({
            practiceId: providerPractice.practiceId,
            providerId: providerPractice.providerId,
            start: dayjs(selectedDate).startOf('day').toISOString(),
            end: dayjs(selectedDate).add(5, 'months').endOf('day').toISOString(),
          })
        );
        //Implement for time slots 12AM to 11PM
        // forceCalendarReRenderBySwipe();
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
        }
      }
    },
    [mappedEvents, isCreateAppointmentOpen, tapped, scrollingUpOrDown]
  );
  const handleSelectEvent = useCallback(
    (event: any) => {
      const redirect = JSON.parse((event.title as string) || '').redirect;

      if (redirect) {
        const targetPath = `${APPOINTMENT_DETAILS}/${event.id}`;

        if (history.location.pathname === targetPath) {
          return;
        } else {
          history.push(targetPath, {
            eventId: event.id,
            type: AppointmentDetailTypeEnum.RESCHEDULE,
          });
        }
      }
    },
    [history]
  );

  useIonViewWillEnter(() => {
    getAppointmentsHandler();
    if (!selectedDate) {
      dispatch(setDate(dayjs().format('YYYY-MM-DD')));
    }
    //Implement for time slots 12AM to 11PM
    // } else {
    //   forceCalendarReRenderBySwipe();
    // }
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
        <IonContent {...handlers} ref={refPassthrough} scrollEvents={true}>
          <Calendar
            key={`calendar-${selectedDate}`}
            defaultDate={selectedDate}
            date={selectedDate}
            defaultView={Views.DAY}
            events={mappedEvents}
            localizer={localizer}
            toolbar={false}
            views={{
              day: true,
            }}
            timeslots={2}
            dayLayoutAlgorithm="overlap"
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

              eventWrapper: props => {
                const handleClick = () => {
                  handleSelectEvent(props.event);
                };
                console.log(props);
                return (
                  <div onClick={handleClick} onTouchStart={handleClick}>
                    <EventCard {...props} loading={state.loading} />
                  </div>
                );
              },
            }}
            onNavigate={() => {}}
            selectable={true}
            longPressThreshold={0}
            onSelectSlot={handleSelectSlot}
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
