import { IonCard, IonCardContent, IonCardHeader, IonInput, IonLabel } from '@ionic/react';
import React, { useState } from 'react';

import './InvoiceDiscountCard.scss';

const CSSPrefix = 'invoice-discount-card';

interface InvoiceDiscountCardProps {
  setDiscountCB: (discount: number) => void;
  maxDiscount: number;
}

const InvoiceDiscountCard: React.FC<InvoiceDiscountCardProps> = ({ maxDiscount, setDiscountCB }): React.ReactElement => {
  const [discount, setDiscount] = useState<number>(0);

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
          type="number"
          className={`${CSSPrefix}-discount-input`}
          value={discount}
          min={0}
          max={maxDiscount}
          onIonInput={(e) => {
            if (e.detail.value) {
              console.log('value: ', e.detail.value);
              setDiscount(parseInt(e.detail.value));
              setDiscountCB(parseInt(e.detail.value));
            }
          }}
        />
      </IonCardContent>
    </IonCard>
  )
}

export default InvoiceDiscountCard;