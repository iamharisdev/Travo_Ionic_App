import React from 'react';
import { NylasScheduling } from '@nylas/react';

const Scheduling: React.FC = (): React.ReactElement => {
  // const eventOverridesHandler = (event: SchedulerEventOverride) => {
  //   console.log('eventShcheduling: ', event);
  // }
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
          }
        }}
      />
    </>
  );
};

export default Scheduling;