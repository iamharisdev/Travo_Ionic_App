import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  IonContent,
  IonPage,
  IonPopover,
  IonRefresher,
  IonRefresherContent,
  IonText,
  RefresherEventDetail,
} from "@ionic/react";
import Header from "../../components/Header/Header";
import Menu from "../../components/Menu/Menu";
import SwipeGesture from "../../components/SwipeGesture/SwipeGesture";
import { CALENDAR_DAY_MENU_ID } from "../../shared/constants/menu";
import { Calendar, dayjsLocalizer, Views } from 'react-big-calendar';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import EventCard from "../../components/EventCard/EventCard";
import DatePicker from "../../components/DatePicker/DatePicker";
import { months, TODAY } from "../../shared/constants/dates";
import { setLoading } from "../../state/loadingSlice";
import { getEventsAction } from "../../state/schedulingSlice";

import "./CalendarDay.scss";

const localizer = dayjsLocalizer(dayjs);

const CSSprefix = 'calendar-day';

const CalendarDay: React.FC = (): React.ReactElement => {
  const { provider, scheduling: { events } } = useSelector((state: RootState) => state);
  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => { };
  const calendarDayRef = useRef();
  const [selectedDate, setSelectedDate] = useState<string | undefined>(TODAY);
  const mappedEvents = useMemo(() => events.events.filter(({ startTime }) => dayjs(startTime).date() === dayjs(selectedDate).date()).map((event) => ({
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
  const datePickerRef = useRef<HTMLIonPopoverElement>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const dateText = useMemo(() => {
    if (selectedDate && selectedDate.length > 0) {
      const [date] = selectedDate;
      return months[dayjs(date).month()];
    }

    return '';
  }, [selectedDate]);

  const openDatePickerHandler = useCallback((e: any) => {
    if (datePickerRef.current) {
      datePickerRef.current!.event = e;
    }
    setDatePickerOpen(true);
  }, [datePickerRef.current]);

  const getAppointmentsHandler = async (date: string | string[]) => {
    try {
      setDatePickerOpen(false);
      setSelectedDate(date as string);
      dispatch(setLoading({ loading: true, message: 'Loading appointments' }));

      const [providerPractice] = provider.providerPractices;
      if (providerPractice) {
        await dispatch(getEventsAction({
          practiceId: providerPractice.practiceId,
          providerId: providerPractice.providerId,
          start: dayjs((date as string)).startOf('day').toISOString(),
          end: dayjs((date as string)).endOf('day').toISOString(),
          pageNumber: 0,
          pageSize: 999,
        }));
      }

      dispatch(setLoading({ loading: false, message: '' }));
    } catch (error) {
      dispatch(setLoading({ loading: false, message: '' }));
      setSelectedDate(undefined);
      console.error('error at load appointments by date: ', error);
    }
  }

  return (
    <>
      <Menu menuId={CALENDAR_DAY_MENU_ID} contentId="calendar-day-content" />
      <IonPage ref={calendarDayRef} className={CSSprefix} id="calendar-day-content">
        <SwipeGesture parentRef={calendarDayRef} menuId={CALENDAR_DAY_MENU_ID} />
        <Header
          showMenu
          menuId={CALENDAR_DAY_MENU_ID}
          showDatePicker={true}
          datePickerText={dateText}
          datePickerCB={openDatePickerHandler}
        />
        <IonContent fullscreen={true}>
          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent />
          </IonRefresher>
          <Calendar
            defaultDate={dayjs().toISOString()}
            defaultView={Views.DAY}
            events={mappedEvents}
            localizer={localizer}
            toolbar={false}
            views={{
              day: true
            }}
            timeslots={2}
            components={{
              timeGutterHeader: () => (
                <div className={`${CSSprefix}-date-container`}>
                  <IonText className={`${CSSprefix}-date`}>
                    {dayjs(selectedDate).format('dddd')}
                  </IonText>
                  <IonText className={`${CSSprefix}-day`}>
                    {dayjs(selectedDate).date()}
                  </IonText>
                </div>
              ),
              eventWrapper: (props) => <EventCard {...props} />,
            }}
          />
        </IonContent>
        <IonPopover
          ref={datePickerRef}
          className={`${CSSprefix}-date-picker-popover`}
          isOpen={datePickerOpen}
          size="auto"
          onDidDismiss={() => setDatePickerOpen(false)}
        >
          <IonContent fullscreen={true}>
            <DatePicker date={selectedDate} onSelectedDate={setSelectedDate} onTriggerAction={getAppointmentsHandler} />
          </IonContent>
        </IonPopover>
      </IonPage>
    </>
  );
};

export default CalendarDay;
