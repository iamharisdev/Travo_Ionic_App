import React, { useCallback, useMemo, useState, useEffect } from 'react';
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonItem,
  IonPage,
  IonRow,
  IonSkeletonText,
  IonText,
  useIonViewDidEnter,
} from '@ionic/react';
import Header from '../../components/Header/Header';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../state/store';
import dayjs from 'dayjs';
import { useHistory, useLocation } from 'react-router';
import { months, weekday } from '../../shared/constants/dates';
import {
  callOutline,
  copyOutline,
  mailOutline,
  personCircleOutline,
  pricetagOutline,
  timerOutline,
  videocamOutline,
} from 'ionicons/icons';
import { getAppointmentColor } from '../../shared/utils/appointments.util';
import {
  AppointmentDetailTypeEnum,
  AppointmentStatusEnum,
  CALENDAR_SLOTS,
} from '../../shared/types/appointment.type';
import { Clipboard } from '@capacitor/clipboard';
import { APPOINTMENT_CANCEL, APPOINTMENT_DETAILS_EDIT } from '../../shared/routes/routes';
import usePresentToast from '../../hooks/usePresentToast';
import { setLoading } from '../../state/loadingSlice';
import { confirmAppointmentAction } from '../../state/schedulingSlice';
import RescheduleAppointment from '../../components/RescheduleAppointment/RescheduleAppointment';
import Recurring from '../../components/Recurring/Recurring';

import { patientApiInstance } from '../../api/axios.instance';

import './AppointmentDetails.scss';
import { useTranslation } from 'react-i18next';
import RecurringAppointmentModal from '../../components/RescheduleAppointment/Steps/RecurringAppointmentModal/RecurringAppointmentModal';

const CSSprefix = 'appointment-details';

interface EventData {
  eventId?: string;
  type?: AppointmentDetailTypeEnum;
}

interface PatientContactInfo {
  mobileNumber: string;
  mobileNumberPrefix: string;
  email: string;
  chiefComplaint: string;
}

const AppointmentDetails: React.FC = (): React.ReactElement => {
  const location = useLocation<EventData>();

  const dispatch = useDispatch<AppDispatch>();
  const [presentToast] = usePresentToast();
  const history = useHistory();
  const {
    provider,
    scheduling: { events },
    practice: { currencies, lookupCurrencies },
  } = useSelector((state: RootState) => state);
  const [rescheduleOpen, setRescheduleOpen] = useState<boolean>(false);
  const [eventType, setEventType] = useState<string>('');
  const [eventData, setEventData] = useState<EventData>();
  const [isRecurringOpen, setIsRecurringOpen] = useState(false);
  const [patientContactInfo, setPatientContactInfo] = useState<PatientContactInfo | null>(null);
  const { t } = useTranslation();

  const event = useMemo(() => {
    if (!events?.events || !location?.state) return undefined;

    return events.events.find(({ id, status }) => {
      if (
        location.state.type === AppointmentDetailTypeEnum.RESCHEDULE &&
        id === location.state.eventId
      ) {
        return true;
      }

      if (
        location.state.type === AppointmentDetailTypeEnum.ACCEPT &&
        id === location.state.eventId &&
        status === AppointmentStatusEnum.PENDING
      ) {
        return true;
      }

      return false;
    });
  }, [events?.events, location?.state]);

  const {
    startTime,
    endTime,
    day,
    month,
    date,
    duration,
  }: {
    startTime: string;
    endTime: string;
    day: string;
    date: string;
    month: string;
    duration: string;
  } = useMemo(() => {
    let startTime = '';
    let endTime = '';
    let day = '';
    let date = '';
    let month = '';
    let duration = '';
    let format = 'hh:mm A';

    if (provider.practice?.displayTwentyFourHourTime) {
      format = 'HH:mm';
    }

    if (event?.startTime) {
      const start = dayjs(event.startTime);
      startTime = start.format(format);
      day = weekday[start.day()];
      month = months[start.month()].substring(0, 3);
      date = start.date().toString();
    }

    if (event?.endTime) endTime = dayjs(event.endTime).format(format);

    if (event?.startTime && event?.endTime) {
      const seconds = Math.floor(
        (dayjs(event.endTime).valueOf() - dayjs(event.startTime).valueOf()) / 1000
      );
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);

      if (minutes > 60) {
        duration = `${hours} hours`;
      }

      if (minutes === 60) {
        duration = `${hours} hour`;
      }

      if (minutes < 60) {
        duration = `${minutes} min`;
      }
    }

    return { startTime, endTime, day, date, month, duration };
  }, [event?.startTime, event?.endTime, provider.practice?.displayTwentyFourHourTime]);

  const currency = useMemo(() => {
    if (provider?.practice?.preferredCurrency) {
      return provider.practice.preferredCurrency;
    }

    return '';
  }, [provider.practice]);

  const currencySymbol = useMemo(() => {
    let res = lookupCurrencies.find(i => i.currency == currency);
    return res?.symbol;
  }, [provider.practice]);

  const isOnline = useMemo(
    () => event?.location === 'Online' || event?.location === 'Virtual',
    [event?.location]
  );

  const barColor = useMemo(
    () => getAppointmentColor(event?.color as CALENDAR_SLOTS),
    [event?.color]
  );

  const { positiveLabel, negativeLabel }: { positiveLabel: string; negativeLabel: string } =
    useMemo(() => {
      if (location?.state?.type === AppointmentDetailTypeEnum.ACCEPT) {
        return {
          positiveLabel: `${t('appointment_request_accept_appointment')}`,
          negativeLabel: `${t('appointment_request_decline_appointment')}`,
        };
      }

      if (location?.state?.type === AppointmentDetailTypeEnum.RESCHEDULE) {
        return {
          positiveLabel: `${t('scheduling_reschedule_appointment')}`,
          negativeLabel: `${t('scheduling_cancel_appointment')}`,
        };
      }

      return {
        positiveLabel: `${t('scheduling_reschedule_appointment')}`,
        negativeLabel: `${t('scheduling_cancel_appointment')}`,
      };
    }, [location?.state?.type]);

  const { practiceId, providerId }: { practiceId: string; providerId: string } = useMemo(() => {
    let practiceId = '';
    let providerId = '';

    if (provider.providerPractices.length > 0) {
      const [providerPractice] = provider.providerPractices;

      return {
        practiceId: providerPractice.practiceId,
        providerId: providerPractice.providerId,
      };
    }

    return { practiceId, providerId };
  }, [provider.providerPractices]);

  const showEdit = useMemo(() => {
    const isBefore = dayjs().isBefore(event?.startTime);
    if (event?.status === AppointmentStatusEnum.PENDING) return false;
    if (isBefore) return true;
    return false;
  }, [event]);

  const copyOnlineMeetUrl = async () => {
    await Clipboard.write({
      string: event?.onlineMeetUrl,
    });
  };

  const editAppointmentHandler = () => {
    if (event?.recurring) {
      setIsRecurringOpen(true);
      setEventType('edit recurring');
    } else {
      history.push(`${APPOINTMENT_DETAILS_EDIT}/${event?.id}`, {
        appointmentId: location.state.eventId,
        patientServiceId: event?.patientServiceId || '',
        patientName: event?.patientName || '',
        patientServiceName: event?.patientServiceName || '',
        price: event?.price || '',
        location: event?.location || '',
        startTime: event?.startTime || '',
        endTime: event?.endTime || '',
        event: event,
        duration,
      });
    }
  };

  const negativeHandler = useCallback(async () => {
    if (location?.state?.type === AppointmentDetailTypeEnum.RESCHEDULE) {
      if (event?.recurring) {
        setIsRecurringOpen(true);
        setEventType('cancel');
      } else {
        history.push(APPOINTMENT_CANCEL, {
          appointmentId: location?.state?.eventId,
          type: location?.state?.type,
          isRecurring: event?.recurring,
        });
      }
    }
  }, [location?.state?.type, location?.state?.eventId, event?.recurring]);

  const positiveHandler = useCallback(async () => {
    if (location?.state?.type === AppointmentDetailTypeEnum.ACCEPT) {
      try {
        if (practiceId && providerId && location?.state?.eventId) {
          dispatch(setLoading({ loading: true }));

          const response = await dispatch(
            confirmAppointmentAction({
              practiceId,
              providerId,
              appointmentId: location?.state?.eventId,
              payload: {},
            })
          );

          if (response.meta.requestStatus === 'fulfilled') {
            dispatch(setLoading({ loading: false, message: undefined }));
          }

          if (response.meta.requestStatus === 'rejected') {
            presentToast(
              `!${t('toast_messages_error_confirm_appointment')}!`,
              1000,
              'top',
              'danger'
            );
          }

          dispatch(setLoading({ loading: false, message: undefined }));
          presentToast(`${t('toast_messages_appointment_confirmed')}`, 1000, 'top', 'success');
          history.goBack();
        }
      } catch (error) {
        dispatch(setLoading({ loading: false, message: undefined }));
        presentToast(`!${t('toast_messages_error_cancel_appointment')}!`, 1000, 'top', 'danger');
      }
    }

    if (location?.state?.type === AppointmentDetailTypeEnum.RESCHEDULE) {
      if (event?.recurring) {
        setIsRecurringOpen(true);
        setEventType('reschedule');
      } else {
        setRescheduleOpen(true);
      }
    }
  }, [
    location?.state?.type,
    location?.state?.eventId,
    rescheduleOpen,
    event?.recurring,
    isRecurringOpen,
  ]);

  useIonViewDidEnter(() => {
    if (location?.state?.type && location?.state?.eventId) {
      setEventData({
        eventId: location.state.eventId,
        type: location.state.type,
      });
    }
  }, []);

  https: useEffect(() => {
    const fetchPatientContactInfo = async () => {
      if (event?.patientId) {
        try {
          const response = await patientApiInstance.get<PatientContactInfo>(
            `/practices/${practiceId}/patients/${event.patientId}`
          );
          setPatientContactInfo(response.data);
        } catch (error) {
          console.error('Error fetching patient data:', error);
        }
      }
    };

    fetchPatientContactInfo();
  }, [event?.patientId]);

  return (
    <IonPage className={CSSprefix}>
      <Header showBack showEdit={showEdit} showMenu={false} editCB={editAppointmentHandler} />
      <IonContent fullscreen={true}>
        {event && (
          <>
            <IonGrid className="ion-margin-top ion-padding-top">
              <IonRow>
                <IonCol size="auto">
                  <IonItem lines="none">
                    <div className={`${CSSprefix}-bar`} style={{ background: barColor }} />
                  </IonItem>
                </IonCol>
                <IonCol>
                  <IonItem lines="none" className="ion-no-padding">
                    <IonText className={`${CSSprefix}-service`}>
                      {event?.patientServiceName}
                    </IonText>
                  </IonItem>
                  <IonItem lines="none" className="ion-no-padding">
                    <IonText
                      className={`${CSSprefix}-details`}
                    >{`${day}, ${month} ${date}, ${startTime} - ${endTime}`}</IonText>
                  </IonItem>
                  <IonItem lines="none" className="ion-no-padding">
                    <IonText className={`${CSSprefix}-details`}>
                      {event?.patientServiceType}
                    </IonText>
                  </IonItem>
                </IonCol>
              </IonRow>
            </IonGrid>
            <IonItem lines="none" className="ion-margin-top">
              <IonIcon
                icon={personCircleOutline}
                style={{ color: 'var(--ion-trova-medium-gray)' }}
              />
              <IonText className={`${CSSprefix}-details`}>{event?.patientName}</IonText>
            </IonItem>
            <IonItem lines="none">
              <IonIcon icon={timerOutline} style={{ color: 'var(--ion-trova-medium-gray)' }} />
              <IonText className={`${CSSprefix}-details`}>
                {`${event?.location}, ${duration}`}
              </IonText>
            </IonItem>
            {event.frequency && (
              <RecurringAppointmentModal
                recurringFrequency={event.frequency}
                event={event}
                recurringCount={event.count || 0}
                startTime={event.startTime}
                practiceId={event.practiceId}
                providerId={event.providerId}
              />
            )}
            <IonItem lines="none">
              <IonIcon icon={pricetagOutline} style={{ color: 'var(--ion-trova-medium-gray)' }} />
              <IonText className={`${CSSprefix}-details`}>
                {`${currencySymbol}${event?.price?.toFixed(2)} ${currency}`}
              </IonText>
            </IonItem>
            <IonItem lines="none">
              <IonIcon icon={callOutline} style={{ color: 'var(--ion-trova-medium-gray)' }} />
              <IonText className={`${CSSprefix}-link`}>
                <a
                  style={{ textDecoration: 'none' }}
                  href={`tel:${
                    patientContactInfo?.mobileNumberPrefix
                      ? patientContactInfo.mobileNumberPrefix + ' '
                      : ''
                  }${patientContactInfo?.mobileNumber}`}
                >
                  {`${
                    patientContactInfo?.mobileNumberPrefix
                      ? patientContactInfo.mobileNumberPrefix + ' '
                      : ''
                  }${patientContactInfo?.mobileNumber}`}
                </a>
              </IonText>
            </IonItem>
            <IonItem lines="none">
              <IonIcon icon={mailOutline} style={{ color: 'var(--ion-trova-medium-gray)' }} />
              <IonText className={`${CSSprefix}-link`}>
                <a style={{ textDecoration: 'none' }} href={`mailto:${patientContactInfo?.email}`}>
                  {`${patientContactInfo?.email ? patientContactInfo?.email : ''}`}
                </a>
              </IonText>
            </IonItem>

            {isOnline && (
              <IonItem lines="none">
                <IonIcon icon={videocamOutline} style={{ color: 'var(--ion-trova-medium-gray)' }} />
                <IonText className={`${CSSprefix}-link`}>
                  <a style={{ textDecoration: 'none' }} href={event?.onlineMeetUrl} target="_blank">
                    {`${event?.onlineMeetUrl ? event?.onlineMeetUrl : ''}`}
                  </a>
                </IonText>
                <IonIcon
                  icon={copyOutline}
                  slot="end"
                  style={{ color: 'var(--ion-trova-medium-gray)' }}
                  onClick={copyOnlineMeetUrl}
                />
              </IonItem>
            )}

            {location?.state?.type === AppointmentDetailTypeEnum.RESCHEDULE && isOnline && (
              <>
                <IonButton
                  className="ion-padding"
                  expand="block"
                  href={event?.onlineMeetUrl}
                  target="_blank"
                >
                  {t('scheduling_start')}
                </IonButton>
                <div className={`${CSSprefix}-divider`} />
              </>
            )}
            {event?.status === AppointmentStatusEnum.PENDING ? null : (
              <>
                <IonButton
                  className="ion-padding"
                  expand="block"
                  fill={
                    location?.state?.type === AppointmentDetailTypeEnum.RESCHEDULE
                      ? 'outline'
                      : 'solid'
                  }
                  color="primary"
                  onClick={positiveHandler}
                >
                  {positiveLabel}
                </IonButton>
                <IonButton
                  className="ion-padding ion-no-margin"
                  expand="block"
                  fill={
                    location?.state?.type === AppointmentDetailTypeEnum.RESCHEDULE
                      ? 'clear'
                      : 'outline'
                  }
                  color="danger"
                  onClick={negativeHandler}
                >
                  {negativeLabel}
                </IonButton>
              </>
            )}
          </>
        )}
        {!event && <IonSkeletonText animated={true} style={{ width: '100%', height: '100%' }} />}
      </IonContent>
      <RescheduleAppointment
        isOpen={rescheduleOpen}
        appointment={event}
        setIsOpen={setRescheduleOpen}
      />
      <Recurring
        isOpen={isRecurringOpen}
        appointment={event}
        type={eventType}
        duration={duration}
        locationType={location?.state?.type}
        close={() => setIsRecurringOpen(false)}
      />
    </IonPage>
  );
};

export default AppointmentDetails;
