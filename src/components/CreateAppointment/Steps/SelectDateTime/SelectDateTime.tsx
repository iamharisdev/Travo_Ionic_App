import React from 'react';
import { IonItem, IonText } from '@ionic/react';
import Scheduling from '../../../Scheduling/Scheduling';
import { AppointmentDateTime } from '../../CreateAppointment';

import './SelectDateTime.scss';

const CSSPrefix = 'select-date-time';

interface SelectDateTimeProps {
  configurationId: string;
  setSelectedDateTime: (selectedDateTime: AppointmentDateTime) => void;
  selectedDate?: Date | null;
  start_time?: Date;
  end_time?: Date;
  onDateSelected?: (date: CustomEvent<Date>) => void;
}

const SelectDateTime: React.FC<SelectDateTimeProps> = ({
  configurationId,
  selectedDate,
  start_time,
  end_time,
  setSelectedDateTime,
  onDateSelected
}) => {

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
        <Scheduling
          configurationId={configurationId}
          selectedDate={selectedDate}
          start_time={start_time}
          end_time={end_time}
          setSelectedDateTime={setSelectedDateTime}
          onDateSelected={onDateSelected}
        />
      </div>
    </div>
  );
}

export default SelectDateTime;