import { IAppointment } from "../../shared/types/appointment.type";

export interface RescheduleAppointmentProps {
  isOpen: boolean;
  appointment?: IAppointment;
  setIsOpen: (isOpen: boolean) => void;
}