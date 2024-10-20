import React from 'react';
import { IonItem, IonText } from '@ionic/react';
import Scheduling from '../../../Scheduling/Scheduling';

import './SelectDateTime.scss';

const CSSPrefix = 'select-date-time';

interface SelectDateTimeProps { }

const SelectDateTime: React.FC<SelectDateTimeProps> = ({ }) => {

  return (
    <div className={CSSPrefix}>
      <IonItem lines="none">
        <IonText className={`${CSSPrefix}-title`}>
          Schedule appointment
        </IonText>
      </IonItem>
      <IonItem lines="none" className={`${CSSPrefix}-subtitle`}>
        <IonText>
          Select date and time
        </IonText>
      </IonItem>
      <Scheduling />
    </div>
  );
}

export default SelectDateTime;