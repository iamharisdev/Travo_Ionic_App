import React from 'react';
import { NylasScheduling, NylasDatePicker, NylasTimeslotPicker } from '@nylas/react';
import { AppointmentDateTime } from '../CreateAppointment/CreateAppointment';

import './Scheduling.scss';

interface SchedulingProps {
  setSelectedDateTime: (selectedDateTime: AppointmentDateTime) => void;
}

const Scheduling: React.FC<SchedulingProps> = ({ setSelectedDateTime }): React.ReactElement => {
  return (
    <>
      <NylasScheduling
        className="scheduling"
        configurationId={process.env.REACT_APP_NYLAS_CONFGI_ID}
        schedulerApiUrl={process.env.REACT_APP_NYLAS_API_URL}
        enableUserFeedback={false}
        defaultSchedulerState={{
          showBookingForm: false,
          confirmedEventInfo: undefined,
          nylasBranding: false,
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
        />
        <NylasTimeslotPicker />
      </NylasScheduling>
    </>
  );
};

export default Scheduling;