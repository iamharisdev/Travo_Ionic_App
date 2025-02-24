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
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';

import './AppointmentCard.scss';

const CSSPrefix = 'appointment-card';

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }): React.ReactElement => {
  const history = useHistory();
  const {
    provider,
  } = useSelector((state: RootState) => state);

  const { startTime, endTime }:
    {
      startTime: string,
      endTime: string,
    } = useMemo(() => {
      let startTime = '';
      let endTime = '';
      let format = 'hh:mm A';

      if (provider.practice?.displayTwentyFourHourTime) {
        format = 'HH:mm';
      }

      if (appointment?.startTime) {
        startTime = dayjs(appointment.startTime).format(format);
      }

      if (appointment?.endTime) endTime = dayjs(appointment.endTime).format(format);

      return { startTime, endTime };
    }, [appointment?.startTime, appointment?.endTime, provider.practice?.displayTwentyFourHourTime]);

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
        <IonText className={`${CSSPrefix}-title`}>{appointment?.patientName || appointment.providerName}</IonText>
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
          {appointment?.patientServiceName || appointment?.title}
        </IonText>
      </IonRow>
    </IonCard>
  );
}

export default AppointmentCard;