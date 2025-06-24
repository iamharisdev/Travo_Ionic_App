import React, { useMemo } from 'react';
import { IonButton, IonIcon, IonItem, IonLabel, IonText } from '@ionic/react';
import { AppointmentDateTime } from '../../RescheduleAppointment';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../state/store';
import { caretDownOutline, informationCircle } from 'ionicons/icons';

import './ReviewDetails.scss';
import { useTranslation } from 'react-i18next';
import { editAppointmentAction } from '../../../../state/schedulingSlice';
import { APPOINTMENTS } from '../../../../shared/routes/routes';
import { useHistory } from 'react-router';
import { setLoading } from '../../../../state/loadingSlice';
import usePresentToast from '../../../../hooks/usePresentToast';

const CSSPrefix = 'review-details';

interface ReviewDetailsProps {
  patientName: string;
  patientServiceName: string;
  price: number;
  location: string;
  selectedDateTime?: AppointmentDateTime;
  paymentType: string;
  disableSaveChanges: boolean;
  event: any;
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
  event,
  setStep,
  rescheduleHandler,
}) => {
  const { provider } = useSelector((state: RootState) => state);
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch<AppDispatch>();
  const [presentToast] = usePresentToast();

  const date = {
    startTime: selectedDateTime?.startTime,
    endTime: selectedDateTime?.endTime,
  };

  if (date.startTime) {
    date.startTime = new Date(date.startTime).toISOString();
  }
  if (date.endTime) {
    date.endTime = new Date(date.endTime).toISOString();
  }

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

  const editAppointment = async () => {
    const response = await dispatch(
      editAppointmentAction({
        practiceId: event?.practiceId,
        providerId: event?.providerId,
        appointmentId: event?.id,
        payload: {
          patientName: event?.patientName,
          patientNumber: event?.patientNumber,
          patientEmail: event?.patientEmail,
          location: event?.location,
          patientServiceId: event?.patientServiceId,
          startTime: date.startTime,
          endTime: date.endTime,
          frequency: null,
          count: null,
          recurring: false,
        },
      })
    );
    if (response.type == 'scheduling/editAppointment/fulfilled') {
      dispatch(setLoading({ loading: false, message: '' }));

      setStep(0);
      history.push(APPOINTMENTS);
    } else {
      dispatch(setLoading({ loading: false, message: '' }));
    }
  };

  return (
    <div className={CSSPrefix}>
      <p className="title"> {t('scheduling_reschedule_appointment')}</p>

      <div className={`${CSSPrefix}-subtitle`}>
        <IonText> {t('scheduling_edit_appointment_details')}</IonText>
      </div>

      <div className="custom-input-container">
        <label className="custom-label">{t('scheduling_client')}</label>
        <span className="custom-value">{patientName}</span>
      </div>

      <div className="custom-input-container">
        <label className="custom-label">{t('scheduling_service')}</label>
        <span className="custom-value">{patientServiceName}</span>
      </div>

      <div className="custom-input-container">
        <label className="custom-label">{t('scheduling_adjusted_price')}</label>
        <span className="custom-value">{`$${price.toFixed(2)}`}</span>
      </div>

      <div className="custom-input-container">
        <label className="custom-label">{t('scheduling_location')}</label>
        <span className="custom-value">{location}</span>
      </div>

      <div className="custom-input-container" onClick={() => setStep(1)}>
        <label className="custom-label">{t('schedule_appointment_date_and_time')}</label>
        <div className="custom-value-wrapper">
          <span className="custom-value">{dateTime}</span>
          <IonIcon className={`${CSSPrefix}-caret-down`} icon={caretDownOutline} slot="end" />
        </div>
      </div>

      <div className="custom-input-container">
        <div className="custom-value-wrapper2">
          <label className="custom-label"> {t('scheduling_payment_type')}</label>
          <IonIcon className={`${CSSPrefix}-info-icon`} icon={informationCircle} />
        </div>
        <span className="custom-value">{paymentType}</span>
      </div>

      <div className={`${CSSPrefix}-button-container ion-padding-horizontal`}>
        <IonButton
          color="primary"
          expand="block"
          disabled={disableSaveChanges}
          onClick={rescheduleHandler}
          // onClick={() => {
          //   // if (event?.recurring) {
          //     rescheduleHandler();
          //   } else {
          //     presentToast(
          //      "Under dev mode",
          //       1000,
          //       'middle',
          //       'danger'
          //     );
          //     // dispatch(setLoading({ loading: true, message: '' }));
          //     // editAppointment();
          //   }
          // }}
        >
          {t('scheduling_save_changes')}
        </IonButton>
      </div>
    </div>
  );
};

export default ReviewDetails;
