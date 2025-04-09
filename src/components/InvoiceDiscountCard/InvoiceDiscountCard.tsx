import { IonCard, IonCardContent, IonCardHeader, IonInput, IonLabel } from '@ionic/react';
import React, { useMemo, useState } from 'react';

import './InvoiceDiscountCard.scss';
import usePresentToast from '../../hooks/usePresentToast';
import { useTranslation } from 'react-i18next';

const CSSPrefix = 'invoice-discount-card';

interface InvoiceDiscountCardProps {
  setDiscountCB: (discount: number) => void;
  maxDiscount: number;
  currencySymbol: string;
}

const InvoiceDiscountCard: React.FC<InvoiceDiscountCardProps> = ({ maxDiscount, setDiscountCB, currencySymbol }): React.ReactElement => {
  const [discount, setDiscount] = useState<number | undefined>(0);
  const [presentToast] = usePresentToast();
      const { t } = useTranslation();

  const value = useMemo(() => {
    if (discount === undefined) return `${currencySymbol}0`;

    return `${currencySymbol}${discount}`
  }, [discount, currencySymbol]);

  return (
    <IonCard className={CSSPrefix}>
      <IonCardHeader>
        <IonLabel className={`${CSSPrefix}-discount-label`}>
          {t("schedule_appointment_discount")}
          <p>
            {t("add_new_client_if_applicable")}
          </p>
        </IonLabel>
      </IonCardHeader>
      <IonCardContent>
        <IonInput
          type="text"
          className={`${CSSPrefix}-discount-input`}
          value={value}
          inputMode="numeric"
          min={0}
          max={maxDiscount}
          onIonInput={(e) => {
            if (e?.detail?.value) {
              const value = parseFloat(e.detail.value.replace(currencySymbol, ''));

              if (!Number.isNaN(value)) {
                if (value <= maxDiscount) {
                  setDiscount(value);
                  setDiscountCB(value);
                } else {
                  setDiscount(0);
                  setDiscountCB(0);
                  presentToast(
                    'Discount cannot be greater than the price of the service',
                    1000,
                    'top',
                    'danger'
                  );
                }
              } else {
                setDiscount(undefined);
                setDiscountCB(0);
              }
            }
          }}
        />
      </IonCardContent>
    </IonCard>
  )
}

export default InvoiceDiscountCard;