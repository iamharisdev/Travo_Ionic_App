import { Services } from "../../shared/types/appointment.type";

export interface AppointmentCardProps {
  service: Services;
  onClick: () => void;
}