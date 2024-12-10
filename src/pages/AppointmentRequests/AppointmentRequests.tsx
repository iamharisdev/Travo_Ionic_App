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

import "./AppointmentRequests.scss";

const CSSprefix = 'appointment-requests';
const today = dayjs().format('YYYY-MM-DD');
const events =
{
  "total": 5,
  "events": [
    {
      "id": "1e710579-a4d7-4a67-b10e-011a8f5503e9",
      "practiceId": "7c4bbcef-cf92-457e-bd5d-6074e9b20f5d",
      "providerId": "88c9cf5e-9f34-42bb-a660-9c069cc144b3",
      "patientServiceId": "7c485238-2b88-4b19-b97f-4fe2e502cc9f",
      "patientServiceName": "Cognitive behavioral therapy",
      "patientId": "8d9dd8f0-1ae0-4751-b3a7-2a4b451754c1",
      "patientName": "Lamine Yamal Test",
      "patientEmail": "lamine.test@test.com",
      "patientNumber": "00000308",
      "additionalParticipants": [],
      "location": "Online",
      "color": "green",
      "timeZone": "Africa/Johannesburg",
      "startTime": "2024-12-05T01:58:11Z",
      "endTime": "2024-12-05T02:58:11Z",
      "status": "Pending",
      "cancellationReason": null,
      "cancellationDetails": null,
      "price": 46,
      "discount": null,
      "clientType": "Existing",
      "providerName": "John Doe",
      "patientServiceType": "Individual",
      "onlineMeetingProvider": "Trova Meet",
      "onlineMeetUrl": "https://qameet.trovahealth.app/client-join?key=39a4fb11c08436f233d733109baf02ca0cbbd860",
      "onlineMeetProviderUrl": "https://qameet.trovahealth.app/provider?key=39a4fb11c08436f233d733109baf02ca0cbbd860",
      "allDay": false,
      "appointmentNumber": "00002102",
      "invoiceDataId": null,
      "patientArchived": false,
      "chiefComplaint": null
    },
    {
      "id": "8ba9d953-cc61-41db-9eeb-f331fa81a4a1",
      "practiceId": "7c4bbcef-cf92-457e-bd5d-6074e9b20f5d",
      "providerId": "88c9cf5e-9f34-42bb-a660-9c069cc144b3",
      "patientServiceId": "7c485238-2b88-4b19-b97f-4fe2e502cc9f",
      "patientServiceName": "Cognitive behavioral therapy",
      "patientId": "8d9dd8f0-1ae0-4751-b3a7-2a4b451754c1",
      "patientName": "Lamine Yamal",
      "patientEmail": "lamine.test@test.com",
      "patientNumber": "00000308",
      "additionalParticipants": [],
      "location": "Online",
      "color": "green",
      "timeZone": "Africa/Johannesburg",
      "startTime": "2024-12-05T17:00:00Z",
      "endTime": "2024-12-05T18:00:00Z",
      "status": "Pending",
      "cancellationReason": null,
      "cancellationDetails": null,
      "price": 46,
      "discount": null,
      "clientType": "Existing",
      "providerName": "John Doe",
      "patientServiceType": "Individual",
      "onlineMeetingProvider": "Trova Meet",
      "onlineMeetUrl": "https://qameet.trovahealth.app/client-join?key=cb0ff9398281c8e3913aab303d0ebe9410cf23b4",
      "onlineMeetProviderUrl": "https://qameet.trovahealth.app/provider?key=cb0ff9398281c8e3913aab303d0ebe9410cf23b4",
      "allDay": false,
      "appointmentNumber": "00002101",
      "invoiceDataId": null,
      "patientArchived": false,
      "chiefComplaint": null
    },
    {
      "id": "f9265d30-92ae-4b3f-8fa5-b74adc561e25",
      "practiceId": "7c4bbcef-cf92-457e-bd5d-6074e9b20f5d",
      "providerId": "88c9cf5e-9f34-42bb-a660-9c069cc144b3",
      "patientServiceId": "7c485238-2b88-4b19-b97f-4fe2e502cc9f",
      "patientServiceName": "Cognitive behavioral therapy",
      "patientId": "8d9dd8f0-1ae0-4751-b3a7-2a4b451754c1",
      "patientName": "Lamine Yamal",
      "patientEmail": "lamine.test@test.com",
      "patientNumber": "00000308",
      "additionalParticipants": [],
      "location": "Online",
      "color": "green",
      "timeZone": "Africa/Johannesburg",
      "startTime": "2024-12-05T16:00:00Z",
      "endTime": "2024-12-05T17:00:00Z",
      "status": "Pending",
      "cancellationReason": null,
      "cancellationDetails": null,
      "price": 46,
      "discount": null,
      "clientType": "Existing",
      "providerName": "John Doe",
      "patientServiceType": "Individual",
      "onlineMeetingProvider": "Trova Meet",
      "onlineMeetUrl": "https://qameet.trovahealth.app/client-join?key=2bf7ff27da5e0dbd010b77f9d0bfef22a5873a46",
      "onlineMeetProviderUrl": "https://qameet.trovahealth.app/provider?key=2bf7ff27da5e0dbd010b77f9d0bfef22a5873a46",
      "allDay": false,
      "appointmentNumber": "00002100",
      "invoiceDataId": null,
      "patientArchived": false,
      "chiefComplaint": null
    },
    {
      "id": "62da835e-5b76-4982-893f-98bd7ba140b3",
      "practiceId": "7c4bbcef-cf92-457e-bd5d-6074e9b20f5d",
      "providerId": "88c9cf5e-9f34-42bb-a660-9c069cc144b3",
      "patientServiceId": "7c485238-2b88-4b19-b97f-4fe2e502cc9f",
      "patientServiceName": "Cognitive behavioral therapy",
      "patientId": "8d9dd8f0-1ae0-4751-b3a7-2a4b451754c1",
      "patientName": "Lamine Yamal",
      "patientEmail": "lamine.test@test.com",
      "patientNumber": "00000308",
      "additionalParticipants": [],
      "location": "Online",
      "color": "green",
      "timeZone": "Africa/Johannesburg",
      "startTime": "2024-12-05T15:00:00Z",
      "endTime": "2024-12-05T16:00:00Z",
      "status": "Pending",
      "cancellationReason": null,
      "cancellationDetails": null,
      "price": 46,
      "discount": null,
      "clientType": "Existing",
      "providerName": "John Doe",
      "patientServiceType": "Individual",
      "onlineMeetingProvider": "Trova Meet",
      "onlineMeetUrl": "https://qameet.trovahealth.app/client-join?key=4b92833125bebfc9da34826d0029fb8e8a5a37ed",
      "onlineMeetProviderUrl": "https://qameet.trovahealth.app/provider?key=4b92833125bebfc9da34826d0029fb8e8a5a37ed",
      "allDay": false,
      "appointmentNumber": "00002099",
      "invoiceDataId": null,
      "patientArchived": false,
      "chiefComplaint": null
    },
    {
      "id": "af26ffbf-eb44-4b3e-8016-65fdce1c5780",
      "practiceId": "7c4bbcef-cf92-457e-bd5d-6074e9b20f5d",
      "providerId": "88c9cf5e-9f34-42bb-a660-9c069cc144b3",
      "patientServiceId": "7c485238-2b88-4b19-b97f-4fe2e502cc9f",
      "patientServiceName": "Cognitive behavioral therapy",
      "patientId": "8d9dd8f0-1ae0-4751-b3a7-2a4b451754c1",
      "patientName": "Lamine Yamal",
      "patientEmail": "lamine.test@test.com",
      "patientNumber": "00000308",
      "additionalParticipants": [],
      "location": "Online",
      "color": "green",
      "timeZone": "Africa/Johannesburg",
      "startTime": "2024-12-05T14:00:00Z",
      "endTime": "2024-12-05T15:00:00Z",
      "status": "Pending",
      "cancellationReason": null,
      "cancellationDetails": null,
      "price": 46,
      "discount": null,
      "clientType": "Existing",
      "providerName": "John Doe",
      "patientServiceType": "Individual",
      "onlineMeetingProvider": "Trova Meet",
      "onlineMeetUrl": "https://qameet.trovahealth.app/client-join?key=fc709ceec92550e27fec9afc64d88b41215a5ceb",
      "onlineMeetProviderUrl": "https://qameet.trovahealth.app/provider?key=fc709ceec92550e27fec9afc64d88b41215a5ceb",
      "allDay": false,
      "appointmentNumber": "00002098",
      "invoiceDataId": null,
      "patientArchived": false,
      "chiefComplaint": null
    }
  ]
}

const AppointmentRequests: React.FC = (): React.ReactElement => {
  const { provider } = useSelector((state: RootState) => state);
  const history = useHistory();
  const dispatch = useDispatch<AppDispatch>();
  const appointmentRequestsRef = useRef();
  const datePickerRef = useRef<HTMLIonPopoverElement>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const sortedEvents: any = useMemo(() => [...events.events || []].sort(
    (a, b) => dayjs(a.startTime).valueOf() - dayjs(b.startTime).valueOf()
  ).filter(({ status }) => status === AppointmentStatusEnum.PENDING), [events?.events]);
  const groupedAppointments = useMemo(() => groupAppointmentsByDate(sortedEvents), [sortedEvents]);
  const [presentToast] = usePresentToast();
  const [selectedDate, setSelectedDate] = useState<string | undefined>(today);
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

  const getAppointmentsHandler = async (date: string) => {
    try {
      setDatePickerOpen(false);
      setSelectedDate(date);
      dispatch(setLoading({ loading: true, message: 'Loading appointments' }));

      const [providerPractice] = provider.providerPractices;
      if (providerPractice) {
        await dispatch(getEventsAction({
          practiceId: providerPractice.practiceId,
          providerId: providerPractice.providerId,
          start: dayjs(date).startOf('day').toISOString(),
          end: dayjs(date).endOf('day').toISOString(),
          pageNumber: 0,
          pageSize: 999,
        }));
      }

      dispatch(setLoading({ loading: false, message: '' }));
    } catch (error) {
      dispatch(setLoading({ loading: false, message: '' }));
      setSelectedDate('');
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

  const content = useMemo(() => {
    if (groupedAppointments.length === 0) {
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

    return groupedAppointments.map((event) => (
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
    ));
  }, [groupedAppointments])

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
            <DatePicker date={selectedDate} onSelectedDate={setSelectedDate} onTriggerAction={getAppointmentsHandler} />
          </IonContent>
        </IonPopover>
      </IonPage>
    </>
  );
};

export default AppointmentRequests;
