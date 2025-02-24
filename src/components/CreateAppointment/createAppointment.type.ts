import { SlotInfo } from "react-big-calendar";

export interface CreateAppointmentProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedSlot?: SlotInfo;
  currentDate?: string;
  view?: 'month' | 'week' | 'day' | 'appointments';
}