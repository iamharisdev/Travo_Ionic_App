import React, { useMemo } from 'react';
import { NylasScheduling } from '@nylas/react';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { AppointmentStatusEnum } from '../../shared/types/appointment.type';
import { groupAppointmentsByDate } from '../../shared/utils/appointments.util';

const Scheduling: React.FC = (): React.ReactElement => {
  const { scheduling: { events } } = useSelector((state: RootState) => state);
  const sortedEvents = useMemo(() => [...events?.events || []].sort(
    (a, b) => dayjs(a.startTime).valueOf() - dayjs(b.startTime).valueOf()
  ).filter(({ status }) => status === AppointmentStatusEnum.CONFIRMEND), [events?.events]);
  const groupedAppointments = useMemo(() => groupAppointmentsByDate(sortedEvents), [sortedEvents]);
  console.log('groupedAppointments: ', groupedAppointments);
  return (
    <>
      <NylasScheduling
        configurationId={process.env.REACT_APP_NYLAS_CONFGI_ID}
        schedulerApiUrl={process.env.REACT_APP_NYLAS_API_URL}
      />
    </>
  );
};

export default Scheduling;