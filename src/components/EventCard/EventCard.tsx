import React, { useMemo } from "react";
import { getAppointmentColor } from "../../shared/utils/appointments.util";
import { CALENDAR_SLOTS } from "../../shared/types/appointment.type";
import { IonIcon, IonSkeletonText, IonText } from "@ionic/react";
import { personCircleOutline } from "ionicons/icons";

import './EventCard.scss';

const CSSprefix = 'event-card';

const EventCard: React.FC<any> = ({ children, isMonth = false, loading = false, onClick, ...props }): React.ReactElement => {
  const eventProps: { id: string, service: string, patient: string, color: CALENDAR_SLOTS } = useMemo(() => JSON.parse(props.event.title), [props.event.title]);
  const eventColor = useMemo(() => getAppointmentColor(eventProps.color), [eventProps.color]);

  return (
    <>
      {!loading && (
        <div
          {...children.props}
          style={{ ...children.props.style, backgroundColor: `${eventColor}`, border: 'none' }}
          onClick={() => onClick(eventProps.id)}
        >

          <div className={`${CSSprefix}-event-wrapper-container`} style={{ maxHeight: isMonth ? '27px' : '61px' }}>
            <IonText className={`${CSSprefix}-service`}>{eventProps.service}</IonText>
            <div className={`${CSSprefix}-patient-container`}>
              <IonIcon icon={personCircleOutline} color="dark" />
              <IonText className={`${CSSprefix}-patient`}>{eventProps.patient}</IonText>
            </div>
          </div>
        </div>
      )}
      {loading && (
        <IonSkeletonText animated={true} style={{ ...children.props.style, width: '100%', height: '30px', borderRadius: '8px' }} />
      )}
    </>
  );
};

export default EventCard;