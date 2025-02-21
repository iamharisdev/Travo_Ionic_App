import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  IonContent,
  IonItem,
  IonList,
  IonPage,
  IonPopover,
  IonText,
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
import { setDate } from "../../state/calendarSlice";

import "./AppointmentRequests.scss";

const CSSprefix = 'appointment-requests';
const today = dayjs().format('YYYY-MM-DD');

const AppointmentRequests: React.FC = (): React.ReactElement => {
  const { provider, scheduling: { events }, calendar: { selectedDate } } = useSelector((state: RootState) => state);
  const history = useHistory();
  const dispatch = useDispatch<AppDispatch>();
  const appointmentRequestsRef = useRef();
  const datePickerRef = useRef<HTMLIonPopoverElement>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const sortedEvents = useMemo(() => [...events.events || []].sort(
    (a, b) => dayjs(a.startTime).valueOf() - dayjs(b.startTime).valueOf()
  ).filter(({ status, endTime }) => status === AppointmentStatusEnum.PENDING && dayjs(endTime).format('YYYY-MM-DD') === dayjs(selectedDate).format('YYYY-MM-DD')), [events?.events, selectedDate]);
  const [presentToast] = usePresentToast();
  const dateText = useMemo(() => {
    if (selectedDate) {
      return months[dayjs(selectedDate).month()];
    }

    return '';
  }, [selectedDate]);
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

  const content = useMemo(() => {
    if (sortedEvents.length === 0) {
      return (
        <div className={`${CSSprefix}-no-appointments-container`}>
          <IonItem lines="none">
            <IonText className={`${CSSprefix}-no-appointments ion-text-center`}>
              You have no appointment request yet.
            </IonText>
          </IonItem>
        </div>
      );
    }

    return (
      <div>
        <IonItem lines="none">
          <IonText className={`${CSSprefix}-from-to-date`}>
            {getDateHandler(dayjs(sortedEvents[0].startTime).toISOString())}
          </IonText>
        </IonItem>
        {sortedEvents.map((event) => (
          <IonItem key={event?.id} lines="none">
            <AppointmentRequestCard
              appointment={event}
              acceptCB={acceptHandler}
              declineCB={declineHandler}
            />
          </IonItem>
        ))}
      </div>
    );
  }, [sortedEvents])

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
          <IonList>
            {content}
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
      </IonPage>
    </>
  );
};

export default AppointmentRequests;
