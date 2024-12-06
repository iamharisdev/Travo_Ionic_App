import dayjs from 'dayjs';

export const nextDay = (date: string) => dayjs(date).add(1, 'day').toDate();
export const prevDay = (date: string) => dayjs(date).subtract(1, 'day').toDate();
export const nextWeek = (date: string) => dayjs(date).startOf('week').add(1, 'week').toDate();
export const prevWeek = (date: string) => dayjs(date).startOf('week').subtract(1, 'week').toDate();
export const nextMonth = (date: string) => dayjs(date).startOf('month').add(1, 'month').toDate();
export const prevMonth = (date: string) => dayjs(date).startOf('month').subtract(1, 'month').toDate();