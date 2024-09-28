import React, { useMemo } from "react";
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonItem,
  IonPage,
  IonRow,
  IonText,
} from "@ionic/react";
import Header from "../../components/Header/Header";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import dayjs from "dayjs";
import { useHistory, useLocation } from "react-router";
import { months, weekday } from "../../shared/constants/dates";
import { callOutline, copyOutline, mailOutline, personCircleOutline, pricetagOutline, timerOutline, videocamOutline } from "ionicons/icons";
import { getAppointmentColor } from "../../shared/utils/appointments.util";
import { AppointmentDetailTypeEnum, AppointmentStatusEnum, CALENDAR_SLOTS } from "../../shared/types/appointment.type";
import { Clipboard } from "@capacitor/clipboard";
import { APPOINTMENT_DETAILS_EDIT } from "../../shared/routes/routes";

import "./AppointmentDetails.scss";

const CSSprefix = 'appointment-details';

const AppointmentDetails: React.FC = (): React.ReactElement => {
  const location = useLocation<{ eventId?: string, type?: AppointmentDetailTypeEnum }>();
  const history = useHistory();
  const { provider, scheduling: { events } } = useSelector((state: RootState) => state);

  const event = useMemo(() => events?.events?.find(({ id, status, ...rest }) => {
    if (location?.state?.type === AppointmentDetailTypeEnum.RESCHEDULE && id === location?.state?.eventId) {
      return { id, status, ...rest };
    }

    if (location?.state?.type === AppointmentDetailTypeEnum.ACCEPT && id === location?.state?.eventId && status === AppointmentStatusEnum.PENDING) {
      return { id, status, ...rest };
    }

    return { id, ...rest };
  }), [events?.events, location?.state?.eventId]);

  const { startTime, endTime, day, month, date, duration }:
    {
      startTime: string,
      endTime: string,
      day: string,
      date: string,
      month: string,
      duration: string,
    } = useMemo(() => {
      let startTime = '';
      let endTime = '';
      let day = '';
      let date = '';
      let month = '';
      let duration = '';

      if (event?.startTime) {
        const start = dayjs(event.startTime);
        startTime = start.format('hh:mm A');
        day = weekday[start.day()];
        month = months[start.month()].substring(0, 3);
        date = start.date().toString();
      }

      if (event?.endTime) endTime = dayjs(event.endTime).format('hh:mm A');

      if (event?.startTime && event?.endTime) {
        const seconds = Math.floor((dayjs(event.endTime).valueOf() - dayjs(event.startTime).valueOf()) / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (minutes > 60) {
          duration = `${hours} hours`;
        }

        if (minutes === 60) {
          duration = `${hours} hour`;
        }

        if (minutes < 60) {
          duration = `${minutes} min`;
        }
      }

      return { startTime, endTime, day, date, month, duration };
    }, [event?.startTime, event?.endTime]);

  const currency = useMemo(() => {
    if (provider?.practice?.preferredCurrency) {
      return provider.practice.preferredCurrency;
    }

    return '';
  }, [provider.practice]);

  const isOnline = useMemo(() => event?.location === 'Online', [event?.location]);

  const barColor = useMemo(() => getAppointmentColor(event?.color as CALENDAR_SLOTS), [event?.color]);

  const { positiveLabel, negativeLabel }: { positiveLabel: string, negativeLabel: string } = useMemo(() => {
    if (location?.state?.type === AppointmentDetailTypeEnum.ACCEPT) {
      return { positiveLabel: 'Accept appointment', negativeLabel: 'Decline appointment' };
    }

    if (location?.state?.type === AppointmentDetailTypeEnum.RESCHEDULE) {
      return { positiveLabel: 'Reschedule appointment', negativeLabel: 'Cancel appointment' };
    }

    return { positiveLabel: 'Reschedule appointment', negativeLabel: 'Cancel appointment' };
  }, [location?.state?.type]);

  const copyOnlineMeetUrl = async () => {
    await Clipboard.write({
      string: event?.onlineMeetUrl
    });
  };

  const editAppointmentHandler = () => history.push(`${APPOINTMENT_DETAILS_EDIT}/${event?.id}`, {
    appointmentId: location.state.eventId,
    patientServiceId: event?.patientServiceId || '',
    patientName: event?.patientName || '',
    patientServiceName: event?.patientServiceName || '',
    price: event?.price || '',
    location: event?.location || '',
    startTime: event?.startTime || '',
    endTime: event?.endTime || '',
    duration,
  });

  return (
    <IonPage className={CSSprefix}>
      <Header showBack showEdit showMenu={false} editCB={editAppointmentHandler} />
      <IonContent fullscreen={true}>
        <IonGrid className="ion-margin-top ion-padding-top">
          <IonRow>
            <IonCol size="auto">
              <IonItem lines="none">
                <div className={`${CSSprefix}-bar`} style={{ background: barColor }} />
              </IonItem>
            </IonCol>
            <IonCol>
              <IonItem lines="none" className="ion-no-padding">
                <IonText className={`${CSSprefix}-service`}>{event?.patientServiceName}</IonText>
              </IonItem>
              <IonItem lines="none" className="ion-no-padding">
                <IonText className={`${CSSprefix}-details`}>{`${day}, ${month} ${date}, ${startTime} - ${endTime}`}</IonText>
              </IonItem>
              <IonItem lines="none" className="ion-no-padding">
                <IonText className={`${CSSprefix}-details`}>{event?.patientServiceType}</IonText>
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonItem lines="none" className="ion-margin-top">
          <IonIcon icon={personCircleOutline} style={{ color: 'var(--ion-trova-medium-gray)' }} />
          <IonText className={`${CSSprefix}-details`}>
            {event?.patientName}
          </IonText>
        </IonItem>
        <IonItem lines="none">
          <IonIcon icon={timerOutline} style={{ color: 'var(--ion-trova-medium-gray)' }} />
          <IonText className={`${CSSprefix}-details`}>
            {`${event?.location}, ${duration}`}
          </IonText>
        </IonItem>
        <IonItem lines="none">
          <IonIcon icon={pricetagOutline} style={{ color: 'var(--ion-trova-medium-gray)' }} />
          <IonText className={`${CSSprefix}-details`}>
            {`$${event?.price?.toFixed(2)} ${currency}`}
          </IonText>
        </IonItem>
        <IonItem lines="none">
          <IonIcon icon={callOutline} style={{ color: 'var(--ion-trova-medium-gray)' }} />
          <IonText className={`${CSSprefix}-link`}>
            <a style={{ textDecoration: 'none' }} href={`tel:${provider.practice?.phoneNumberPrefix} ${provider.practice?.phoneNumber}`}>
              {`${provider.practice?.phoneNumberPrefix} ${provider.practice?.phoneNumber}`}
            </a>
          </IonText>
        </IonItem>
        <IonItem lines="none">
          <IonIcon icon={mailOutline} style={{ color: 'var(--ion-trova-medium-gray)' }} />
          <IonText className={`${CSSprefix}-link`}>
            <a style={{ textDecoration: 'none' }} href={`mailto:${provider.practice?.userName}`}>
              {`${provider.practice?.userName}`}
            </a>
          </IonText>
        </IonItem>
        {isOnline && (
          <IonItem lines="none">
            <IonIcon icon={videocamOutline} style={{ color: 'var(--ion-trova-medium-gray)' }} />
            <IonText className={`${CSSprefix}-link`}>
              <a style={{ textDecoration: 'none' }} href={event?.onlineMeetUrl} target="_blank">
                {`${event?.onlineMeetUrl}`}
              </a>
            </IonText>
            <IonIcon
              icon={copyOutline}
              slot="end"
              style={{ color: 'var(--ion-trova-medium-gray)' }}
              onClick={copyOnlineMeetUrl}
            />
          </IonItem>
        )}
        {location?.state?.type === AppointmentDetailTypeEnum.RESCHEDULE && isOnline && (
          <>
            <IonButton
              className="ion-padding"
              expand="block"
            >
              Start
            </IonButton>
            <div className={`${CSSprefix}-divider`} />
          </>
        )}
        <IonButton
          className="ion-padding"
          expand="block"
          fill={location?.state?.type === AppointmentDetailTypeEnum.RESCHEDULE ? 'outline' : 'solid'}
          color="primary"
        >
          {positiveLabel}
        </IonButton>
        <IonButton
          className="ion-padding ion-no-margin"
          expand="block"
          fill={location?.state?.type === AppointmentDetailTypeEnum.RESCHEDULE ? 'clear' : 'outline'}
          color="danger"
        >
          {negativeLabel}
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default AppointmentDetails;
