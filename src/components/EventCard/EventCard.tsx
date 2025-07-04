import React, { useMemo } from 'react';
import { getAppointmentColor } from '../../shared/utils/appointments.util';
import { CALENDAR_SLOTS } from '../../shared/types/appointment.type';
import { IonIcon, IonSkeletonText, IonText } from '@ionic/react';
import { personCircleOutline } from 'ionicons/icons';
import dayjs from 'dayjs';
import './EventCard.scss';
import { useTranslation } from 'react-i18next';

const CSSprefix = 'event-card';

const EventCard: React.FC<any> = ({
  children,
  isMonth = false,
  loading = false,
  index = 1,
  eventsLeft = 0,
  onClick,
  ...rest
}): React.ReactElement | null => {
  const { t } = useTranslation();
  const lang = localStorage.getItem('language') || 'en';

  // Defensive: skip if event or event.title missing
  if (!rest?.event?.title) {
    return null;
  }

  let eventProps;
  try {
    eventProps = JSON.parse(rest.event.title);
  } catch (err) {
    console.error('Invalid event title JSON', err);
    return null;
  }

  // Defensive: skip if essential props missing
  if (!eventProps?.id || !eventProps?.service) {
    return null;
  }

  const eventColor = useMemo(
    () => getAppointmentColor(eventProps.color),
    [eventProps.color]
  );

  const showExtraInformation = useMemo(() => {
    if (eventProps?.start && eventProps?.end) {
      const seconds = Math.floor(
        (dayjs(eventProps.end).valueOf() - dayjs(eventProps.start).valueOf()) / 1000
      );
      const minutes = Math.floor(seconds / 60);
      return minutes >= 60;
    }
    return false;
  }, [eventProps?.start, eventProps?.end]);

  // Skip rendering if index > 4
  if (index > 4) {
    return null;
  }

  const content = useMemo(() => {
    if (index === 4) {
      return (
        <p className="more">
          {lang === 'en'
            ? `${eventsLeft} ${t('more_events')}`
            : `${t('more_events')} ${eventsLeft}`}
        </p>
      );
    }

    return (
      <div
        {...children.props}
        style={{
          ...children.props.style,
          backgroundColor: `${eventColor}`,
          border: 'none',
          height: isMonth ? '2vh' : children.props.style.height,
          padding: isMonth ? '0 5px' : undefined,
        }}
        onClick={() => {
          if (onClick) onClick(eventProps.id);
        }}
      >
        <div
          className={`${CSSprefix}-event-wrapper-container`}
          style={{ maxHeight: isMonth ? '27px' : '61px' }}
        >
          <IonText className={`${CSSprefix}-service`}>{eventProps.service}</IonText>

          {showExtraInformation && (
            <div className={`${CSSprefix}-patient-container`}>
              {!eventProps.isMeetingEvent ? (
                <>
                  {eventProps.patient && (
                    <>
                      <IonIcon icon={personCircleOutline} color="dark" />
                      <IonText className={`${CSSprefix}-patient`}>
                        {eventProps.patient}
                      </IonText>
                    </>
                  )}
                </>
              ) : (
                <IonText className={`${CSSprefix}-patient ion-no-margin`}>
                  {`${dayjs(eventProps.start).format('HH:mm A')} - ${dayjs(
                    eventProps.end
                  ).format('HH:mm A')}`}
                </IonText>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }, [children, eventColor, eventProps, index, eventsLeft, onClick, showExtraInformation]);

  return (
    <>
      {!loading && content}
      {loading && (
        <IonSkeletonText
          animated={true}
          style={{
            ...children.props.style,
            width: '100%',
            height: '30px',
            borderRadius: '8px',
          }}
        />
      )}
    </>
  );
};

export default EventCard;
