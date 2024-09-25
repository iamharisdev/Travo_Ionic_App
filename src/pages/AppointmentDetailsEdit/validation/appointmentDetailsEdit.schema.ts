import { object, string } from 'yup';

export const editAppointmentSchema = object({
  location: string().required(),
  patientServiceId: string().required(),
  startTime: string().required(),
  endTime: string().required(),
});