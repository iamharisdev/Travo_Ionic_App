import React, { useEffect, useState } from 'react';
import { IonButton, IonDatetime, IonItem, IonText } from '@ionic/react';
import Scheduling from '../../../Scheduling/Scheduling';
import { AppointmentDateTime } from '../../CreateAppointment';
import DatePicker from '../../../DatePicker/DatePicker';

import './SelectDateTime.scss';
import dayjs from 'dayjs';

const CSSPrefix = 'select-date-time';

interface SelectDateTimeProps {
  configurationId: string;
  setSelectedDateTime: (selectedDateTime: AppointmentDateTime) => void;
  selectedDate?: string;
  start_time?: Date;
  end_time?: Date;
  onDateSelected?: (date: Date) => void;
  duration?: number;
}

const SelectDateTime: React.FC<SelectDateTimeProps> = ({
  configurationId,
  selectedDate,
  start_time,
  end_time,
  duration,
  setSelectedDateTime,
  onDateSelected
}) => {
  console.log('DATA: ', {
    start_time,
    end_time
  })

  const [currentSelectedDate, setCurrenSelectedDate] = useState<Date>();
  const [currentSelectedDateTime, setCurrenSelectedDateTime] = useState<AppointmentDateTime>();

  console.log('currentSelectedDate: ', currentSelectedDate)
  console.log('currentSelectedDateTime: ', currentSelectedDateTime)
  console.log('duration: ', duration)
  console.log('transformed: ', {
    start: dayjs(currentSelectedDateTime?.startTime).format('YYYY-MM-DD HH:mm'),
    end: dayjs(currentSelectedDateTime?.endTime).format('YYYY-MM-DD HH:mm'),
  })

  useEffect(() => {
    setCurrenSelectedDate(undefined);
    setCurrenSelectedDateTime(undefined);
  }, []);

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
      <div className={`${CSSPrefix}-date-picker-container`}>
        <DatePicker
          date={selectedDate}
          minDate={dayjs().toISOString()}
          onSelectedDate={(date) => setCurrenSelectedDate(dayjs(date).toDate())}
          onTriggerAction={() => console.log('onTriggerAction')}
        />
      </div>
      <div className={`${CSSPrefix}-divider`} />
      <div className={`${CSSPrefix}-time-picker-container`}>
        <IonDatetime
          className={`${CSSPrefix}-time-picker`}
          presentation="time"
          hourValues="0,1,2,3,4,5,6,7,8,9,10,11"
          minuteValues="0,5,10,15,20,25,30,35,40,45,50,55"
          preferWheel={true}
          // TODO: check value logic
          value={currentSelectedDateTime?.startTime || currentSelectedDate?.toISOString()!!}
          onIonChange={(e) => {
            const startTime = (dayjs(e.detail?.value!! as string));
            const endTime = startTime.add(duration || 0, 'minutes');
            setCurrenSelectedDateTime({
              startTime: startTime.toISOString(),
              endTime: endTime.toISOString(),
            });
          }}
        />
      </div>
      <IonButton
        color="primary"
        expand="block"
        disabled={!currentSelectedDate && !currentSelectedDateTime}
      >
        Next
      </IonButton>
    </div>
  );
}

export default SelectDateTime;