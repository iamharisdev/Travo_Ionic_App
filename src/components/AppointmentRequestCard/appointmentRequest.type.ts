import { IAppointment } from "../../shared/types/appointment.type";

export interface AppointmentRequestProps {
  appointment: IAppointment;
  acceptCB: (appointmentId: string) => Promise<void>;
  declineCB: (appointmentId: string) => void;
}