import React, { useMemo, useState } from 'react';
import {
  IonItem,
  IonIcon,
  IonText,
  IonModal,
  IonButton,
  IonContent,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonLabel,
  IonCol,
  IonGrid,
  IonRow,
} from '@ionic/react';
import {
  returnDownForwardOutline,
  returnUpBackOutline,
  pencilOutline,
  returnDownBackOutline,
  returnUpForwardOutline,
  caretUpOutline,
  caretDownOutline,
} from 'ionicons/icons';

import { IonList } from '@ionic/react';

import { useTranslation } from 'react-i18next';

import './RecurringAppointmentModal.scss';
import axios from 'axios';
import dayjs from 'dayjs';
import { createAppointmentAction, getEventsAction } from '../../../../state/schedulingSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../state/store';
import { setLoading } from '../../../../state/loadingSlice';
import usePresentToast from '../../../../hooks/usePresentToast';

const CSSprefix = 'edit-recurring';
interface RecurringAppointmentModalInterface {
  recurringFrequency?: string;
  recurringCount?: number;
  startTime?: any;
  providerId?: string;
  practiceId?: string;
  event?: any;
}
interface AppointmentEvent {
  id: string;
  status: string;
  [key: string]: any;
  events: AppointmentEvent[];
}

const RecurringAppointmentModal: React.FC<RecurringAppointmentModalInterface> = ({
  recurringFrequency,
  recurringCount,
  startTime,
  providerId,
  practiceId,
  event,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [repeat, setRepeat] = useState('');
  const [appointmentStatus, setAppointmentStatus] = useState<AppointmentEvent[]>([]);
  const { t } = useTranslation();
  const [repeatOption, setRepeatOption] = useState<string>(recurringFrequency || '');
  const [endsAfter, setEndsAfter] = useState<number>(recurringCount || 0);
  const dispatch = useDispatch<AppDispatch>();
  const [presentToast] = usePresentToast();

  const handleEndsAfterInput = (e: any) => {
    setEndsAfter(e.target.value);
  };
  const selectedDayName = useMemo(() => {
    if (startTime) {
      return dayjs(startTime).format('dddd');
    }
    return '';
  }, [startTime]);

  const handleOpenModal = async () => {
    dispatch(setLoading({ loading: true, message: `Searching Recurrings` }));
    setShowModal(true);

    const response = (await dispatch(
      getEventsAction({
        practiceId: practiceId || '',
        providerId: providerId || '',
        start: event?.startTime,
        end: event?.endTime,
        pageNumber: 0,
        pageSize: 999,
      })
    )) as { payload: AppointmentEvent };

    dispatch(setLoading({ loading: false, message: `` }));
    setAppointmentStatus(response?.payload?.events);
  };
  const appointmentConfirmedStatus = appointmentStatus.filter(
    event => event?.status === 'Confirmed'
  );
  const appointmentStatusId = appointmentConfirmedStatus[0]?.id;

  // const selectedDayName = "Tuesday";
  const handleSaveRecurring = async () => {
    const payload = {
      practiceId: practiceId || '',
      providerId: providerId || '',
      payload: {
        appointmentNumber: event?.appointmentNumber,
        bookingSource: event?.bookingSource,
        futureAppointments: event?.futureAppointments,
        id: appointmentStatusId,
        calendar: true,
        overlaps: true,
        clientType: event?.clientType,
        color: event?.color || 'teal',
        count: endsAfter,
        endTime: event?.endTime,
        frequency: repeatOption,
        location: event?.location || 'Online',
        patientArchived: event?.patientArchived,
        patientEmail: event?.patientEmail,
        patientId: event?.patientId,
        patientName: event?.patientName,
        patientNumber: event?.patientNumber,
        patientServiceId: event?.patientServiceId,
        patientServiceName: event?.patientServiceName,
        patientServiceType: event?.patientServiceType,
        price: event?.price,
        providerName: event?.providerName,
        recurring: true,
        startTime: event?.startTime,
        status: event?.status,
        timeZone: event?.timeZone,

        patient: {
          id: event?.patientId,
          firstName: event?.patientName?.split(' ')[0] || '',
          lastName: event?.patientName?.split(' ')[1] || '',
          email: event?.patientEmail,
        },
        service: {
          id: event?.patientServiceId,
          name: event?.patientServiceName,
        },
        recurringUpdate: true,
      },
    };

    try {
      dispatch(setLoading({ loading: true, message: `Updating Recurring` }));

      const response: any = await dispatch(createAppointmentAction(payload));
      setRepeat(repeatOption);
      setShowModal(false);

      dispatch(setLoading({ loading: false, message: `` }));
      presentToast(`${t('Updated succefully')}`, 1000, 'top', 'success');
      await dispatch(
        getEventsAction({
          practiceId: practiceId || '',
          providerId: providerId || '',
          start: event?.startTime,
          end: event?.endTime,
          pageNumber: 0,
          pageSize: 999,
        })
      );
    } catch (error) {
      console.error('error : ', error);
      dispatch(setLoading({ loading: false, message: `` }));
    }
  };

  return (
    <>
      {/* Repeats Row */}
      <IonItem lines="none" style={{ alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '3px' }}>
          <IonIcon
            icon={returnDownBackOutline}
            style={{
              color: 'var(--ion-trova-medium-gray)',
              fontSize: '18px',
              marginLeft: '5px',
              marginTop: '7px',
            }}
          />
          <IonIcon
            icon={returnUpForwardOutline}
            style={{
              color: 'var(--ion-trova-medium-gray)',
              fontSize: '18px',
              marginLeft: '-32px',
              marginBottom: '7px',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <IonText style={{ color: 'var(--ion-trova-medium-gray)', fontWeight: 500 }}>
            Repeats {repeat ? repeat : recurringFrequency}
          </IonText>
          <IonIcon
            icon={pencilOutline}
            onClick={handleOpenModal}
            style={{ color: 'var(--ion-color-primary)', fontSize: '24px' }}
          />
        </div>
      </IonItem>

      {/* Modal */}
      <IonModal className={CSSprefix} id="edit-recurring-modal" isOpen={showModal}>
        <IonContent>
          <IonList>
            <IonItem lines="none">
              <IonText className={`${CSSprefix}-title`}>
                Edit recurring appointment
                <p className={`${CSSprefix}-description`}>
                  <IonItem
                    lines="none"
                    className={`${CSSprefix}-input ${CSSprefix}-select-input-field`}
                  >
                    <IonLabel position="stacked" className={`${CSSprefix}-lables`}>
                      {t('recurring_appointment_repeats_on')}
                    </IonLabel>
                    <IonSelect
                      className="custom-select custom-label"
                      placeholder={t('recurring_appointment_repeats_select')}
                      interface="action-sheet"
                      cancelText={t('log_out_cancel')}
                      value={repeatOption}
                      onIonChange={e => setRepeatOption(e.detail.value)}
                    >
                      <IonSelectOption value="Daily">
                        {t('recurring_appointment_repeats_daily')}
                      </IonSelectOption>
                      <IonSelectOption value="Weekly">
                        {t('recurring_appointment_weekly_on_day')} {selectedDayName}
                      </IonSelectOption>
                      <IonSelectOption value="Biweekly">
                        {t('recurring_appointment_every_two_weeks_on_day')} {selectedDayName}
                      </IonSelectOption>
                      <IonSelectOption value="Monthly">
                        {t('recurring_appointment_montly_on_the_third_day')} {selectedDayName}
                      </IonSelectOption>
                    </IonSelect>
                  </IonItem>
                  <IonItem lines="none" className={`${CSSprefix}-input`}>
                    <IonLabel position="stacked" className={`${CSSprefix}-lables`}>
                      {t('Ends after (occurrences number)')}
                    </IonLabel>
                    <IonInput
                      className="custom-input custom-label"
                      type="number"
                      value={endsAfter}
                      placeholder="0"
                      onIonInput={handleEndsAfterInput}
                    />
                    <IonIcon
                      className="caretUpOutline"
                      onClick={() => setEndsAfter(prev => Number(prev || 0) + 1)}
                      icon={caretUpOutline}
                    />
                    <IonIcon
                      className="caretDownOutline"
                      onClick={() => setEndsAfter(prev => Math.max(0, Number(prev || 0) - 1))}
                      icon={caretDownOutline}
                    />
                  </IonItem>
                </p>
              </IonText>
            </IonItem>
            <IonItem className={`${CSSprefix}-buttons`} lines="none">
              <IonButton
                color="primary"
                fill="outline"
                expand="block"
                className={`${CSSprefix}-left-button`}
                onClick={() => setShowModal(false)}
              >
                {t('Cancel')}
              </IonButton>
              <IonButton
                color="primary"
                fill="solid"
                expand="block"
                className={`${CSSprefix}-right-button`}
                onClick={handleSaveRecurring}
              >
                {t('Save')}
              </IonButton>
            </IonItem>
          </IonList>
        </IonContent>
      </IonModal>
    </>
  );
};

export default RecurringAppointmentModal;
