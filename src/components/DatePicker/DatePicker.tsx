import React, { useEffect, useState } from 'react';
import { DatePickerProps } from './datePicker.type';
import _ from 'lodash';
import CalendarDatePicker from 'react-datepicker';
import dayjs from 'dayjs';
import DatePickerHeader from '../DatePickerHeader/DatePickerHeader';

import './DatePicker.scss';
import "react-datepicker/dist/react-datepicker.css";

const CSSPrefix = 'date-picker';

const DatePicker: React.FC<DatePickerProps> = ({ date, onSelectedDate, onTriggerAction }) => {
  const [selectedDate, setSelectedDate] = useState<string | undefined>();

  const selectDateHandler = (date: Date | null) => {
    if (onSelectedDate) {
      if (date && onTriggerAction) {
        const selectedDate = dayjs(date).toISOString();
        setSelectedDate(selectedDate);
        onSelectedDate(selectedDate);
        onTriggerAction(selectedDate);
      }

      if (!date) {
        setSelectedDate(undefined);
        onSelectedDate(undefined);
      }
    }
  };

  useEffect(() => {
    if (date && !_.isEqual(date, selectedDate)) {
      setSelectedDate(date);
    }
  }, [date]);

  return (
    <CalendarDatePicker
      inline
      className={CSSPrefix}
      selected={dayjs(selectedDate).toDate()}
      formatWeekDay={(date) => date.slice(0, 1).toUpperCase()}
      renderCustomHeader={(props) => <DatePickerHeader {...props} />}
      onChange={selectDateHandler}
    />
  );
}

export default DatePicker;