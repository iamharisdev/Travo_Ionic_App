import dayjs from 'dayjs';

export const nextWeek = (date: string) => dayjs(date).startOf('week').add(1, 'week').toDate();
export const prevWeek = (date: string) => dayjs(date).startOf('week').subtract(1, 'week').toDate();