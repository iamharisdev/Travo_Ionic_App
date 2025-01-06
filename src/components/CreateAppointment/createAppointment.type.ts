import { SlotInfo } from "react-big-calendar";

export interface CreateAppointmentProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedSlot?: SlotInfo;
}