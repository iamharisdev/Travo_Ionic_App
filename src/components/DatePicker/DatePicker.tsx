import React, { useEffect, useMemo, useState } from 'react';
import { DatePickerProps } from './datePicker.type';
import { IonDatetime } from '@ionic/react';
import _ from 'lodash';
import { getDatesBetween } from '../../shared/utils/appointments.util';

import './DatePicker.scss';

const CSSPrefix = 'date-picker';

const DatePicker: React.FC<DatePickerProps> = ({ date, dates, multiple = false, onSelectedDates, onSelectedDate, onTriggerAction }) => {
  const [selectedDates, setSelectedDates] = useState<string[] | undefined>();
  const [selectedDate, setSelectedDate] = useState<string | undefined>();

  const datesBetween = useMemo(() => {
    if (selectedDates?.length === 2) {
      const [start, end] = selectedDates;
      return getDatesBetween(start, end);
    }

    return [];
  }, [selectedDates]);

  const highlightedDates = useMemo(() => {
    if (datesBetween.length > 0) {
      return datesBetween.map((date) => ({
        date,
        textColor: 'var(--ion-trova-white) !important',
        backgroundColor: 'var(--ion-color-primary) !important',
      }));
    }

    return undefined;
  }, [datesBetween]);

  const minDate = useMemo(() => {
    if (selectedDates && selectedDates?.length > 0) {
      return selectedDates[0];
    }

    return undefined;
  }, [selectedDates]);

  const selectDatesHandler = (dates: string[] | undefined) => {
    // Logic to only allow to dates as range
    if (onSelectedDates) {
      const newDates = (selectedDates && [...selectedDates] || []);
      if (newDates.length <= 1 && dates && dates.length > 0) {
        const upcomingDate = [...dates].pop();
        if (upcomingDate) newDates.push(upcomingDate);
        setSelectedDates(newDates);
        onSelectedDates(newDates);
        if (newDates.length === 2 && onTriggerAction) {
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
    }
  };

  const selectDateHandler = (date: string | undefined) => {
    if (onSelectedDate) {
      if (date && onTriggerAction) {
        setSelectedDate(date);
        onSelectedDate(date);
        onTriggerAction(date);
      }

      if (!date) {
        setSelectedDate(undefined);
        onSelectedDate(undefined);
      }
    }
  };

  useEffect(() => {
    if (dates && dates.length > 0 && !_.isEqual(dates, selectedDates) && multiple) {
      setSelectedDates([dates[0]]);
      setTimeout(() => setSelectedDates(dates), 50);
    }

    if (date && !_.isEqual(date, selectedDate) && !multiple) {
      setSelectedDate(date);
    }
  }, [dates, date]);

  return (
    <>
      {multiple && (
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
      )}
      {!multiple && (
        <IonDatetime
          className={CSSPrefix}
          presentation="date"
          preferWheel={false}
          multiple={false}
          value={selectedDate}
          onIonChange={(e) => selectDateHandler(e.detail.value as string | undefined)}
        />
      )}
    </>
  );
}

export default DatePicker;