import React, { useMemo, useRef, useState } from 'react';
import { IonButton, IonIcon, IonItem, IonLabel, IonPopover, IonText,   IonSelect,
  IonSelectOption,
  IonInput,
  IonGrid,
  IonRow,
  IonCol } from '@ionic/react';
import { Patient } from '../../../../state/patientSlice';
import { Services } from '../../../../shared/types/appointment.type';
import { AppointmentDateTime } from '../../CreateAppointment';
import dayjs from 'dayjs';
import { caretDownOutline, informationCircle } from 'ionicons/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../state/store';
import { setLoading } from '../../../../state/loadingSlice';
import { createAppointmentAction, getEventsAction } from '../../../../state/schedulingSlice';
import usePresentToast from '../../../../hooks/usePresentToast';
import { useHistory } from 'react-router';
import { APPOINTMENTS } from '../../../../shared/routes/routes';
import { setDate } from '../../../../state/calendarSlice';

import { radioButtonOn, radioButtonOff } from 'ionicons/icons';
import './ReviewDetails.scss';
import { useTranslation } from 'react-i18next';

const CSSPrefix = 'review-details';

interface ReviewDetailsProps {
  selectedClient?: Patient;
  selectedService?: Services;
  selectedDateTime?: AppointmentDateTime;
  invoiceDataId?: string;
  closeHandler: (close?: boolean) => void;
  goToStep?: (step: number) => void;
}

const ReviewDetails: React.FC<ReviewDetailsProps> = ({
  selectedClient,
  selectedService,
  selectedDateTime,
  invoiceDataId,
  closeHandler,
  goToStep,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [presentToast] = usePresentToast();
  const {
    provider,
  } = useSelector((state: RootState) => state);
  const history = useHistory();
  const popover = useRef<HTMLIonPopoverElement>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
    const { t } = useTranslation();
  const [isChecked, setIsChecked] = useState(false);
  const [repeatOption, setRepeatOption] = useState<string>();
  const [endsAfter, setEndsAfter] = useState<number>();
  const handleClick = () => {
    setIsChecked(!isChecked);
  };

  const openPopover = (e: any) => {
    popover.current!.event = e;
    setPopoverOpen(true);
  };

  const dateTime = useMemo(() => {
    let format = 'MMMM D, hh:mm A';

    if (provider?.practice?.displayTwentyFourHourTime) {
      format = 'MMMM D, HH:mm';
    }

    if (selectedDateTime) {
      return dayjs(selectedDateTime.startTime).format(format);
    }

    return '';
  }, [selectedDateTime, provider?.practice?.displayTwentyFourHourTime]);

  const selectedDayName = useMemo(() => {
    if (selectedDateTime?.startTime) {
      return dayjs(selectedDateTime.startTime).format('dddd');
    }
    return '';
  }, [selectedDateTime?.startTime]);

  const paymentType = useMemo(() => {
    if (selectedService?.paymentType === 'At Completion') {
      return `${t("scheduling_at_session_completion")}`;
    }

    return `${t("schedule_appointment_in_advance_of_session")}`;
  }, [selectedService?.paymentType]);

  const createAppointmentsHandler = async () => {
    let redirect = false;

    try {
      dispatch(setLoading({ loading: true, message: `${t("schedule_appointment_creating_appointment")}` }));

      const [providerPractice] = provider.providerPractices;
      if (
        providerPractice &&
        selectedService?.id &&
        selectedClient?.id &&
        selectedClient?.email &&
        selectedClient?.firstName &&
        selectedClient?.lastName &&
        selectedClient?.patientNumber &&
        selectedDateTime?.startTime &&
        selectedDateTime?.endTime
      ) {
        const startTime = dayjs(selectedDateTime.startTime);
        const endTimeByDuration = startTime.add(selectedService?.duration || 0, 'minutes');
        const payload = {
          practiceId: providerPractice.practiceId,
          providerId: providerPractice.providerId,
          payload:isChecked && endsAfter && repeatOption ?  {
            patientServiceId: selectedService.id,
            patientId: selectedClient.id,
            patientEmail: selectedClient.email,
            patientName: `${selectedClient.firstName} ${selectedClient.lastName}`,
            patientNumber: selectedClient.patientNumber,
            startTime: startTime.toISOString(),
            endTime: endTimeByDuration.toISOString(),
            invoiceDataId,
            count:endsAfter,
            frequency:repeatOption,
            recurring:isChecked
          }:{
            patientServiceId: selectedService.id,
            patientId: selectedClient.id,
            patientEmail: selectedClient.email,
            patientName: `${selectedClient.firstName} ${selectedClient.lastName}`,
            patientNumber: selectedClient.patientNumber,
            startTime: startTime.toISOString(),
            endTime: endTimeByDuration.toISOString(),
            invoiceDataId,
            recurring: false
          }
        };

        const response: any = await dispatch(createAppointmentAction(payload));

        const responsePayload=response?.payload?.id ? response?.payload?.id : response?.payload

        if (responsePayload && response.type === 'scheduling/createAppointment/fulfilled') {
          await dispatch(getEventsAction({
            practiceId: providerPractice.practiceId,
            providerId: providerPractice.providerId,
            start: dayjs(selectedDateTime?.startTime).startOf('day').toISOString(),
            end: dayjs(selectedDateTime?.startTime).endOf('day').toISOString(),
            pageNumber: 0,
            pageSize: 999,
          }));

          dispatch(setDate(dayjs(selectedDateTime?.startTime).startOf('day').toISOString()));
          dispatch(setLoading({ loading: false, message: '' }));
          redirect = true;
          closeHandler(true);
        }

        if (!response.payload) {
          closeHandler(true);
          presentToast(
            `${t("toast_messages_error_create_appointment")}`,
            1000,
            'middle',
            'danger'
          );
          dispatch(setLoading({ loading: false, message: '' }));
        }
      }
    } catch (error) {
      dispatch(setLoading({ loading: false, message: '' }));
      closeHandler();
      presentToast(
        `${t("toast_messages_error_create_appointment")}`,
        1000,
        'top',
        'danger'
      );
      console.error(`${t("toast_messages_error_create_appointment")} :`, error);
    } finally {
      if (redirect) {
        history.push(APPOINTMENTS);
      }
    }
  }

  return (
    <div className={CSSPrefix}>
      <IonItem lines="none">
        <IonText className={`${CSSPrefix}-title`}>
          {t("schedule_appointment")}
        </IonText>
      </IonItem>
      <IonItem lines="none" className={`${CSSPrefix}-subtitle`}>
        <IonText>
          {t("schedule_appointment_review_appointment_details")}
        </IonText>
      </IonItem>
      <IonItem
        lines="none"
        className={`custom-input ion-margin-vertical ion-padding-horizontal`}
        onClick={() => goToStep && goToStep(0)}
      >
        <IonLabel position="stacked">
          {t("scheduling_client")}
        </IonLabel>
        <IonIcon className={`${CSSPrefix}-at-the-very-right`} icon={caretDownOutline} />
        <IonLabel position="stacked">{`${selectedClient?.firstName} ${selectedClient?.lastName}`}</IonLabel>
      </IonItem>
      <IonItem
        lines="none"
        className={`custom-input ion-margin-vertical ion-padding-horizontal`}
        onClick={() => goToStep && goToStep(1)}
      >
        <IonLabel position="stacked">{t("scheduling_service")}</IonLabel>
        <IonIcon className={`${CSSPrefix}-at-the-very-right`} icon={caretDownOutline} />
        <IonLabel position="stacked">{selectedService?.name}</IonLabel>
      </IonItem>
      <IonItem
        lines="none"
        className={`custom-input ion-margin-vertical ion-padding-horizontal`}
        onClick={() => goToStep && goToStep(2)}
      >
        <IonLabel position="stacked">{t("schedule_appointment_date_and_time")}</IonLabel>
        <IonIcon className={`${CSSPrefix}-at-the-very-right`} icon={caretDownOutline} />
        <IonLabel position="stacked">{dateTime}</IonLabel>
      </IonItem>

      <IonItem lines="none" detail={false} className="custom-radio-item" button onClick={handleClick}>
      <IonIcon
        slot="start"
        icon={isChecked ? radioButtonOn : radioButtonOff}
        className="black-radio-icon"
      />
      <IonLabel class='custom-radio-text'>Recurring appointment</IonLabel>
    </IonItem>

    {isChecked && (
        <IonGrid>
        <IonRow class={`${CSSPrefix}-recurring-appointment-row`} >
          <IonCol size="5.9" className="custom-box" >
              <IonLabel className="custom-label" position="stacked">Repeats on</IonLabel>
              <IonSelect
                className="custom-select"
                placeholder="Select"
                interface="action-sheet"
                value={repeatOption}
                onIonChange={(e) => setRepeatOption(e.detail.value)}
              >
                <IonSelectOption value="Daily">Daily</IonSelectOption>
                <IonSelectOption value="Weekly">Weekly on {selectedDayName}</IonSelectOption>
                <IonSelectOption value="Biweekly">Every two weeks on {selectedDayName}</IonSelectOption>
                <IonSelectOption value="Monthly">Monthly on the third {selectedDayName}</IonSelectOption>
              </IonSelect>
          </IonCol>

          <IonCol size="5.9">
            <IonItem className="custom-box" lines="none" detail={false}>
              <IonLabel className="custom-label" position="stacked">Ends after</IonLabel>
              <IonInput
                className="custom-input"
                type="number"
                value={endsAfter}
                placeholder='0'
                onIonInput={(e: any) => setEndsAfter(e.target.value)}
              />
              <IonText className="suffix-label">occurrences</IonText>
            </IonItem>
          </IonCol>
        </IonRow>
      </IonGrid>
      )}

      <IonItem
        lines="none"
        className={`custom-input ion-margin-vertical ion-padding-horizontal`}
      >
        <IonLabel position="stacked">
        {t("scheduling_payment_type")}
          <IonIcon
            className={`${CSSPrefix}-info-icon`}
            icon={informationCircle}
            onClick={openPopover}
          />
        </IonLabel>
        <IonLabel position="stacked">{paymentType}</IonLabel>
      </IonItem>
      <IonButton
        className={`${CSSPrefix}-schedule-button ion-padding`}
        color="primary"
        expand="block"
        onClick={async () => createAppointmentsHandler()}
      >
        {t("schedule_appointment")}
      </IonButton>
      <IonPopover
        className="info-popover"
        ref={popover}
        isOpen={popoverOpen}
        onDidDismiss={() => setPopoverOpen(false)}
        triggerAction="hover"
      >
        <div className="info-popover-content">
          <IonIcon
            className={`${CSSPrefix}-info-icon`}
            icon={informationCircle}
            onClick={openPopover}
          />
          {t("toast_messages_payment_type_message")}
        </div>
      </IonPopover>
    </div>
  );
}

export default ReviewDetails;