import { AppointmentDetailTypeEnum } from "../../shared/types/appointment.type";

export interface CancelAppointmentState {
  appointmentId: string;
  type: AppointmentDetailTypeEnum;
}