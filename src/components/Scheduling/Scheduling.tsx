import React from 'react';
import { NylasScheduling } from '@nylas/react';
import { AppointmentDateTime } from '../CreateAppointment/CreateAppointment';

interface SchedulingProps {
  setSelectedDateTime: (selectedDateTime: AppointmentDateTime) => void;
}

const Scheduling: React.FC<SchedulingProps> = ({ setSelectedDateTime }): React.ReactElement => {
  return (
    <>
      <NylasScheduling
        configurationId={process.env.REACT_APP_NYLAS_CONFGI_ID}
        schedulerApiUrl={process.env.REACT_APP_NYLAS_API_URL}
        enableUserFeedback={false}
        defaultSchedulerState={{
          showBookingForm: false,
          confirmedEventInfo: undefined,
        }}
        eventOverrides={{
          timeslotConfirmed: async (
            event: CustomEvent<any>,
            connector?: any,
          ): Promise<void> => {
            event.preventDefault();
            console.log('event', event);
            console.log('connector', connector);
            const { start_time, end_time } = event.detail;
            console.log('datetime', {
              start_time,
              end_time
            });
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