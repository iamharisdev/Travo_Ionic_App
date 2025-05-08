import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { IonButton, IonContent, IonItem, IonList, IonModal, IonText, IonRadioGroup, IonLabel , IonRadio} from "@ionic/react";

import './Recurring.scss';
import { useTranslation } from 'react-i18next';

import { IAppointment } from '../../shared/types/appointment.type';
import RescheduleAppointment from '../RescheduleAppointment/RescheduleAppointment';
import { useSelector } from 'react-redux';
import { RootState } from "../../state/store";
import CreateResheduleAppointment from '../CreateResheduleAppointment/CreateResheduleAppointment';

interface LogoutProps {
  isOpen: boolean;
  close: () => void;
  appointment:IAppointment | undefined;

}
export interface AppointmentDateTime {
  startTime: string;
  endTime: string;
}

const CSSprefix = 'recurring';

const Recurring: React.FC<LogoutProps> = ({ isOpen, close, appointment }) => {
    const {t} = useTranslation();
    const [selected, setSelected] = useState<string>('this');
    const [rescheduleOpen, setRescheduleOpen]=useState(false)
    const { provider, scheduling: { events, microsoftEvents, googleEvents, state }, calendar: { selectedDate } } = useSelector((state: RootState) => state);

  return (
    <><IonModal className={CSSprefix} id="recurring-modal" isOpen={isOpen}>
      <IonContent>
        <IonList>
          <IonItem lines="none">
            <IonText className={`${CSSprefix}-title`}>
              {t("scheduling_reschedule_appointment")}
              <p className={`${CSSprefix}-description`}>
              <IonRadioGroup value={selected} onIonChange={e => setSelected(e.detail.value)}>
                <IonItem lines="none" className={`${CSSprefix}-radio-item`}>
                  <IonRadio slot="start" value="this" className={`${CSSprefix}-radio`} />
                  <IonLabel>{t("This Event")}</IonLabel>
                </IonItem>
                <IonItem lines="none" className={`${CSSprefix}-radio-item`}>
                  <IonRadio slot="start" value="thisAndFollowing" className={`${CSSprefix}-radio`} />
                  <IonLabel>{t("This and following events")}</IonLabel>
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
              {t("Go Back")}
            </IonButton>
            <IonButton
              color="primary"
              fill="solid"
              expand="block"
              className={`${CSSprefix}-right-bottom`}
              onClick={()=>setRescheduleOpen(true)}
            >
              {t("Continue")}
            </IonButton>
          </IonItem>
        </IonList>
      </IonContent>
    </IonModal>
    <CreateResheduleAppointment
          isOpen={rescheduleOpen}
          currentDate={selectedDate}
          setIsOpen={setRescheduleOpen}
          currentStep={2}
          appointment={appointment}
        />
     </>
  );
}

export default Recurring;