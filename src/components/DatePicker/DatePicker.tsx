import React, { useEffect, useMemo, useState } from 'react';
import { DatePickerProps } from './datePicker.type';
import { IonDatetime } from '@ionic/react';
import _ from 'lodash';

import './DatePicker.scss';

const CSSPrefix = 'date-picker';

const DatePicker: React.FC<DatePickerProps> = ({ dates, onSelectedDates, onTriggerAction }) => {
  const [selectedDates, setSelectedDates] = useState<string[] | undefined>();

  const highlightedDates = useMemo(() => {
    if (selectedDates && selectedDates.length > 0) {
      return selectedDates.map((date) => ({
        date,
        textColor: 'var(--ion-trova-white) !important',
        backgroundColor: 'var(--ion-color-primary) !important',
      }));
    }

    return undefined;
  }, [selectedDates]);

  const minDate = useMemo(() => {
    if (selectedDates && selectedDates?.length > 0) {
      return selectedDates[0];
    }

    return undefined;
  }, [selectedDates]);

  const selectDatesHandler = (dates: string[] | undefined) => {
    // Logic to only allow to dates as range
    const newDates = (selectedDates && [...selectedDates] || []);
    if (newDates.length <= 1 && dates && dates.length > 0) {
      const upcomingDate = [...dates].pop();
      if (upcomingDate) newDates.push(upcomingDate);
      setSelectedDates(newDates);
      onSelectedDates(newDates);
      if (newDates.length === 2) {
        onTriggerAction(newDates);
      }
    } else {
      if (dates && dates.length === 1 && newDates?.length === 2) {
        setSelectedDates([]);
        onSelectedDates([]);
      }
      if (dates && dates.length === 3) {
        const upcomingDate = [...dates].pop();
        setSelectedDates([upcomingDate || '']);
        onSelectedDates([upcomingDate || '']);
      }
    }

    if (!dates) {
      setSelectedDates([]);
      onSelectedDates([]);
    }
  };

  useEffect(() => {
    if (dates.length > 0 && !_.isEqual(dates, selectedDates)) {
      setSelectedDates(dates);
    }
  }, [dates]);


  return (
    <IonDatetime
      className={CSSPrefix}
      presentation="date"
      preferWheel={false}
      multiple={true}
      min={minDate}
      value={selectedDates}
      highlightedDates={highlightedDates}
      onIonChange={(e) => selectDatesHandler(e.detail.value as string[] | undefined)}
    />
  );
}

export default DatePicker;