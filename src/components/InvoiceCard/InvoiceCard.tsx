import { IonButton, IonCard, IonCardContent, IonCardHeader, IonIcon, IonInput, IonItem, IonItemDivider, IonText } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { LinePreview } from '../../shared/types/invoice.type';
import dayjs from 'dayjs';
import { trashOutline } from 'ionicons/icons';

import './InvoiceCard.scss';

const CSSPrefix = 'invoice-card';

interface InvoiceCardProps {
  line: LinePreview;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({ line }): React.ReactElement => {
  const [amount, setAmount] = useState<number>();

  useEffect(() => {
    if (line?.amount && !amount) {
      setAmount(line.amount);
    }
  }, [line.amount]);

  return (
    <IonCard className={CSSPrefix}>
      <IonCardHeader>
        <IonItem lines="none" className="ion-no-padding">
          <IonText>{dayjs(line.serviceDate).format('MMM D, YYYY')}</IonText>
          <IonButton className="ion-no-padding" fill="clear" expand="block" color="dark" slot="end">
            <IonIcon icon={trashOutline} />
          </IonButton>
        </IonItem>
      </IonCardHeader>
      <IonCardContent>
        <IonInput className={`${CSSPrefix}-custom-input ion-margin-bottom`} disabled={true} placeholder="Type code" value={line.code} />
        <IonInput className={`${CSSPrefix}-custom-input ion-margin-bottom`} disabled={true} placeholder="Description" value={line.description} />
        <IonInput className={`${CSSPrefix}-custom-input ion-no-margin`} disabled={true} placeholder="ICD 10 code" value={line.icd10Code} />
        <div className="divider ion-margin-vertical" />
        <div className={`${CSSPrefix}-amount-container`}>
          <IonInput
            type="number"
            className={`${CSSPrefix}-amount`}
            value={line.amount.toFixed(2)!!}
            onIonChange={(e) => setAmount((parseInt(e.detail.value?.replace('$', '')!!)))}
          />
        </div>
      </IonCardContent>
    </IonCard>
  )
}

export default InvoiceCard;