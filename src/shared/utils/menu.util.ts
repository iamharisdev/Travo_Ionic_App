import { APPOINTMENTS_MENU_ID, CALENDAR_MENU_ID, PROFILE_MENU_ID } from "../constants/menu";
import { APPOINTMENTS, CALENDAR, PROFILE } from "../routes/routes";

export const getMenuIdByLocation = (location: string): string => {
  switch (location) {
    case CALENDAR:
      return CALENDAR_MENU_ID;
    case APPOINTMENTS:
      return APPOINTMENTS_MENU_ID;
    case PROFILE:
      return PROFILE_MENU_ID;

    default:
      return '';
  }
}