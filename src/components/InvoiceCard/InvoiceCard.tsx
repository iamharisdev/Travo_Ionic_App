import { IonButton, IonCard, IonCardContent, IonCardHeader, IonIcon, IonInput, IonItem, IonItemDivider, IonText } from '@ionic/react';
import React from 'react';
import { LinePreview } from '../../shared/types/invoice.type';
import dayjs from 'dayjs';
import { trashOutline } from 'ionicons/icons';

import './InvoiceCard.scss';

const CSSPrefix = 'invoice-card';

interface InvoiceCardProps {
  line: LinePreview;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({ line }): React.ReactElement => {
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
        <IonInput className={`${CSSPrefix}-custom-input`} disabled={true} placeholder="Type code" value={line.code} />
        <IonInput className={`${CSSPrefix}-custom-input`} disabled={true} placeholder="Description" value={line.description} />
        <IonInput className={`${CSSPrefix}-custom-input`} disabled={true} placeholder="ICD 10 code" value={line.icd10Code} />
        <IonItemDivider />
      </IonCardContent>
    </IonCard>
  )
}

export default InvoiceCard;