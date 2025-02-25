import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { getEventsAction } from "../../state/schedulingSlice";
import { APPOINTMENTS } from "../../shared/routes/routes";
import { setLoading } from "../../state/loadingSlice";

import "./Appointments.scss";

const CSSprefix = 'appointments';

const Appointments: React.FC = (): React.ReactElement => {
  const pageRef = useRef<any>();
  const { provider, scheduling: { events, microsoftEvents, googleEvents, state }, calendar: { selectedDate } } = useSelector((state: RootState) => state);
  const dispatch = useDispatch<AppDispatch>();
  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => { };
  const datePickerRef = useRef<HTMLIonPopoverElement>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [isCreateAppointmentOpen, setIsCreateAppointmentOpen] = useState(false);
  const sortedEvents = useMemo(() => [...events?.events, ...microsoftEvents, ...googleEvents || []].sort(
    (a, b) => dayjs(a.startTime).valueOf() - dayjs(b.startTime).valueOf()
  ).filter(({ status, endTime }) => (
    status === AppointmentStatusEnum.CONFIRMEND
    || status === AppointmentStatusEnum.BUSY
    || status === AppointmentStatusEnum.OCCURRENCE
    || status === AppointmentStatusEnum.SINGLE_INSTANCE
  )
    && dayjs(endTime).format('YYYY-MM-DD') === dayjs(selectedDate).format('YYYY-MM-DD')),
    [events?.events, selectedDate, state.loading]);
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

  const { handlers, refPassthrough } = UseSwipeGesture({
    parentRef: pageRef,
    onSwipedLeft: async () => closeMenuHandler(APPOINTMENTS_MENU_ID),
    onSwipedRight: async () => openMenuHandler(APPOINTMENTS_MENU_ID),
    onSwipedDown: () => getAppointmentsHandler(),
  });

  useEffect(() => {
    if (location.pathname === APPOINTMENTS && !isCreateAppointmentOpen) {
      if (state.loading) {
        dispatch(setLoading({ loading: true, message: 'Loading appointments' }));
      }

      if (!state.loading) {
        dispatch(setLoading({ loading: false, message: '' }));
      }
    }
  }, [state.loading, location.pathname, isCreateAppointmentOpen]);

  const content = useMemo(() => {
    if (sortedEvents.length === 0) {
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

    return (
      <IonGrid fixed={true} className="ion-no-padding ion-no-margin">
        <IonRow className="ion-margin-start ion-no-margin">
          <IonCol size="auto" className="ion-margin-top">
            <Badge appointmentDate={dayjs(sortedEvents[0].endTime).toISOString()} />
          </IonCol>
          <IonCol>
            {sortedEvents.map((event) => (
              <AppointmentCard key={event?.id} appointment={event} />
            ))}
          </IonCol>
        </IonRow>
      </IonGrid>
    );
  }, [sortedEvents]);

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
        <CreateAppointment
          isOpen={isCreateAppointmentOpen}
          currentDate={selectedDate}
          setIsOpen={setIsCreateAppointmentOpen}
        />
      </IonPage>
    </>
  );
};

export default Appointments;
