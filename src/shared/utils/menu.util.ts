import { APPOINTMENT_REQUESTS_MENU_ID, APPOINTMENTS_MENU_ID, CALENDAR_DAY_MENU_ID, CALENDAR_MENU_ID, PROFILE_MENU_ID } from "../constants/menu";
import { APPOINTMENT_REQUESTS, APPOINTMENTS, CALENDAR, CALENDAR_DAY, PROFILE } from "../routes/routes";

export const getMenuIdByLocation = (location: string): string => {
  switch (location) {
    case CALENDAR:
      return CALENDAR_MENU_ID;
    case CALENDAR_DAY:
      return CALENDAR_DAY_MENU_ID;
    case APPOINTMENTS:
      return APPOINTMENTS_MENU_ID;
    case PROFILE:
      return PROFILE_MENU_ID;
    case APPOINTMENT_REQUESTS:
      return APPOINTMENT_REQUESTS_MENU_ID;

    default:
      return '';
  }
}