import dayjs from "dayjs";
import { CALENDAR_SLOTS, IAppointment } from "../types/appointment.type";

export interface GroupedAppointments {
  date: string;
  appointments: IAppointment[];
}

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
      return color;
  }
};

export const getDateWithoutTime = (date: string) => date.split('T')[0];

export const groupAppointmentsByDate = (events: IAppointment[]): Array<GroupedAppointments> => {
  const groups = events.reduce((groups: any, event) => {
    if (event?.startTime && typeof event.startTime === 'string') {
      const date = getDateWithoutTime(event.startTime);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(event);
      return groups;
    }

    return {};
  }, {});

  // Edit: to add it in the array format instead
  return Object.keys(groups).map((date) => {
    return {
      date,
      appointments: groups[date]
    };
  });
}

export const getDatesBetween = (start: string, end: string) => {
  const dateArray = [];
  let currentDate = dayjs(start);

  while (currentDate.valueOf() <= dayjs(end).valueOf()) {
    dateArray.push(dayjs(currentDate).format('YYYY-MM-DD'));
    currentDate = currentDate.add(1, 'day');
  }

  return dateArray;
}