import React from 'react';
import { DatePickerProps } from './datePicker.type';
import { IonDatetime } from '@ionic/react';

import './DatePicker.scss';

const CSSPrefix = 'date-picker';

const DatePicker: React.FC<DatePickerProps> = () => {
  return (
    <IonDatetime className={CSSPrefix} presentation="date" />
  );
}

export default DatePicker;