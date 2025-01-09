import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonGrid,
  IonIcon,
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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import AppointmentCard from "../../components/AppointmentCard/AppointmentCard";
import dayjs from "dayjs";
import { groupAppointmentsByDate } from "../../shared/utils/appointments.util";
import Badge from "../../components/Badge/Badge";
import DatePicker from "../../components/DatePicker/DatePicker";
import { months } from "../../shared/constants/dates";
import { APPOINTMENTS_MENU_ID } from "../../shared/constants/menu";
import { AppointmentStatusEnum } from "../../shared/types/appointment.type";
import UseSwipeGesture from "../../hooks/useSwipeGesture";
import { closeMenuHandler, openMenuHandler } from "../../shared/utils/menu.util";
import SwipeHandler from "../../components/SwipeHandler/SwipeHandler";
import { addOutline } from "ionicons/icons";
import CreateAppointment from "../../components/CreateAppointment/CreateAppointment";
import { setDate } from "../../state/calendarSlice";

import "./Appointments.scss";

const CSSprefix = 'appointments';

const Appointments: React.FC = (): React.ReactElement => {
  const pageRef = useRef<any>();
  const { scheduling: { events, state }, calendar: { selectedDate } } = useSelector((state: RootState) => state);
  const dispatch = useDispatch<AppDispatch>();
  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => { };
  const datePickerRef = useRef<HTMLIonPopoverElement>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [isCreateAppointmentOpen, setIsCreateAppointmentOpen] = useState(false);
  const sortedEvents = useMemo(() => [...events?.events || []].sort(
    (a, b) => dayjs(a.startTime).valueOf() - dayjs(b.startTime).valueOf()
  ).filter(({ status, startTime }) => status === AppointmentStatusEnum.CONFIRMEND && dayjs(startTime).date() === dayjs(selectedDate).date()),
    [events?.events, selectedDate, state.loading]);
  const groupedAppointments = useMemo(() => groupAppointmentsByDate(sortedEvents), [sortedEvents]);
  const dateText = useMemo(() => {
    if (selectedDate) {
      return months[dayjs(selectedDate).month()];
    }

    return '';
  }, [selectedDate]);

  const fromToDateText = useMemo(() => {
    if (selectedDate) {
      return `
        ${months[dayjs(selectedDate).month()]} ${dayjs(selectedDate).date()}
      `;
    }

    return '';
  }, [selectedDate]);

  const openDatePickerHandler = useCallback((e: any) => {
    if (datePickerRef.current) {
      datePickerRef.current!.event = e;
    }
    setDatePickerOpen(true);
  }, [datePickerRef.current]);

  const { handlers, refPassthrough } = UseSwipeGesture({
    parentRef: pageRef,
    onSwipedLeft: async () => closeMenuHandler(APPOINTMENTS_MENU_ID),
    onSwipedRight: async () => openMenuHandler(APPOINTMENTS_MENU_ID),
  });

  const content = useMemo(() => {
    if (groupedAppointments.length === 0) {
      return (
        <div className={`${CSSprefix}-no-appointments-container`}>
          <IonItem lines="none">
            <IonText className={`${CSSprefix}-no-appointments ion-text-center`}>
              You have no scheduled appointments yet. To start adding them, please tap on the “+” floating button on the bottom of the screen.
            </IonText>
          </IonItem>
        </div>
      );
    }

    return groupedAppointments.map((event) => (
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
    ));
  }, [groupedAppointments]);

  return (
    <>
      <Menu menuId={APPOINTMENTS_MENU_ID} contentId="appointments-content" />
      <IonPage className={CSSprefix} id="appointments-content" {...handlers} ref={refPassthrough}>
        <SwipeHandler parentRef={pageRef} />
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
            {content}
          </IonList>
          <IonFab slot="fixed" vertical="bottom" horizontal="end">
            <IonFabButton onClick={() => setIsCreateAppointmentOpen(true)}>
              <IonIcon icon={addOutline}></IonIcon>
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
                if (date) {
                  dispatch(setDate(date))
                }
              }}
              onTriggerAction={() => setDatePickerOpen(false)}
            />
          </IonContent>
        </IonPopover>
        <CreateAppointment isOpen={isCreateAppointmentOpen} setIsOpen={setIsCreateAppointmentOpen} />
      </IonPage>
    </>
  );
};

export default Appointments;
