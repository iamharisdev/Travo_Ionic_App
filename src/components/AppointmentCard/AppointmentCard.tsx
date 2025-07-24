import { IonCard, IonIcon, IonItem, IonRow, IonText } from '@ionic/react';
import React, { useMemo } from 'react';
import { personCircleOutline } from 'ionicons/icons';
import PersonSvg from '/assets/walk.svg';
import MeetingSvg from '/assets/group.svg';
import { AppointmentCardProps } from './appointmentCard.type';
import dayjs from 'dayjs';
import { useHistory } from 'react-router';
import { APPOINTMENT_DETAILS } from '../../shared/routes/routes';
import {
  AppointmentDetailTypeEnum,
  AppointmentStatusEnum,
  IAppointment,
} from '../../shared/types/appointment.type';
import { getAppointmentColor } from '../../shared/utils/appointments.util';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';

import './AppointmentCard.scss';

const CSSPrefix = 'appointment-card';

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }): React.ReactElement => {
  const history = useHistory();
  const { provider } = useSelector((state: RootState) => state);

  const {
    startTime,
    endTime,
  }: {
    startTime: string;
    endTime: string;
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

  const locationIcon = useMemo(
    () =>
      appointment?.location === 'Online' || appointment?.location === 'virtual'
        ? MeetingSvg
        : PersonSvg,
    [appointment?.location]
  );

  const checkRedirectionHandler = (appointment: IAppointment) => {
    // TODO: add redirection for google, outlook and meeting events in app V2
    const { allDay, busy, status } = appointment;

    if (
      !allDay &&
      !busy &&
      status !== AppointmentStatusEnum.BUSY &&
      status !== AppointmentStatusEnum.OCCURRENCE &&
      status !== AppointmentStatusEnum.SINGLE_INSTANCE
    ) {
      history.push(`${APPOINTMENT_DETAILS}/${appointment?.id}`, {
        eventId: appointment?.id,
        type: AppointmentDetailTypeEnum.RESCHEDULE,
      });
    }
  };

  return (
    <IonCard
      className={CSSPrefix}
      style={{ borderLeft: `8px solid ${getAppointmentColor(appointment?.color || '')}` }}
      onClick={() => checkRedirectionHandler(appointment)}
    >
      <IonItem lines="none" className="ion-no-padding">
        <IonIcon icon={personCircleOutline} className={`${CSSPrefix}-profile`} />
        <IonText className={`${CSSPrefix}-title`}>
          {appointment?.patientName || appointment.providerName || appointment.title}
          dskjglsdlskgjdlsgdklsghdlsghklshgdslgkl
        </IonText>
      </IonItem>
      <IonRow>
        <IonText className={`${CSSPrefix}-time`}>{`${startTime} - ${endTime}`}</IonText>
        <div>
          <IonIcon className={`${CSSPrefix}-meeting-icon`} src={locationIcon} slot="end" />
        </div>
      </IonRow>
      {/* Validation to avoid displace same than title section for google and outlook events */}
      {appointment.status !== AppointmentStatusEnum.OCCURRENCE &&
        appointment.status !== AppointmentStatusEnum.SINGLE_INSTANCE && (
          <IonRow>
            <IonText className={`${CSSPrefix}-description`}>
              {appointment?.patientServiceName || appointment?.title}
            </IonText>
          </IonRow>
        )}
    </IonCard>
  );
};

export default AppointmentCard;
