import { IonBadge, IonCard, IonCol, IonGrid, IonIcon, IonItem, IonRow, IonText } from '@ionic/react';
import React, { useCallback, useMemo } from 'react';
import { personCircleOutline } from 'ionicons/icons';
import PersonSvg from '/assets/walk.svg';
import MeetingSvg from '/assets/group.svg';
import { AppointmentCardProps } from './appointmentCard.type';
import dayjs from 'dayjs';
import { CALENDAR_SLOTS } from '../../shared/types/appointment.type';

import './AppointmentCard.scss';

const CSSPrefix = 'appointment-card';

const AppointmentCard: React.FC<AppointmentCardProps> = ({ event }): React.ReactElement => {
  const getCardColor = useCallback(() => {
    switch (event?.color) {
      case CALENDAR_SLOTS.ORANGE:
        return `8px solid var(--ion-trova-orange-color)`;
      case CALENDAR_SLOTS.PINK:
        return `8px solid var(--ion-trova-pink-color)`;
      case CALENDAR_SLOTS.PURPLE:
        return `8px solid var(--ion-trova-purple-color)`;
      case CALENDAR_SLOTS.BLUE:
        return `8px solid var(--ion-trova-blue-color)`;
      case CALENDAR_SLOTS.GREEN:
        return `8px solid var(--ion-trova-green-color)`;
      case CALENDAR_SLOTS.TEAL:
        return `8px solid var(--ion-trova-teal-color)`;
      default:
        return `8px solid var(--ion-trova-orange-color)`;
    }
  }, [event?.color]);

  const { startTime, endTime, day, date, isToday }:
    {
      startTime: string,
      endTime: string,
      day: string,
      date: string,
      isToday: boolean,
    } = useMemo(() => {
      const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      let startTime = '';
      let endTime = '';
      let day = '';
      let date = '';
      let isToday = false;

      if (event?.startTime) {
        startTime = dayjs(event.startTime).format('hh:mm A');
        day = weekday[dayjs(event.startTime).day()].substring(0, 3);
        date = dayjs(event.startTime).date().toString();
        isToday = dayjs(event.startTime).date() === dayjs().date();
      }
      if (event?.endTime) endTime = dayjs(event.endTime).format('hh:mm A');

      return { startTime, endTime, day, date, isToday };
    }, [event?.startTime, event?.endTime]);

  const locationIcon = useMemo(() => event?.location === 'Online' ? MeetingSvg : PersonSvg, [event?.location]);

  return (
    <IonGrid fixed={true} className={`${CSSPrefix} ion-no-padding ion-no-margin`}>
      <IonRow className="ion-margin-start">
        <IonCol size="auto" className="ion-margin-top">
          <IonRow>
            <IonText className={`${CSSPrefix}-badge-text`}>{day}</IonText>
          </IonRow>
          <IonRow>
            <IonBadge color={isToday ? 'primary' : 'none'}>{date}</IonBadge>
          </IonRow>
        </IonCol>
        <IonCol>
          <IonCard style={{ borderLeft: getCardColor() }}>
            <IonItem lines="none" className='ion-no-padding'>
              <IonIcon icon={personCircleOutline} />
              <IonText className={`${CSSPrefix}-title`}>{event?.patientName}</IonText>
            </IonItem>
            <IonRow>
              <IonText className={`${CSSPrefix}-description`}>
                {`${startTime} - ${endTime}`}
              </IonText>
              <div>
                <IonIcon className={`${CSSPrefix}-meeting-icon`} src={locationIcon} slot="end" />
              </div>
            </IonRow>
            <IonRow>
              <IonText className={`${CSSPrefix}-description`}>
                {event.patientServiceName}
              </IonText>
            </IonRow>
          </IonCard>
        </IonCol>
      </IonRow>

    </IonGrid>
  );
}

export default AppointmentCard;