import React, { useMemo } from 'react';
import { IonButton, IonCol, IonGrid, IonIcon, IonItem, IonRow, IonText } from '@ionic/react';
import './AppointmentRequestCard.scss';
import { getAppointmentColor, getDateWithoutTime } from '../../shared/utils/appointments.util';
import { AppointmentDetailTypeEnum, CALENDAR_SLOTS } from '../../shared/types/appointment.type';
import { AppointmentRequestProps } from './appointmentRequest.type';
import dayjs from 'dayjs';
import { months, weekday } from '../../shared/constants/dates';
import { personCircleOutline } from 'ionicons/icons';
import { useHistory } from 'react-router';
import { APPOINTMENT_DETAILS } from '../../shared/routes/routes';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { useTranslation } from 'react-i18next';

const CSSprefix = 'appointment-request-card';

const AppointmentRequestCard: React.FC<AppointmentRequestProps> = ({
  appointment,
  acceptCB,
  declineCB,
}) => {
  const history = useHistory();
  const barColor = useMemo(
    () => getAppointmentColor(appointment?.color as CALENDAR_SLOTS),
    [appointment?.color]
  );
  const { provider } = useSelector((state: RootState) => state);
  const { t, i18n } = useTranslation();
  dayjs.locale(i18n.language);
  const {
    startTime,
    endTime,
    day,
    month,
    date,
    duration,
    showButtons,
  }: {
    startTime: string;
    endTime: string;
    day: string;
    date: string;
    month: string;
    duration: string;
    showButtons: boolean;
  } = useMemo(() => {
    let startTime = '';
    let endTime = '';
    let day = '';
    let date = '';
    let month = '';
    let duration = '';
    let showButtons = false;
    let format = 'hh:mm A';

    if (provider.practice?.displayTwentyFourHourTime) {
      format = 'HH:mm';
    }

    if (appointment?.startTime) {
      const start = dayjs(appointment.startTime);
      const isBefore = dayjs().isBefore(start);

      if (isBefore) {
        showButtons = true;
      }

      startTime = start.format(format);
      day = dayjs(start).locale(i18n.language).format('ddd');
      month = dayjs(start).locale(i18n.language).format('MMM');
      date = dayjs(getDateWithoutTime(start.toISOString())).date().toString();
    }

    if (appointment?.endTime) endTime = dayjs(appointment.endTime).format(format);

    if (appointment?.startTime && appointment?.endTime) {
      const seconds = Math.floor(
        (dayjs(appointment.endTime).valueOf() - dayjs(appointment.startTime).valueOf()) / 1000
      );
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

    return { startTime, endTime, day, date, month, duration, showButtons };
  }, [appointment?.startTime, appointment?.endTime, i18n.language]);

  return (
    <IonGrid className="ion-margin-top ion-padding-top">
      <IonRow
        onClick={() => {
          if (showButtons) {
            history.push(`${APPOINTMENT_DETAILS}/${appointment?.id}`, {
              eventId: appointment?.id,
              type: AppointmentDetailTypeEnum.ACCEPT,
            });
          }
        }}
      >
        <IonCol className="ion-margin-end" size="auto">
          <div className={`${CSSprefix}-bar`} style={{ background: barColor }} />
        </IonCol>
        <IonCol>
          <IonItem lines="none" className="ion-no-padding">
            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonItem className="ion-no-padding" lines="none">
                    <IonIcon
                      icon={personCircleOutline}
                      className={`${CSSprefix}-person-icon`}
                      slot="start"
                    />
                    <IonText className={`${CSSprefix}-patient custom-margin-bottom`}>
                      {appointment?.patientName}
                    </IonText>
                  </IonItem>
                </IonCol>
                <IonCol size="auto">
                  <IonText
                    className={`${CSSprefix}-details`}
                  >{`${appointment?.location}, ${duration}`}</IonText>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonText
                  className={`${CSSprefix}-details custom-margin-bottom`}
                >{`${day}, ${month} ${date}, ${startTime} - ${endTime}`}</IonText>
              </IonRow>
              <IonRow>
                <IonText className={`${CSSprefix}-details`}>
                  {appointment?.patientServiceType}
                </IonText>
              </IonRow>
            </IonGrid>
          </IonItem>
        </IonCol>
      </IonRow>
      {showButtons && (
        <IonRow>
          <IonCol>
            <IonButton
              className="ion-padding"
              color="primary"
              expand="block"
              onClick={() => acceptCB(appointment?.id || '')}
            >
              {t('appointment_header_accept')}
            </IonButton>
          </IonCol>
          <IonCol>
            <IonButton
              className="ion-padding"
              fill="outline"
              color="danger"
              expand="block"
              onClick={() => declineCB(appointment?.id || '')}
            >
              {t('appointment_header_decline')}
            </IonButton>
          </IonCol>
        </IonRow>
      )}
    </IonGrid>
  );
};

export default AppointmentRequestCard;
