import dayjs from 'dayjs';

export const nextWeek = (date: Date) => dayjs(date).add(1, 'week').toDate();
export const prevWeek = (date: Date) => dayjs(date).subtract(1, 'week').toDate();