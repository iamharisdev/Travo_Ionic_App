import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  IonContent,
  IonItem,
  IonList,
  IonPage,
  IonPopover,
  IonRefresher,
  IonRefresherContent,
  IonText,
  RefresherEventDetail,
} from "@ionic/react";
import Header from "../../components/Header/Header";
import Menu from "../../components/Menu/Menu";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import dayjs from "dayjs";
import { groupAppointmentsByDate } from "../../shared/utils/appointments.util";
import DatePicker from "../../components/DatePicker/DatePicker";
import { confirmAppointmentAction, getEventsAction } from "../../state/schedulingSlice";
import { setLoading } from "../../state/loadingSlice";
import { months } from "../../shared/constants/dates";
import { APPOINTMENT_REQUESTS_MENU_ID } from "../../shared/constants/menu";
import AppointmentRequestCard from "../../components/AppointmentRequestCard/AppointmentRequestCard";
import { AppointmentDetailTypeEnum, AppointmentStatusEnum } from "../../shared/types/appointment.type";
import { useHistory } from "react-router";
import { APPOINTMENT_CANCEL } from "../../shared/routes/routes";
import usePresentToast from "../../hooks/usePresentToast";
import UseSwipeGesture from "../../hooks/useSwipeGesture";
import { closeMenuHandler, openMenuHandler } from "../../shared/utils/menu.util";
import SwipeHandler from "../../components/SwipeHandler/SwipeHandler";

import "./AppointmentRequests.scss";

const CSSprefix = 'appointment-requests';
const today = dayjs().format('YYYY-MM-DD');
const sevenDaysFromToday = dayjs().add(7, 'days').format('YYYY-MM-DD');

const AppointmentRequests: React.FC = (): React.ReactElement => {
  const { provider, scheduling: { events } } = useSelector((state: RootState) => state);
  const history = useHistory();
  const dispatch = useDispatch<AppDispatch>();
  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => { };
  const appointmentRequestsRef = useRef();
  const datePickerRef = useRef<HTMLIonPopoverElement>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const sortedEvents = useMemo(() => [...events?.events || []].sort(
    (a, b) => dayjs(a.startTime).valueOf() - dayjs(b.startTime).valueOf()
  ).filter(({ status }) => status === AppointmentStatusEnum.PENDING), [events?.events]);
  const groupedAppointments = useMemo(() => groupAppointmentsByDate(sortedEvents), [sortedEvents]);
  const [presentToast] = usePresentToast();
  const [selectedDates, setSelectedDates] = useState<string[]>([today, sevenDaysFromToday]);
  const dateText = useMemo(() => {
    if (selectedDates.length > 0) {
      const [date] = selectedDates;
      return months[dayjs(date).month()];
    }

    return '';
  }, [selectedDates]);
  const { practiceId, providerId }: { practiceId: string, providerId: string } = useMemo(() => {
    let practiceId = '';
    let providerId = '';

    if (provider.providerPractices.length > 0) {
      const [providerPractice] = provider.providerPractices;

      return { practiceId: providerPractice.practiceId, providerId: providerPractice.providerId };
    }

    return { practiceId, providerId };
  }, [provider.providerPractices]);

  const getDateHandler = (date: string) => {
    const today = dayjs().format('YYYY-MM-DD');
    const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD');
    const preparedDate = dayjs(date).startOf('day').format('YYYY-MM-DD');

    if (today === preparedDate) {
      return 'TODAY';
    }

    if (tomorrow === preparedDate) {
      return 'TOMORROW';
    }

    return dayjs(date).format('dddd, MMMM, DD').toUpperCase();
  };

  const openDatePickerHandler = useCallback((e: any) => {
    if (datePickerRef.current) {
      datePickerRef.current!.event = e;
    }
    setDatePickerOpen(true);
  }, [datePickerRef.current]);

  const getAppointmentsHandler = async (dates: string[] | string) => {
    try {
      setDatePickerOpen(false);
      setSelectedDates(dates as string[]);
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

  const acceptHandler = async (appointmentId: string) => {
    try {
      if (practiceId && providerId && appointmentId) {
        dispatch(setLoading({ loading: true }));

        const response = await dispatch(confirmAppointmentAction({
          practiceId,
          providerId,
          appointmentId,
          payload: {}
        }));

        if (response.meta.requestStatus === 'fulfilled') {
          dispatch(setLoading({ loading: false, message: undefined }));
        }

        if (response.meta.requestStatus === 'rejected') {
          presentToast(
            '¡Error at confirm appointment!',
            1000,
            'top',
            'danger'
          );
        }

        dispatch(setLoading({ loading: false, message: undefined }));
        presentToast(
          '¡Appointment confimed!',
          1000,
          'top',
          'success'
        );
      }
    } catch (error) {
      dispatch(setLoading({ loading: false, message: undefined }));
      presentToast(
        '¡Error at cancel appointment!',
        1000,
        'top',
        'danger'
      );
    }
  };

  const declineHandler = (appointmentId: string) => {
    history.push(APPOINTMENT_CANCEL, { appointmentId, type: AppointmentDetailTypeEnum.ACCEPT });
  }

  const { handlers, refPassthrough } = UseSwipeGesture({
    parentRef: appointmentRequestsRef,
    onSwipedLeft: async () => closeMenuHandler(APPOINTMENT_REQUESTS_MENU_ID),
    onSwipedRight: async () => openMenuHandler(APPOINTMENT_REQUESTS_MENU_ID),
  });

  return (
    <>
      <Menu menuId={APPOINTMENT_REQUESTS_MENU_ID} contentId="appointment-requests-content" />
      <IonPage
        {...handlers}
        ref={refPassthrough}
        className={CSSprefix} id="appointment-requests-content"
      >
        <SwipeHandler parentRef={appointmentRequestsRef} />
        <Header
          showMenu
          menuId={APPOINTMENT_REQUESTS_MENU_ID}
          showDatePicker={true}
          datePickerText={dateText}
          datePickerCB={openDatePickerHandler}
        />
        <IonContent fullscreen={true}>
          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent />
          </IonRefresher>
          <IonList>
            {groupedAppointments.map((event) => (
              <div key={event.date}>
                <IonItem lines="none">
                  <IonText className={`${CSSprefix}-from-to-date`}>
                    {getDateHandler(event.date)}
                  </IonText>
                </IonItem>
                {event.appointments.map((appointment) => (
                  <IonItem key={appointment?.id} lines="none">
                    <AppointmentRequestCard
                      appointment={appointment}
                      acceptCB={acceptHandler}
                      declineCB={declineHandler}
                    />
                  </IonItem>
                ))}
              </div>
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
            <DatePicker multiple={true} dates={selectedDates} onSelectedDates={setSelectedDates} onTriggerAction={getAppointmentsHandler} />
          </IonContent>
        </IonPopover>
      </IonPage>
    </>
  );
};

export default AppointmentRequests;
