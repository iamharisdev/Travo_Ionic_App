import { IonButton, IonCard, IonCardContent, IonCardHeader, IonIcon, IonInput, IonItem, IonText } from '@ionic/react';
import React from 'react';
import { LinePreview } from '../../shared/types/invoice.type';
import dayjs from 'dayjs';
import { trashOutline } from 'ionicons/icons';

import './InvoiceCard.scss';

const CSSPrefix = 'invoice-card';

interface InvoiceCardProps {
  name: string;
  line: LinePreview;
  currencySymbol: string;
  removeLineItem: (index: number | any) => void;
  setFieldValue: (name: string, value: any) => void;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({ name, line, currencySymbol, removeLineItem, setFieldValue }): React.ReactElement => {
  return (
    <IonCard className={CSSPrefix}>
      <IonCardHeader>
        <IonItem lines="none" className="ion-no-padding">
          <IonText>{dayjs(line.serviceDate).format('MMM D, YYYY')}</IonText>
          {/*
          // TODO: uncomment this in app V2
          <IonButton
            className="ion-no-padding"
            fill="clear"
            expand="block"
            color="dark"
            slot="end"
            onClick={removeLineItem}
          >
            <IonIcon icon={trashOutline} />
          </IonButton> */}
        </IonItem>
      </IonCardHeader>
      <IonCardContent>
        <IonInput
          // TODO: remove this live in app V2
          readonly={true}
          className={`${CSSPrefix}-custom-input ion-margin-bottom`}
          placeholder="Type code"
          value={line.code}
          onIonChange={(e) => setFieldValue(`${name}.code`, e.detail.value!!)}
        />
        <IonInput
          // TODO: remove this live in app V2
          readonly={true}
          className={`${CSSPrefix}-custom-input ion-margin-bottom`}
          placeholder="Description"
          value={line.description}
          onIonChange={(e) => setFieldValue(`${name}.description`, e.detail.value!!)}
        />
        <IonInput
          // TODO: remove this live in app V2
          readonly={true}
          className={`${CSSPrefix}-custom-input ion-no-margin`}
          placeholder="ICD 10 code"
          value={line.icd10Code}
          onIonChange={(e) => setFieldValue(`${name}.icd10Code`, e.detail.value!!)}
        />
        <div className="divider ion-margin-vertical" />
        <div className={`${CSSPrefix}-amount-container`}>
          <IonInput
            // TODO: remove this live in app V2
            readonly={true}
            type="text"
            className={`${CSSPrefix}-amount`}
            value={`${currencySymbol}${line.amount}`}
            onIonChange={(e) => setFieldValue(`${name}.amount`, e.detail.value!!)}
          />
        </div>
      </IonCardContent>
    </IonCard>
  )
}

export default InvoiceCard;