import { IonCard, IonCardContent, IonCardHeader, IonInput, IonLabel } from '@ionic/react';
import React, { useEffect, useState } from 'react';

import './InvoiceDiscountCard.scss';

const CSSPrefix = 'invoice-discount-card';

interface InvoiceDiscountCardProps {
  setDiscountCB: (discount: number) => void;
}

const InvoiceDiscountCard: React.FC<InvoiceDiscountCardProps> = ({ setDiscountCB }): React.ReactElement => {
  const [discount, setDiscunt] = useState<number>(0);

  useEffect(() => setDiscountCB(discount), [discount])
  return (
    <IonCard className={CSSPrefix}>
      <IonCardHeader>
        <IonLabel>
          Discount
          <p>
            If applicable
          </p>
        </IonLabel>
      </IonCardHeader>
      <IonCardContent>
        <div className={`${CSSPrefix}-discount-container`}>
          <IonInput type="number" className={`${CSSPrefix}-discount-input`} value={`$${discount.toFixed(2)}`} onIonChange={(e) => setDiscunt((parseInt(e.detail.value?.replace('$', '')!!)))} />
        </div>
      </IonCardContent>
    </IonCard>
  )
}

export default InvoiceDiscountCard;