import React from 'react';
import { IonItem, IonText } from '@ionic/react';
import Scheduling from '../../../Scheduling/Scheduling';
import { AppointmentDateTime } from '../../CreateAppointment';

import './SelectDateTime.scss';

const CSSPrefix = 'select-date-time';

interface SelectDateTimeProps {
  setSelectedDateTime: (selectedDateTime: AppointmentDateTime) => void;
}

const SelectDateTime: React.FC<SelectDateTimeProps> = ({ setSelectedDateTime }) => {

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
      <div>
        <Scheduling setSelectedDateTime={setSelectedDateTime} />
      </div>
    </div>
  );
}

export default SelectDateTime;