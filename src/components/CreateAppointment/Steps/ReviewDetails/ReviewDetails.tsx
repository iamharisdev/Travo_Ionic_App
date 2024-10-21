import React, { useMemo } from 'react';
import { IonButton, IonIcon, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonText } from '@ionic/react';
import { Patient } from '../../../../state/patientSlice';
import { Services } from '../../../../shared/types/appointment.type';
import { AppointmentDateTime } from '../../CreateAppointment';
import dayjs from 'dayjs';
import { caretDownOutline, caretUpOutline, informationCircle } from 'ionicons/icons';

import './ReviewDetails.scss';

const CSSPrefix = 'review-details';

interface ReviewDetailsProps {
  selectedClient?: Patient;
  selectedService?: Services;
  selectedDateTime?: AppointmentDateTime;
}

const ReviewDetails: React.FC<ReviewDetailsProps> = ({ selectedClient, selectedService, selectedDateTime }) => {
  const dateTime = useMemo(() => {
    if (selectedDateTime) {
      return dayjs(selectedDateTime.startTime).format('MMMM D, HH:mm A')
    }
    return '';
  }, [selectedDateTime]);

  return (
    <div className={CSSPrefix}>
      <IonItem lines="none">
        <IonText className={`${CSSPrefix}-title`}>
          Schedule appointment
        </IonText>
      </IonItem>
      <IonItem lines="none" className={`${CSSPrefix}-subtitle`}>
        <IonText>
          Review appointment details
        </IonText>
      </IonItem>
      <IonItem
        lines="none"
        className={`custom-input ion-margin-vertical ion-padding-horizontal`}
      >
        <IonLabel position="stacked" class="custom-input">Client</IonLabel>
        <IonInput
          disabled
          name="client"
          class="custom"
          type="text"
          placeholder="client"
          value={`${selectedClient?.firstName} ${selectedClient?.lastName}`}
        // onIonInput={(e) => setClient(e.detail.value)}
        />
      </IonItem>
      <IonItem
        lines="none"
        className={`custom-input ion-margin-vertical ion-padding-horizontal`}
      >
        <IonLabel position="stacked" class="custom-input">Service</IonLabel>
        <IonSelect
          name="service"
          toggleIcon={caretDownOutline}
          expandedIcon={caretUpOutline}
          selectedText={selectedService?.name}
          value={selectedService?.name}
        // onIonChange={(e) => formik.setFieldValue('patientServiceName', e.detail.value)}
        >
          <IonSelectOption value={'service 1'}>{'service 1'}</IonSelectOption>
        </IonSelect>
      </IonItem>
      <IonItem
        lines="none"
        className={`custom-input ion-margin-vertical ion-padding-horizontal`}
      >
        <IonLabel position="stacked" class="custom-input">Date and time</IonLabel>
        <IonSelect
          name="service"
          toggleIcon={caretDownOutline}
          expandedIcon={caretUpOutline}
          selectedText={dateTime}
          value={dateTime}
        // onIonChange={(e) => formik.setFieldValue('patientServiceName', e.detail.value)}
        >
          <IonSelectOption value={'date 1'}>{'date 1'}</IonSelectOption>
        </IonSelect>
      </IonItem>
      <IonItem
        lines="none"
        className={`custom-input ion-margin-vertical ion-padding-horizontal`}
      >
        <IonLabel position="stacked" class="custom-input">
          Payment type
          <IonIcon className={`${CSSPrefix}-info-icon`} icon={informationCircle} />
        </IonLabel>
        <IonInput
          disabled
          name="paymentType"
          class="custom"
          type="text"
          placeholder="date time"
          value="At session completion"
        // onIonInput={(e) => setClient(e.detail.value)}
        />
      </IonItem>
      <div className={`${CSSPrefix}-button-container ion-padding-horizontal`}>
        <IonButton
          color="primary"
          expand="block"
          onClick={async () => { }}
        >
          Schedule appointment
        </IonButton>
      </div>
    </div>
  );
}

export default ReviewDetails;