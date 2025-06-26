import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  IonButton,
  IonContent,
  IonItem,
  IonList,
  IonModal,
  IonText,
  IonRadioGroup,
  IonLabel,
  IonRadio,
} from '@ionic/react';

import './Recurring.scss';
import { useTranslation } from 'react-i18next';

import { IAppointment } from '../../shared/types/appointment.type';
import RescheduleAppointment from '../RescheduleAppointment/RescheduleAppointment';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import CreateResheduleAppointment from '../CreateResheduleAppointment/CreateResheduleAppointment';
import { useHistory } from 'react-router';
import { APPOINTMENT_CANCEL, APPOINTMENT_DETAILS_EDIT } from '../../shared/routes/routes';

interface LogoutProps {
  isOpen: boolean;
  type: string;
  duration: any;
  locationType: any;
  close: () => void;
  appointment: IAppointment | undefined;
}
export interface AppointmentDateTime {
  startTime: string;
  endTime: string;
}

const CSSprefix = 'recurring';

const Recurring: React.FC<LogoutProps> = ({
  isOpen,
  type,
  locationType,
  close,
  appointment,
  duration,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [selected, setSelected] = useState<string>('this');

  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const {
    provider,
    scheduling: { events, microsoftEvents, googleEvents, state },
    calendar: { selectedDate },
  } = useSelector((state: RootState) => state);

  return (
    <>
      <IonModal className={CSSprefix} id="recurring-modal" isOpen={isOpen}>
        <IonContent>
          <IonList>
            <IonItem lines="none">
              <IonText className={`${CSSprefix}-title`}>
                {type == 'cancel'
                  ? t('cancel_appointment')
                  : type == 'edit recurring'
                  ? t('scheduling_edit_appointment')
                  : t('scheduling_reschedule_appointment')}
                <p className={`${CSSprefix}-description`}>
                  <IonRadioGroup value={selected} onIonChange={e => setSelected(e.detail.value)}>
                    <IonItem lines="none" className={`${CSSprefix}-radio-item`}>
                      <IonRadio
                        slot="start"
                        value="this"
                        className={`${CSSprefix}-radio`}
                        mode="md"
                      />
                      <IonLabel>{t('recurring_appointment_this_event')}</IonLabel>
                    </IonItem>
                    <IonItem lines="none" className={`${CSSprefix}-radio-item`}>
                      <IonRadio
                        slot="start"
                        value="thisAndFollowing"
                        className={`${CSSprefix}-radio`}
                        mode="md"
                      />
                      <IonLabel>{t('recurring_appointment_this_and_following_events')}</IonLabel>
                    </IonItem>
                  </IonRadioGroup>
                </p>
              </IonText>
            </IonItem>
            <IonItem className={`${CSSprefix}-buttons`} lines="none">
              <IonButton
                color="primary"
                fill="outline"
                expand="block"
                className={`${CSSprefix}-left-bottom`}
                onClick={close}
              >
                {t('Go Back')}
              </IonButton>
              <IonButton
                color={type === 'cancel' ? 'danger' : 'primary'}
                fill="solid"
                expand="block"
                className={`${CSSprefix}-right-bottom`}
                onClick={() => {
                  if (type === 'cancel') {
                    close();
                    history.push(APPOINTMENT_CANCEL, {
                      appointmentId: appointment?.id,
                      type: locationType,
                      selected: selected,
                      isRecurring: appointment?.recurring,
                    });
                  } else if (type === 'edit recurring') {
                    history.push(`${APPOINTMENT_DETAILS_EDIT}/${appointment?.id}`, {
                      appointmentId: appointment?.id,
                      patientServiceId: appointment?.patientServiceId || '',
                      patientName: appointment?.patientName || '',
                      patientServiceName: appointment?.patientServiceName || '',
                      price: appointment?.price || '',
                      location: appointment?.location || '',
                      startTime: appointment?.startTime || '',
                      endTime: appointment?.endTime || '',
                      event: appointment,
                      selected: selected,
                      duration,
                    });
                    close();
                  } else {
                    setRescheduleOpen(true);
                    close();
                  }
                }}
              >
                {type === 'cancel' ? t('schedule_appointment_next') : t('Continue')}
              </IonButton>
            </IonItem>
          </IonList>
        </IonContent>
      </IonModal>
      <CreateResheduleAppointment
        isOpen={rescheduleOpen}
        currentDate={selectedDate}
        selected={selected}
        setIsOpen={setRescheduleOpen}
        currentStep={2}
        appointment={appointment}
      />
    </>
  );
};

export default Recurring;
