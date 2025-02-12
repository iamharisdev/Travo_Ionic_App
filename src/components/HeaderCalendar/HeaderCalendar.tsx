import { IonText } from '@ionic/react';
import React from 'react';
import { weekday } from '../../shared/constants/dates';
import dayjs from 'dayjs';
import { HeaderProps } from 'react-big-calendar';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../state/store';
import { setDate } from '../../state/calendarSlice';
import { useHistory } from 'react-router';
import { CALENDAR_DAY } from '../../shared/routes/routes';

import './HeaderCalendar.scss';

const CSSPrefix = 'header-calendar';

const HeaderCalendar: React.FC<HeaderProps & { type?: 'week' | 'month' }> = ({ date, type = 'week' }): React.ReactElement => {
  const dispatch = useDispatch<AppDispatch>();
  const history = useHistory();

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
            onClick={() => {
              dispatch(setDate(dayjs(date).toISOString()));
              history.push(CALENDAR_DAY);
            }}
          >
            {dayjs(date).date()}
          </IonText>
        </div>
      )}
    </div>
  );
}

export default HeaderCalendar