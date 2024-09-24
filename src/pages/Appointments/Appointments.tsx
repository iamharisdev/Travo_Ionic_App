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

  // TODO: remove mock datePickerText and August 4 - 10

  return (
    <IonPage ref={appointmentsRef} className={CSSprefix} id="appointments-content">
      <SwipeGesture parentRef={appointmentsRef} menuId="appointments-menu" />
      <Header
        showMenu
        menuId="appointments-menu"
        showDatePicker={true}
        datePickerText="August"
        datePickerCB={openDatePickerHandler}
      />
      <Menu menuId="appointments-menu" contentId="appointments-content" />
      <IonContent fullscreen={true}>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>
        <IonList>
          <IonItem lines="none">
            <IonText className={`${CSSprefix}-from-to-date ion-text-center`}>
              August 4 - 10
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
          <DatePicker dates={selectedDates} onSelectedDates={getAppointmentsHandler} />
        </IonContent>
      </IonPopover>
    </IonPage>
  );
};

export default Appointments;
