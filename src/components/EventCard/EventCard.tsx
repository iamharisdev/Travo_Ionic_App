import React, { useMemo } from 'react';
import { getAppointmentColor } from '../../shared/utils/appointments.util';
import { CALENDAR_SLOTS } from '../../shared/types/appointment.type';
import { IonIcon, IonSkeletonText, IonText } from '@ionic/react';
import { personCircleOutline } from 'ionicons/icons';
import dayjs from 'dayjs';
import './EventCard.scss';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';

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
  const { lang } = useSelector((state: RootState) => state.white);

  // Safely read child props/style (children can be undefined during RBC layout passes)
  const childProps = (children as any)?.props ?? {};
  const childStyle = childProps?.style ?? {};

  const eventTitle = rest?.event?.title ?? null;

  const eventProps = useMemo(() => {
    if (!eventTitle) return null;
    try {
      return typeof eventTitle === 'string' ? JSON.parse(eventTitle) : eventTitle;
    } catch {
      return null;
    }
  }, [eventTitle]);

  const eventColor = useMemo(() => getAppointmentColor(eventProps?.color), [eventProps?.color]);

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

  const isRenderableIndex = index <= 4;

  const content = useMemo(() => {
    if (!isRenderableIndex) return null;
    if (!eventProps?.id || !eventProps?.service) return null;

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
        {...children?.props}
        style={{
          ...children.props?.style,
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
                      <IonText className={`${CSSprefix}-patient`}>{eventProps.patient}</IonText>
                    </>
                  )}
                </>
              ) : (
                <IonText className={`${CSSprefix}-patient ion-no-margin`}>
                  {`${dayjs(eventProps.start).format('HH:mm A')} - ${dayjs(eventProps.end).format(
                    'HH:mm A'
                  )}`}
                </IonText>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }, [
    isRenderableIndex,
    index,
    lang,
    eventsLeft,
    t,
    children,
    eventColor,
    isMonth,
    onClick,
    eventProps,
    showExtraInformation,
  ]);

  // Choose what to render AFTER all hooks have run (keeps hook order stable)
  if (loading) {
    return (
      <IonSkeletonText
        animated={true}
        style={{
          ...childStyle,
          width: '100%',
          height: '30px',
          borderRadius: '8px',
        }}
      />
    );
  }

  // If we lack minimum data or shouldn't render this index, render nothing
  if (!eventTitle || !eventProps || !isRenderableIndex) {
    return null;
  }

  return <>{content}</>;
};

export default EventCard;
