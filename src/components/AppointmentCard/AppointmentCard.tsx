import { IonCard, IonIcon, IonItem, IonRow, IonText } from '@ionic/react';
import React, { useMemo } from 'react';
import { personCircleOutline } from 'ionicons/icons';
import PersonSvg from '/assets/walk.svg';
import MeetingSvg from '/assets/group.svg';
import { AppointmentCardProps } from './appointmentCard.type';
import dayjs from 'dayjs';
import { useHistory } from 'react-router';
import { APPOINTMENT_DETAILS } from '../../shared/routes/routes';
import { AppointmentDetailTypeEnum } from '../../shared/types/appointment.type';
import { getAppointmentColor } from '../../shared/utils/appointments.util';

import './AppointmentCard.scss';

const CSSPrefix = 'appointment-card';

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }): React.ReactElement => {
  const history = useHistory();

  const { startTime, endTime }:
    {
      startTime: string,
      endTime: string,
    } = useMemo(() => {
      let startTime = '';
      let endTime = '';

      if (appointment?.startTime) {
        startTime = dayjs(appointment.startTime).format('hh:mm A');
      }

      if (appointment?.endTime) endTime = dayjs(appointment.endTime).format('hh:mm A');

      return { startTime, endTime };
    }, [appointment?.startTime, appointment?.endTime]);

  const locationIcon = useMemo(() => appointment?.location === 'Online' ? MeetingSvg : PersonSvg, [appointment?.location]);

  return (
    <IonCard
      className={CSSPrefix}
      style={{ borderLeft: `8px solid ${getAppointmentColor(appointment?.color || '')}` }}
      onClick={() => history.push(`${APPOINTMENT_DETAILS}/${appointment?.id}`, {
        eventId: appointment?.id,
        type: AppointmentDetailTypeEnum.RESCHEDULE
      })}
    >
      <IonItem lines="none" className='ion-no-padding'>
        <IonIcon icon={personCircleOutline} />
        <IonText className={`${CSSPrefix}-title`}>{appointment?.patientName}</IonText>
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
          {appointment?.patientServiceName}
        </IonText>
      </IonRow>
    </IonCard>
  );
}

export default AppointmentCard;