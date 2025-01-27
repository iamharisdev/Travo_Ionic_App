import React, { useEffect, useMemo, useRef, useState } from 'react';
import { IonButton, IonIcon, IonItem, IonLabel, IonPopover, IonText } from '@ionic/react';
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
import { LinePreview, Preview } from '../../../../shared/types/invoice.type';
import InvoiceCard from '../../../InvoiceCard/InvoiceCard';

import './PaidInAdvance.scss';

const CSSPrefix = 'paid-in-advance';

interface PaidInAdvanceProps {
  selectedService?: Services;
}

const mockPreview: Preview = {
  lines: [
    {
      code: "",
      description: "",
      amount: 65.00,
      serviceDate: "2025-02-06T09:00:00Z",
      icd10Code: "Z71.9"
    }
  ],
  subtotal: 65.00,
  total: 65.00,
  templateId: null,
  discount: 0
}

const PaidInAdvance: React.FC<PaidInAdvanceProps> = ({ selectedService }) => {
  const [preview, setPreview] = useState<Preview>();
  const dispatch = useDispatch<AppDispatch>();
  const [presentToast] = usePresentToast();
  const {
    provider,
    calendar: { selectedDate, selectedDates }
  } = useSelector((state: RootState) => state);

  const duration = useMemo(() => {
    let parsedDuration = '';

    if (selectedService?.duration) {
      const minutes = selectedService.duration;
      const hours = Math.floor(minutes / 60);

      if (minutes > 60) {
        parsedDuration = `${hours} hours`;
      }

      if (minutes === 60) {
        parsedDuration = `${hours} hour`;
      }

      if (minutes < 60) {
        parsedDuration = `${minutes} min`;
      }
    }

    return parsedDuration;
  }, [selectedService?.duration]);

  useEffect(() => {
    setTimeout(() => setPreview(mockPreview), 3000);
  }, []);

  return (
    <div className={CSSPrefix}>
      <IonItem lines="none">
        <IonText className={`${CSSPrefix}-title`}>
          Schedule appointment
        </IonText>
      </IonItem>
      <IonItem lines="none" className={`${CSSPrefix}-subtitle`}>
        <IonText>
          Invoice review
        </IonText>
      </IonItem>
      <IonItem lines="none">
        <IonLabel className={`${CSSPrefix}-service`}>
          {selectedService?.name}
          <p>{selectedService?.location}, {duration}</p>
        </IonLabel>
        <IonText className={`${CSSPrefix}-price`}>${selectedService?.price?.toFixed(2)}</IonText>
      </IonItem>
      {preview && preview?.lines && preview.lines?.map((line: LinePreview) => (
        <InvoiceCard line={line} />
      ))}
    </div>
  );
}

export default PaidInAdvance;