import { IonText } from '@ionic/react';
import React from 'react';
import { weekday } from '../../shared/constants/dates';
import dayjs from 'dayjs';
import { HeaderProps } from 'react-big-calendar';

import './HeaderCalendar.scss';

const CSSPrefix = 'header-calendar';

const HeaderCalendar: React.FC<HeaderProps & { type?: 'week' | 'month' }> = ({ date, type = 'week' }): React.ReactElement => {
  return (
    <div className={`${CSSPrefix}`}>
      <div>
        <IonText className={`${CSSPrefix}-day`}>
          {weekday[dayjs(date).day()].substring(0, 1).toUpperCase()}
        </IonText>
      </div>
      {type === 'week' && (
        <div>
          <IonText
            className={`${CSSPrefix}-date`}
            style={{ color: dayjs(date).date() === dayjs().date() ? 'var(--ion-color-primary)' : '' }}
          >
            {dayjs(date).date()}
          </IonText>
        </div>
      )}
    </div>
  );
}

export default HeaderCalendar