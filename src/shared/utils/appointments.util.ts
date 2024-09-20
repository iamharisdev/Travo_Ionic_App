import { CALENDAR_SLOTS } from "../types/appointment.type";

export const getAppointmentColor = (color: CALENDAR_SLOTS | '') => {
  switch (color) {
    case CALENDAR_SLOTS.ORANGE:
      return 'var(--ion-trova-orange-color)';
    case CALENDAR_SLOTS.PINK:
      return 'var(--ion-trova-pink-color)';
    case CALENDAR_SLOTS.PURPLE:
      return 'var(--ion-trova-purple-color)';
    case CALENDAR_SLOTS.BLUE:
      return 'var(--ion-trova-blue-color)';
    case CALENDAR_SLOTS.GREEN:
      return 'var(--ion-trova-green-color)';
    case CALENDAR_SLOTS.TEAL:
      return 'var(--ion-trova-teal-color)';

    default:
      return 'var(--ion-trova-orange-color)';
  }
};