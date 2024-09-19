import { IonBadge, IonCard, IonCol, IonGrid, IonIcon, IonItem, IonRow, IonText } from '@ionic/react';
import React, { useMemo } from 'react';
import { personCircleOutline } from 'ionicons/icons';
import PersonSvg from '/assets/walk.svg';
import MeetingSvg from '/assets/group.svg';
import { AppointmentCardProps } from './appointmentCard.type';
import dayjs from 'dayjs';

import './AppointmentCard.scss';

const CSSPrefix = 'appointment-card';

const AppointmentCard: React.FC<AppointmentCardProps> = ({ event }): React.ReactElement => {
  // TODO: get right colors and use color property from event object
  const getRandomColor = () => {
    const random = Math.floor(Math.random() * (5 - 1 + 1) + 1);
    switch (random) {
      case 1:
        return `8px solid var(--ion-trova-card-border-peter-parker)`;
      case 2:
        return `8px solid var(--ion-trova-card-border-homelander)`;
      case 3:
        return `8px solid var(--ion-trova-card-border-peter-grifin)`;
      case 4:
        return `8px solid var(--ion-trova-card-border-cristiano)`;
      case 5:
        return `8px solid var(--ion-trova-card-border-camilo)`;
      default:
        return `8px solid var(--ion-trova-card-border-peter-parker)`;
    }
  }

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
          <IonCard style={{ borderLeft: getRandomColor() }}>
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