import { AppointmentDetailTypeEnum } from '../../shared/types/appointment.type';

export interface CancelAppointmentState {
  appointmentId: string;
  selected: string;
  isRecurring: string;
  type:string;
}
