import { CALENDAR_SLOTS } from "../types/appointment.type";

export const getAppointmentColor = (color: CALENDAR_SLOTS | '') => {
  switch (color) {
    case CALENDAR_SLOTS.ORANGE:
      return `8px solid var(--ion-trova-orange-color)`;
    case CALENDAR_SLOTS.PINK:
      return `8px solid var(--ion-trova-pink-color)`;
    case CALENDAR_SLOTS.PURPLE:
      return `8px solid var(--ion-trova-purple-color)`;
    case CALENDAR_SLOTS.BLUE:
      return `8px solid var(--ion-trova-blue-color)`;
    case CALENDAR_SLOTS.GREEN:
      return `8px solid var(--ion-trova-green-color)`;
    case CALENDAR_SLOTS.TEAL:
      return `8px solid var(--ion-trova-teal-color)`;

    default:
      return `8px solid var(--ion-trova-orange-color)`;
  }
};