import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonPage,
  IonPopover,
  IonText,
  useIonViewWillEnter,
} from "@ionic/react";
import Header from "../../components/Header/Header";
import Menu from "../../components/Menu/Menu";
import { CALENDAR_DAY_MENU_ID } from "../../shared/constants/menu";
import { Calendar, dayjsLocalizer, Event, SlotInfo, Views } from 'react-big-calendar';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import EventCard from "../../components/EventCard/EventCard";
import DatePicker from "../../components/DatePicker/DatePicker";
import { months } from "../../shared/constants/dates";
import { setLoading } from "../../state/loadingSlice";
import { getEventsAction } from "../../state/schedulingSlice";
import { setDate, setNextDay, setPrevDay } from "../../state/calendarSlice";
import UseSwipeGesture from "../../hooks/useSwipeGesture";
import SwipeHandler from "../../components/SwipeHandler/SwipeHandler";
import CreateAppointment from "../../components/CreateAppointment/CreateAppointment";
import { addOutline } from "ionicons/icons";
import { APPOINTMENT_DETAILS, CALENDAR_DAY } from "../../shared/routes/routes";
import { AppointmentDetailTypeEnum, AppointmentStatusEnum } from "../../shared/types/appointment.type";
import { useHistory, useLocation } from "react-router";
import { getDefaultDates } from "../../shared/utils/dates.util";

import "./CalendarDay.scss";

const localizer = dayjsLocalizer(dayjs);

const CSSprefix = 'calendar-day';

const CalendarDay: React.FC = (): React.ReactElement => {
  const pageRef = useRef();
  const history = useHistory();
  const { provider, scheduling: { events, state }, calendar: { selectedDate } } = useSelector((state: RootState) => state);
  const mappedEvents: Array<Event & { id?: string }> = useMemo(() => {
    if (state.loading) return getDefaultDates(selectedDate, selectedDate, 'day')

    return events.events.filter(({ endTime, status }) => dayjs(endTime).format('YYYY-MM-DD') === dayjs(selectedDate).format('YYYY-MM-DD') &&
      (status === AppointmentStatusEnum.CONFIRMEND || status === AppointmentStatusEnum.BUSY)).map((event) => ({
        id: event?.id,
        title: JSON.stringify({
          id: event?.id,
          service: event?.patientServiceName || event?.title,
          patient: event?.patientName || event?.providerName,
          color: event?.color,
          start: event?.allDay ? dayjs(event.endTime).startOf('day').toDate() : dayjs(event?.startTime || '').toDate(),
          end: event?.allDay ? dayjs(event.endTime).endOf('day').toDate() : dayjs(event.endTime || '').toDate(),
          redirect: event?.status !== AppointmentStatusEnum.BUSY,
        }),
        start: event?.allDay ? dayjs(event.endTime).startOf('day').toDate() : dayjs(event?.startTime || '').toDate(),
        end: event?.allDay ? dayjs(event.endTime).endOf('day').toDate() : dayjs(event.endTime || '').toDate(),
        allDay: event?.allDay
      }))
  }, [events.events, selectedDate, state.loading]);
  const dispatch = useDispatch<AppDispatch>();
  const datePickerRef = useRef<HTMLIonPopoverElement>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const dateText = useMemo(() => {
    if (selectedDate) {
      return months[dayjs(selectedDate).month()];
    }

    return '';
  }, [selectedDate]);
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
      setDatePickerOpen(false);

      const [providerPractice] = provider.providerPractices;
      if (providerPractice) {
        await dispatch(getEventsAction({
          practiceId: providerPractice.practiceId,
          providerId: providerPractice.providerId,
          start: dayjs(selectedDate).startOf('day').toISOString(),
          end: dayjs(selectedDate).endOf('day').toISOString(),
          pageNumber: 0,
          pageSize: 999,
        }));
      }
    } catch (error) {
      console.error('error at load appointments by date: ', error);
    }
  }

  const handleSelectSlot = useCallback(
    (slot: SlotInfo) => {
      setIsCreateAppointmentOpen(true);
      setSelectedSlot(slot);
    },
    [mappedEvents, isCreateAppointmentOpen]
  );

  useIonViewWillEnter(() => {
    if (!selectedDate) {
      dispatch(setDate(dayjs().format('YYYY-MM-DD')));
    }
    setSelectedSlot(undefined);
  }, []);

  const { handlers, refPassthrough } = UseSwipeGesture({
    parentRef: pageRef,
    onSwipedLeft: () => dispatch(setNextDay()),
    onSwipedRight: () => dispatch(setPrevDay()),
    onSwipedDown: () => getAppointmentsHandler(),
  });

  useEffect(() => {
    if (location.pathname === CALENDAR_DAY && !isCreateAppointmentOpen) {
      if (state.loading) {
        dispatch(setLoading({ loading: true, message: 'Loading appointments' }));
      }

      if (!state.loading) {
        dispatch(setLoading({ loading: false, message: '' }));
      }
    }
  }, [state.loading, location.pathname, isCreateAppointmentOpen]);

  return (
    <>
      <Menu menuId={CALENDAR_DAY_MENU_ID} contentId="calendar-day-content" />
      <IonPage className={CSSprefix} id="calendar-day-content" {...handlers} ref={refPassthrough}>
        <SwipeHandler parentRef={pageRef} />
        <Header
          showMenu
          menuId={CALENDAR_DAY_MENU_ID}
          showDatePicker={true}
          datePickerText={dateText}
          datePickerCB={openDatePickerHandler}
        />
        <IonContent fullscreen={true}>
          <Calendar
            defaultDate={selectedDate}
            date={selectedDate}
            defaultView={Views.DAY}
            events={mappedEvents}
            localizer={localizer}
            toolbar={false}
            views={{
              day: true
            }}
            timeslots={2}
            dayLayoutAlgorithm="no-overlap"
            components={{
              timeGutterHeader: () => (
                <div className={`${CSSprefix}-date-container`}>
                  <IonText className={`${CSSprefix}-date`}>
                    {dayjs(selectedDate).format('ddd')}
                  </IonText>
                  <IonText className={`${CSSprefix}-day`}>
                    {dayjs(selectedDate).date()}
                  </IonText>
                </div>
              ),
              eventWrapper: (props) => (
                <EventCard
                  {...props}
                  loading={state.loading}
                  onClick={(id: string) => {
                    const redirect = JSON.parse((props?.event?.title as string) || '').redirect;

                    if (redirect) {
                      history.push(`${APPOINTMENT_DETAILS}/${id}`, {
                        eventId: id,
                        type: AppointmentDetailTypeEnum.RESCHEDULE
                      })
                    }

                    return null;
                  }}
                />
              ),
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
          <IonContent fullscreen={true}>
            <DatePicker
              date={selectedDate}
              onSelectedDate={(date) => dispatch(setDate(date as string))}
              onTriggerAction={() => setDatePickerOpen(false)}
            />
          </IonContent>
        </IonPopover>
        <CreateAppointment isOpen={isCreateAppointmentOpen} selectedSlot={selectedSlot} setIsOpen={setIsCreateAppointmentOpen} />
      </IonPage>
    </>
  );
};

export default CalendarDay;
