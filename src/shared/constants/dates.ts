import dayjs from "dayjs";

export const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export const TODAY = dayjs().format('YYYY-MM-DD');
export const SEVEN_DAYS_FROM_TODAY = dayjs().add(7, 'days').format('YYYY-MM-DD');