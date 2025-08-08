import { SlotInfo } from "react-big-calendar";
import { IAppointment } from "../../shared/types/appointment.type";

export interface CreateAppointmentProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedSlot?: SlotInfo;
  selected?:string;
  currentDate?: string;
  view?: 'month' | 'week' | 'day' | 'appointments';
  currentStep?:number;
  appointment? :IAppointment;
}