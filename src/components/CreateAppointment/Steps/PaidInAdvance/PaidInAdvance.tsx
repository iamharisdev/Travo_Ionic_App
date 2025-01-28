import React, { useEffect, useMemo, useState } from 'react';
import { IonButton, IonIcon, IonItem, IonLabel, IonText } from '@ionic/react';
import { Services } from '../../../../shared/types/appointment.type';
import { addOutline } from 'ionicons/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../state/store';
import usePresentToast from '../../../../hooks/usePresentToast';
import { LinePreview, Preview } from '../../../../shared/types/invoice.type';
import InvoiceCard from '../../../InvoiceCard/InvoiceCard';
import InvoiceDiscountCard from '../../../InvoiceDiscountCard/InvoiceDiscountCard';

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
    },
    {
      code: "",
      description: "",
      amount: 65.00,
      serviceDate: "2025-02-06T09:00:00Z",
      icd10Code: "Z71.9"
    },
  ],
  subtotal: 65.00,
  total: 65.00,
  templateId: null,
  discount: 0
}

const PaidInAdvance: React.FC<PaidInAdvanceProps> = ({ selectedService }) => {
  const [preview, setPreview] = useState<Preview>();
  const [discount, setDiscunt] = useState<number>(0);
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
    setTimeout(() => setPreview(mockPreview), 1000);
  }, [mockPreview]);

  return (
    <>
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
          <IonText className={`${CSSPrefix}-price`}>${preview?.total?.toFixed(2)}</IonText>
        </IonItem>
        {preview && preview?.lines && preview.lines?.map((line: LinePreview, index: number) => (
          <InvoiceCard key={index} line={line} />
        ))}
        <IonButton fill="clear" expand="full" color="primary">
          Add new line item
          <IonIcon icon={addOutline} slot="start" />
        </IonButton>
        <InvoiceDiscountCard setDiscountCB={setDiscunt} />
      </div>
      <div className="paid-in-advance-footer">
        <div className="paid-in-advance-footer-wrapper">
          <div className="paid-in-advance-footer-container">
            <IonText className="paid-in-advance-footer-subtotal">Sub total:</IonText>
            <IonText className="paid-in-advance-footer-subtotal">${preview?.subtotal.toFixed(2)}</IonText>
          </div>
          <div className="paid-in-advance-footer-container">
            <IonText className="paid-in-advance-footer-subtotal">Discount:</IonText>
            <IonText className="paid-in-advance-footer-subtotal">${preview?.discount.toFixed(2)}</IonText>
          </div>
          <div className="paid-in-advance-footer-container">
            <IonText className="ion-margin-start paid-in-advance-footer-total">Total:</IonText>
            <IonText className="paid-in-advance-footer-total">${preview?.total.toFixed(2)}</IonText>
          </div>
        </div>
        <div className="paid-in-advance-footer-button-container">
          <IonButton fill="solid" expand="block" color="primary">
            Next
          </IonButton>
        </div>
      </div>
    </>
  );
}

export default PaidInAdvance;