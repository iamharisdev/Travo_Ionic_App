import React, { useMemo } from "react";
import { getAppointmentColor } from "../../shared/utils/appointments.util";
import { CALENDAR_SLOTS } from "../../shared/types/appointment.type";
import { IonSkeletonText, IonText } from "@ionic/react";

import './EventCard.scss';

const CSSprefix = 'event-card';

const EventCard: React.FC<any> = ({ children, isMonth = false, loading = false, index = 1, eventsLeft = 0, onClick, ...props }): React.ReactElement => {
  const eventProps: { id: string, service: string, patient: string, color: CALENDAR_SLOTS, index: number } = useMemo(() => JSON.parse(props.event.title), [props.event.title]);
  const eventColor = useMemo(() => getAppointmentColor(eventProps.color), [eventProps.color]);

  const content = useMemo(() => {
    if (index > 4) {
      return null;
    }

    if (index === 4) {
      return <p className="more">{`${eventsLeft} more`}</p>;
    }

    return (
      <div
        {...children.props}
        style={{ ...children.props.style, backgroundColor: `${eventColor}`, border: 'none', height: isMonth && '16px', padding: isMonth && '0 5px' }}
        onClick={() => onClick(eventProps.id)}
      >

        <div className={`${CSSprefix}-event-wrapper-container`} style={{ maxHeight: isMonth ? '27px' : '61px' }}>
          <IonText className={`${CSSprefix}-service`}>{eventProps.service}</IonText>
        </div>
      </div>
    );
  }, [children, eventColor, eventProps, index, eventsLeft, onClick]);

  return (
    <>
      {!loading && content}
      {loading && (
        <IonSkeletonText animated={true} style={{ ...children.props.style, width: '100%', height: '30px', borderRadius: '8px' }} />
      )}
    </>
  );
};

export default EventCard;