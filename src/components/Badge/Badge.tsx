import React, { useMemo } from 'react';
import { IonBadge, IonCol, IonGrid, IonRow, IonText } from '@ionic/react';
import { BadgeProps } from './badge.type';
import dayjs from 'dayjs';
import { weekday } from '../../shared/constants/dates';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';

import './Badge.scss';

const CSSPrefix = 'badge';

const Badge: React.FC<BadgeProps> = ({ appointmentDate }) => {
  const {
    white: { lang },
  } = useSelector((state: RootState) => state);
  const {
    day,
    date,
    isToday,
  }: {
    day: string;
    date: string;
    isToday: boolean;
  } = useMemo(() => {
    let startTime = '';
    let endTime = '';
    let day = '';
    let date = '';
    let isToday = false;

    if (appointmentDate) {
      startTime = dayjs(appointmentDate).format('hh:mm A');
      day = dayjs(appointmentDate).locale(lang).format('ddd');
      date = dayjs(appointmentDate).date().toString();
      isToday = dayjs(appointmentDate).date() === dayjs().date();
    }

    return { startTime, endTime, day, date, isToday };
  }, [appointmentDate, lang]);

  return (
    <IonGrid fixed={true}>
      <IonRow>
        <IonCol size="auto">
          <IonRow>
            <IonText className={`${CSSPrefix}-badge-text`}>{day}</IonText>
          </IonRow>
          <IonRow>
            <IonBadge color={isToday ? 'primary' : 'none'}>{date}</IonBadge>
          </IonRow>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default Badge;
