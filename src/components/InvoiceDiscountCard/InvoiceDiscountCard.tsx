import { IonCard, IonCardContent, IonCardHeader, IonInput, IonLabel } from '@ionic/react';
import React, { useMemo, useState } from 'react';

import './InvoiceDiscountCard.scss';

const CSSPrefix = 'invoice-discount-card';

interface InvoiceDiscountCardProps {
  setDiscountCB: (discount: number) => void;
  maxDiscount: number;
  currencySymbol: string;
}

const InvoiceDiscountCard: React.FC<InvoiceDiscountCardProps> = ({ maxDiscount, setDiscountCB, currencySymbol }): React.ReactElement => {
  const [discount, setDiscount] = useState<number | undefined>(0);

  const value = useMemo(() => {
    if (discount === undefined) return `${currencySymbol}0`;

    return `${currencySymbol}${discount}`
  }, [discount]);

  return (
    <IonCard className={CSSPrefix}>
      <IonCardHeader>
        <IonLabel className={`${CSSPrefix}-discount-label`}>
          Discount
          <p>
            If applicable
          </p>
        </IonLabel>
      </IonCardHeader>
      <IonCardContent>
        <IonInput
          type="text"
          className={`${CSSPrefix}-discount-input`}
          value={value}
          min={0}
          max={maxDiscount}
          onIonInput={(e) => {
            if (e?.detail?.value) {
              const value = parseInt(e.detail.value.replace(currencySymbol, ''));

              if (!Number.isNaN(value)) {
                setDiscount(value);
                setDiscountCB(value);
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