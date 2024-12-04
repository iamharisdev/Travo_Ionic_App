import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import dayjs from 'dayjs';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';

import './DatePickerHeader.scss';

const CSSPrefix = 'date-picker-header';

interface DatePickerHeaderProps {
  date: Date;
  changeYear: (date: number) => void;
  changeMonth: (date: number) => void;
  decreaseMonth: () => void;
  increaseMonth: () => void;
  prevMonthButtonDisabled: boolean;
  nextMonthButtonDisabled: boolean;
}

const DatePickerHeader: React.FC<DatePickerHeaderProps> = ({
  date,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}): React.ReactElement => {
  return (
    <div className={CSSPrefix}>
      <IonButton
        fill="clear"
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
      >
        <IonIcon icon={chevronBackOutline} />
      </IonButton>
      <h2>{dayjs(date).format('MMMM YYYY')}</h2>
      <IonButton
        fill="clear"
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
      >
        <IonIcon icon={chevronForwardOutline} />
      </IonButton>
    </div>
  )
}

export default DatePickerHeader;