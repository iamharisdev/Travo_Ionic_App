import { IonCard, IonItem, IonLabel } from '@ionic/react';
import React, { useMemo } from 'react';
import { AppointmentCardProps } from './serviceCard.type';
import { CALENDAR_SLOTS } from '../../shared/types/appointment.type';
import { getAppointmentColor } from '../../shared/utils/appointments.util';

import './ServiceCard.scss';

const CSSPrefix = 'service-card';

const ServiceCard: React.FC<AppointmentCardProps> = ({ service, onClick }): React.ReactElement => {
  const duration = useMemo(() => {
    let parsedDuration = '';

    if (service?.duration) {
      const minutes = service.duration;
      const hours = Math.floor(minutes / 60);

      if (minutes > 60) {
        parsedDuration = `${hours} hours`;
      }

      if (minutes === 60) {
        parsedDuration = `${hours} hour`;
      }

      if (minutes < 60) {
        parsedDuration = `${minutes} min`;
      }
    }

    return parsedDuration;
  }, [service.duration]);

  return (
    <IonCard
      className={CSSPrefix}
      style={{ borderLeft: `8px solid ${getAppointmentColor((service?.calendarColor as CALENDAR_SLOTS) || '')}` }}
      onClick={onClick}
    >
      <IonItem lines="none" className='ion-no-padding'>
        <IonLabel class={`${CSSPrefix}-title`}>
          {service.name}
          <p className={`${CSSPrefix}-description`}>
            {`${service.location}, ${duration}`}
          </p>
        </IonLabel>
      </IonItem>
    </IonCard>
  );
}

export default ServiceCard;