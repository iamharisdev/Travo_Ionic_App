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
      return 'var(--ion-trova-orange-color)';
  }
};

export const groupAppointmentsByDate = (events: IAppointment[]): Array<GroupedAppointments> => {
  const groups = events.reduce((groups: any, event) => {
    if (event?.startTime && typeof event.startTime === 'string') {
      const date = event.startTime.split('T')[0];
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