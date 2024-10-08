import React, { useMemo } from "react";
import { getAppointmentColor } from "../../shared/utils/appointments.util";
import { CALENDAR_SLOTS } from "../../shared/types/appointment.type";
import { IonIcon, IonText } from "@ionic/react";
import { personCircleOutline } from "ionicons/icons";

import './EventCard.scss';

const CSSprefix = 'event-card';

const EventCard: React.FC<any> = ({ children, ...props }): React.ReactElement => {
  const eventProps: { service: string, patient: string, color: CALENDAR_SLOTS } = useMemo(() => JSON.parse(props.event.title), [props.event.title]);
  const eventColor = useMemo(() => getAppointmentColor(eventProps.color), [eventProps.color]);

  return (
    <div {...children.props} style={{ ...children.props.style, backgroundColor: `${eventColor}`, border: 'none' }}>
      <div className={`${CSSprefix}-event-wrapper-container`}>
        <IonText className={`${CSSprefix}-service`}>{eventProps.service}</IonText>
        <div className={`${CSSprefix}-patient-container`}>
          <IonIcon icon={personCircleOutline} color="dark" />
          <IonText className={`${CSSprefix}-patient`}>{eventProps.patient}</IonText>
        </div>
      </div>
    </div>
  );
};

export default EventCard;