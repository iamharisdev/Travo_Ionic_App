import React, { useMemo } from 'react';
import { NylasScheduling, NylasDatePicker, NylasTimeslotPicker } from '@nylas/react';
import { AppointmentDateTime } from '../CreateAppointment/CreateAppointment';

import './Scheduling.scss';

interface SchedulingProps {
  configurationId: string;
  setSelectedDateTime: (selectedDateTime: AppointmentDateTime) => void;
  selectedDate?: Date | null;
  start_time?: Date;
  end_time?: Date;
  onDateSelected?: (date: CustomEvent<Date>) => void;
}

const Scheduling: React.FC<SchedulingProps> = ({
  configurationId,
  selectedDate,
  start_time,
  end_time,
  setSelectedDateTime,
  onDateSelected,
}): React.ReactElement => {
  const selectedTimeslot = useMemo(() => {
    if (start_time && end_time) return {
      start_time,
      end_time,
      emails: []
    };

    return null;
  }, [start_time, end_time])

  return (
    <>
      <NylasScheduling
        className="scheduling"
        configurationId={configurationId}
        schedulerApiUrl={process.env.REACT_APP_NYLAS_API_URL}
        enableUserFeedback={false}
        defaultSchedulerState={{
          showBookingForm: false,
          confirmedEventInfo: undefined,
          nylasBranding: false,
          selectedDate,
          selectedTimeslot
        }}
        themeConfig={{
          '--nylas-primary': 'var(--ion-color-primary)',
          '--nylas-font-family': 'Poppins',
        }}
        mode="composable"
        eventOverrides={{
          timeslotConfirmed: async (
            event: CustomEvent<any>,
            connector?: any,
          ): Promise<void> => {
            event.preventDefault();
            const { start_time, end_time } = event.detail;
            setSelectedDateTime({
              startTime: (start_time as Date).toISOString(),
              endTime: (end_time as Date).toISOString(),
            });
          }
        }}
      >
        <NylasDatePicker
          configSettings={{
            scheduler: {
              // hide_additional_guests: true,
            }
          }}
          onDateSelected={(date: CustomEvent<Date>) => onDateSelected && onDateSelected(date)}
        />
        <NylasTimeslotPicker className="time-slot-picker" />
      </NylasScheduling>
    </>
  );
};

export default Scheduling;