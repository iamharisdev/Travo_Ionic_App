import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  IonCol,
  IonContent,
  IonGrid,
  IonItem,
  IonList,
  IonPage,
  IonPopover,
  IonRefresher,
  IonRefresherContent,
  IonRow,
  IonText,
  RefresherEventDetail,
} from "@ionic/react";
import Header from "../../components/Header/Header";
import Menu from "../../components/Menu/Menu";
import SwipeGesture from "../../components/SwipeGesture/SwipeGesture";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import AppointmentCard from "../../components/AppointmentCard/AppointmentCard";
import dayjs from "dayjs";
import { groupAppointmentsByDate } from "../../shared/utils/appointments.util";
import Badge from "../../components/Badge/Badge";
import DatePicker from "../../components/DatePicker/DatePicker";
import { getEventsAction } from "../../state/schedulingSlice";
import { setLoading } from "../../state/loadingSlice";
import { months } from "../../shared/constants/dates";
import { APPOINTMENTS_MENU_ID } from "../../shared/constants/menu";

import "./Appointments.scss";

const CSSprefix = 'appointments';
const today = dayjs().format('YYYY-MM-DD');

const Appointments: React.FC = (): React.ReactElement => {
  const { provider, scheduling: { events } } = useSelector((state: RootState) => state);
  const dispatch = useDispatch<AppDispatch>();
  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => { };
  const appointmentsRef = useRef();
  const datePickerRef = useRef<HTMLIonPopoverElement>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const sortedEvents = useMemo(() => [...events?.events || []].sort(
    (a, b) => dayjs(a.startTime).valueOf() - dayjs(b.startTime).valueOf()
  ), [events?.events]);
  const groupedAppointments = useMemo(() => groupAppointmentsByDate(sortedEvents), [sortedEvents]);
  const [selectedDates, setSelectedDates] = useState<string[]>([today, today]);
  const dateText = useMemo(() => {
    if (selectedDates.length > 0) {
      const [date] = selectedDates;
      return months[dayjs(date).month()];
    }

    return '';
  }, [selectedDates]);

  const fromToDateText = useMemo(() => {
    if (selectedDates.length === 2) {
      const [start, end] = selectedDates;
      return `
        ${months[dayjs(start).month()]} ${dayjs(start).date()} - ${months[dayjs(end).month()]} ${dayjs(end).date()}
      `;
    }

    return '';
  }, [selectedDates]);

  const openDatePickerHandler = useCallback((e: any) => {
    if (datePickerRef.current) {
      datePickerRef.current!.event = e;
    }
    setDatePickerOpen(true);
  }, [datePickerRef.current]);

  const getAppointmentsHandler = async (dates: string[]) => {
    try {
      setDatePickerOpen(false);
      setSelectedDates(dates);
      dispatch(setLoading({ loading: true, message: 'Loading appointments' }));

      const [providerPractice] = provider.providerPractices;
      if (providerPractice) {
        await dispatch(getEventsAction({
          practiceId: providerPractice.practiceId,
          providerId: providerPractice.providerId,
          start: dayjs(dates[0]).startOf('day').toISOString(),
          end: dayjs(dates[1]).endOf('day').toISOString(),
          pageNumber: 0,
          pageSize: 999,
        }));
      }

      dispatch(setLoading({ loading: false, message: '' }));
    } catch (error) {
      dispatch(setLoading({ loading: false, message: '' }));
      setSelectedDates([]);
      console.error('error at load appointments by date: ', error);
    }
  }

  return (
    <>
      <Menu menuId={APPOINTMENTS_MENU_ID} contentId="appointments-content" />
      <IonPage ref={appointmentsRef} className={CSSprefix} id="appointments-content">
        <SwipeGesture parentRef={appointmentsRef} menuId={APPOINTMENTS_MENU_ID} />
        <Header
          showMenu
          menuId={APPOINTMENTS_MENU_ID}
          showDatePicker={true}
          datePickerText={dateText}
          datePickerCB={openDatePickerHandler}
        />
        <IonContent fullscreen={true}>
          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent />
          </IonRefresher>
          <IonList>
            <IonItem lines="none">
              <IonText className={`${CSSprefix}-from-to-date ion-text-center`}>
                {fromToDateText}
              </IonText>
            </IonItem>
            {groupedAppointments.map((event) => (
              <IonGrid key={event.date} fixed={true} className="ion-no-padding ion-no-margin">
                <IonRow className="ion-margin-start ion-no-margin">
                  <IonCol size="auto" className="ion-margin-top">
                    <Badge appointmentDate={event.date} />
                  </IonCol>
                  <IonCol>
                    {event.appointments.map((appointment) => (
                      <AppointmentCard key={appointment?.id} appointment={appointment} />
                    ))}
                  </IonCol>
                </IonRow>
              </IonGrid>
            ))}
          </IonList>
        </IonContent>
        <IonPopover
          ref={datePickerRef}
          className={`${CSSprefix}-date-picker-popover`}
          isOpen={datePickerOpen}
          size="auto"
          onDidDismiss={() => setDatePickerOpen(false)}
        >
          <IonContent fullscreen={true}>
            <DatePicker dates={selectedDates} onSelectedDates={setSelectedDates} onTriggerAction={getAppointmentsHandler} />
          </IonContent>
        </IonPopover>
      </IonPage>
    </>
  );
};

export default Appointments;
