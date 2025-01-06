import React, { useMemo } from 'react';
import { NylasScheduling } from '@nylas/react';
import { AppointmentDateTime } from '../CreateAppointment/CreateAppointment';

interface SchedulingProps {
  configurationId: string;
  setSelectedDateTime: (selectedDateTime: AppointmentDateTime) => void;
  selectedDate?: Date | null;
  start_time?: Date;
  end_time?: Date;
}

const Scheduling: React.FC<SchedulingProps> = ({
  configurationId,
  selectedDate,
  start_time,
  end_time,
  setSelectedDateTime
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
        configurationId={configurationId}
        schedulerApiUrl={process.env.REACT_APP_NYLAS_API_URL}
        enableUserFeedback={false}
        defaultSchedulerState={{
          showBookingForm: false,
          confirmedEventInfo: undefined,
          selectedDate,
          selectedTimeslot
        }}
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
      />
    </>
  );
};

export default Scheduling;