import React, { useMemo } from 'react';
import { IonButton, IonIcon, IonItem, IonLabel, IonText } from '@ionic/react';
import { AppointmentDateTime } from '../../RescheduleAppointment';
import dayjs from 'dayjs';
import { caretDownOutline, informationCircle } from 'ionicons/icons';

import './ReviewDetails.scss';

const CSSPrefix = 'review-details';

interface ReviewDetailsProps {
  patientName: string;
  patientServiceName: string;
  price: number;
  location: string;
  selectedDateTime?: AppointmentDateTime;
  setStep: (step: number) => void;
  rescheduleHandler: () => void;
}

const ReviewDetails: React.FC<ReviewDetailsProps> = ({
  patientName,
  patientServiceName,
  price,
  location,
  selectedDateTime,
  setStep,
  rescheduleHandler,
}) => {
  const dateTime = useMemo(() => {
    if (selectedDateTime) {
      return dayjs(selectedDateTime.startTime).format('MMMM D, hh:mm A')
    }
    return '';
  }, [selectedDateTime]);


  return (
    <div className={CSSPrefix}>
      <IonItem lines="none">
        <IonText className={`${CSSPrefix}-title`}>
          Reschedule appointment
        </IonText>
      </IonItem>
      <IonItem lines="none" className={`${CSSPrefix}-subtitle`}>
        <IonText>
          Edit appointment details
        </IonText>
      </IonItem>
      <IonItem
        lines="none"
        className={`custom-input ion-margin-vertical ion-padding-horizontal`}
      >
        <IonLabel position="stacked">Client</IonLabel>
        <IonLabel position="stacked">{patientName}</IonLabel>
      </IonItem>
      <IonItem
        lines="none"
        className={`custom-input ion-margin-vertical ion-padding-horizontal`}
      >
        <IonLabel position="stacked">Service</IonLabel>
        <IonLabel position="stacked">{patientServiceName}</IonLabel>
      </IonItem>
      <IonItem
        lines="none"
        className={`custom-input ion-margin-vertical ion-padding-horizontal`}
      >
        <IonLabel position="stacked">Adjusted price</IonLabel>
        <IonLabel position="stacked">{`$${price.toFixed(2)}`}</IonLabel>
      </IonItem>
      <IonItem
        lines="none"
        className={`custom-input ion-margin-vertical ion-padding-horizontal`}
      >
        <IonLabel position="stacked">Location</IonLabel>
        <IonLabel position="stacked">{location}</IonLabel>
      </IonItem>
      <IonItem
        lines="none"
        className={`custom-input ion-margin-vertical ion-padding-horizontal`}
        onClick={() => setStep(1)}
      >
        <IonLabel position="stacked">Date and time</IonLabel>
        <IonLabel position="stacked">{dateTime}</IonLabel>
        <IonIcon className={`${CSSPrefix}-caret-down`} icon={caretDownOutline} slot="end" />
      </IonItem>
      <IonItem
        lines="none"
        className={`custom-input ion-margin-vertical ion-padding-horizontal`}
      >
        <IonLabel position="stacked">
          Payment type
          <IonIcon className={`${CSSPrefix}-info-icon`} icon={informationCircle} />
        </IonLabel>
        <IonLabel position="stacked">At session completion</IonLabel>
      </IonItem>
      <div className={`${CSSPrefix}-button-container ion-padding-horizontal`}>
        <IonButton
          color="primary"
          expand="block"
          onClick={rescheduleHandler}
        >
          Save changes
        </IonButton>
      </div>
    </div>
  );
}

export default ReviewDetails;