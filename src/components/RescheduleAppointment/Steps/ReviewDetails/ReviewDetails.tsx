import React, { useMemo } from 'react';
import { IonButton, IonIcon, IonItem, IonLabel, IonText } from '@ionic/react';
import { AppointmentDateTime } from '../../RescheduleAppointment';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../state/store';
import { caretDownOutline, informationCircle } from 'ionicons/icons';

import './ReviewDetails.scss';
import { useTranslation } from 'react-i18next';

const CSSPrefix = 'review-details';

interface ReviewDetailsProps {
  patientName: string;
  patientServiceName: string;
  price: number;
  location: string;
  selectedDateTime?: AppointmentDateTime;
  paymentType: string;
  disableSaveChanges: boolean;
  setStep: (step: number) => void;
  rescheduleHandler: () => void;
}

const ReviewDetails: React.FC<ReviewDetailsProps> = ({
  patientName,
  patientServiceName,
  price,
  location,
  selectedDateTime,
  paymentType,
  disableSaveChanges,
  setStep,
  rescheduleHandler,
}) => {
  const {
    provider,
  } = useSelector((state: RootState) => state);
  const {t} = useTranslation();
  

  const dateTime = useMemo(() => {
    let format = 'MMMM D, hh:mm A';

    if (provider?.practice?.displayTwentyFourHourTime) {
      format = 'MMMM D, HH:mm';
    }

    if (selectedDateTime) {
      return dayjs(selectedDateTime.startTime).format(format)
    }

    return '';
  }, [selectedDateTime, provider?.practice?.displayTwentyFourHourTime]);


  return (
    <div className={CSSPrefix}>
      <IonItem lines="none">
        <IonText className={`${CSSPrefix}-title`}>
        {t("scheduling_reschedule_appointment")}
        </IonText>
      </IonItem>
      <IonItem lines="none" className={`${CSSPrefix}-subtitle`}>
        <IonText>
          {t("scheduling_edit_appointment_details")}
        </IonText>
      </IonItem>
      <IonItem
        lines="none"
        className={`custom-input ion-margin-vertical ion-padding-horizontal`}
      >
        <IonLabel position="stacked">{t("scheduling_client")}</IonLabel>
        <IonLabel position="stacked">{patientName}</IonLabel>
      </IonItem>
      <IonItem
        lines="none"
        className={`custom-input ion-margin-vertical ion-padding-horizontal`}
      >
        <IonLabel position="stacked">{t("scheduling_service")}</IonLabel>
        <IonLabel position="stacked">{patientServiceName}</IonLabel>
      </IonItem>
      <IonItem
        lines="none"
        className={`custom-input ion-margin-vertical ion-padding-horizontal`}
      >
        <IonLabel position="stacked">{t("scheduling_adjusted_price")}</IonLabel>
        <IonLabel position="stacked">{`$${price.toFixed(2)}`}</IonLabel>
      </IonItem>
      <IonItem
        lines="none"
        className={`custom-input ion-margin-vertical ion-padding-horizontal`}
      >
        <IonLabel position="stacked">{t("scheduling_location")}</IonLabel>
        <IonLabel position="stacked">{location}</IonLabel>
      </IonItem>
      <IonItem
        lines="none"
        className={`custom-input ion-margin-vertical ion-padding-horizontal`}
        onClick={() => setStep(1)}
      >
        <IonLabel position="stacked">{t("schedule_appointment_date_and_time")}</IonLabel>
        <IonLabel position="stacked">{dateTime}</IonLabel>
        <IonIcon className={`${CSSPrefix}-caret-down`} icon={caretDownOutline} slot="end" />
      </IonItem>
      <IonItem
        lines="none"
        className={`custom-input ion-margin-vertical ion-padding-horizontal`}
      >
        <IonLabel position="stacked">
          {t("scheduling_payment_type")}
          <IonIcon className={`${CSSPrefix}-info-icon`} icon={informationCircle} />
        </IonLabel>
        <IonLabel position="stacked">{paymentType}</IonLabel>
      </IonItem>
      <div className={`${CSSPrefix}-button-container ion-padding-horizontal`}>
        <IonButton
          color="primary"
          expand="block"
          disabled={disableSaveChanges}
          onClick={rescheduleHandler}
        >
          {t("scheduling_save_changes")}
        </IonButton>
      </div>
    </div>
  );
}

export default ReviewDetails;