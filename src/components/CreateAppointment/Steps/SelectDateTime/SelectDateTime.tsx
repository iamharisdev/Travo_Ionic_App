import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { IonButton, IonDatetime, IonItem, IonText } from '@ionic/react';
import { AppointmentDateTime } from '../../CreateAppointment';
import DatePicker from '../../../DatePicker/DatePicker';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../state/store';
import dayjs from 'dayjs';

import './SelectDateTime.scss';

const CSSPrefix = 'select-date-time';

interface SelectDateTimeProps {
  setSelectedDateTime: (selectedDateTime: AppointmentDateTime) => void;
  selectedDate?: string;
  start_time?: Date;
  end_time?: Date;
  onDateSelected?: (date: Date) => void;
  duration?: number;
}

const SelectDateTime: React.FC<SelectDateTimeProps> = ({
  selectedDate,
  start_time,
  end_time,
  duration,
  setSelectedDateTime,
  onDateSelected
}) => {
  const {
    provider,
  } = useSelector((state: RootState) => state);
  const [currentSelectedDate, setCurrenSelectedDate] = useState<Date>();
  const [currentSelectedDateTime, setCurrenSelectedDateTime] = useState<AppointmentDateTime>();

  const hourValues = useMemo(() => {
    if (provider?.practice?.displayTwentyFourHourTime) {
      return '00,01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23';
    }

    return '0,1,2,3,4,5,6,7,8,9,10,11';

  }, [provider?.practice?.displayTwentyFourHourTime]);

  const onNextHandler = useCallback(() => {
    if (currentSelectedDateTime?.startTime && currentSelectedDateTime?.endTime && currentSelectedDate && onDateSelected) {
      onDateSelected(currentSelectedDate);
      setSelectedDateTime({
        startTime: currentSelectedDateTime.startTime,
        endTime: currentSelectedDateTime.endTime,
      });
    }
  }, [currentSelectedDate, currentSelectedDateTime]);

  useEffect(() => {
    if ((start_time && end_time || selectedDate) && !currentSelectedDate && !currentSelectedDateTime) {
      setCurrenSelectedDateTime({
        startTime: dayjs(start_time || selectedDate).format('YYYY-MM-DDTHH:mm:ss'),
        endTime: dayjs(end_time || selectedDate).format('YYYY-MM-DDTHH:mm:ss'),
      });
      setCurrenSelectedDate(dayjs(selectedDate).toDate());
    }
  }, [start_time, end_time, selectedDate, currentSelectedDate, currentSelectedDateTime]);

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
          date={currentSelectedDate?.toISOString()}
          minDate={dayjs().toISOString()}
          onSelectedDate={(date) => {
            if (dayjs(date).format('YYYY-MM-DD') !== dayjs(currentSelectedDate).format('YYYY-MM-DD')) {
              const newDate = dayjs(date);
              setCurrenSelectedDate(newDate.toDate());
              if (currentSelectedDateTime?.startTime && currentSelectedDateTime?.endTime) {
                const spliteStart = currentSelectedDateTime.startTime.split('T');
                const spliteEnd = currentSelectedDateTime.endTime.split('T');
                const newStartTime = `${newDate.format('YYYY-MM-DD')}T${spliteStart[1]}`;
                const newEndTime = `${newDate.format('YYYY-MM-DD')}T${spliteEnd[1]}`;
                setCurrenSelectedDateTime({
                  startTime: newStartTime,
                  endTime: newEndTime,
                });
              }
            }
          }}
          onTriggerAction={() => console.log('onTriggerAction')}
        />
      </div>
      <div className={`${CSSPrefix}-divider`} />
      <div className={`${CSSPrefix}-time-picker-container`}>
        <IonDatetime
          className={`${CSSPrefix}-time-picker`}
          presentation="time"
          hourCycle={provider.practice?.displayTwentyFourHourTime ? 'h23' : 'h11'}
          hourValues={hourValues}
          minuteValues="0,5,10,15,20,25,30,35,40,45,50,55"
          preferWheel={true}
          value={currentSelectedDateTime?.startTime}
          onIonChange={(e) => {
            const startTime = (dayjs(e.detail?.value!! as string));
            const endTime = startTime.add(duration || 0, 'minutes');

            setCurrenSelectedDateTime({
              startTime: e.detail.value as string,
              endTime: endTime.format('YYYY-MM-DDTHH:mm:ss'),
            });
          }}
        />
      </div>
      <div className={`${CSSPrefix}-next-container`}>
        <IonButton
          color="primary"
          expand="block"
          disabled={!currentSelectedDate && !currentSelectedDateTime}
          onClick={onNextHandler}
        >
          Next
        </IonButton>
      </div>
    </div>
  );
}

export default SelectDateTime;