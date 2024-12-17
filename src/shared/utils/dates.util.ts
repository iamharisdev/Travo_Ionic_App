import dayjs from 'dayjs';

export const nextDay = (date: string) => dayjs(date).add(1, 'day').toDate();
export const prevDay = (date: string) => dayjs(date).subtract(1, 'day').toDate();
export const nextWeek = (date: string) => dayjs(date).startOf('week').add(1, 'week').toDate();
export const prevWeek = (date: string) => dayjs(date).startOf('week').subtract(1, 'week').toDate();
export const nextMonth = (date: string) => dayjs(date).startOf('month').add(1, 'month').toDate();
export const prevMonth = (date: string) => dayjs(date).startOf('month').subtract(1, 'month').toDate();

export const getDefaultDates = (start: string, end: string, type: 'day' | 'week' | 'month') => {
  const arr: Array<Date> = [];

  for (const dt = new Date(dayjs(start).startOf(type).toDate()); dt <= new Date(dayjs(end).endOf(type).toDate()); dt.setDate(dt.getDate() + 1)) {
    if (type === 'month') {
      arr.push(dayjs(dt).toDate());
    }

    if (type === 'week' || type === 'day') {
      for (let index = 0; index < 24; index++) {
        arr.push(dayjs(dt).hour(index).toDate())
      }
    }
  }

  return arr.map((date: Date, index: number) => ({
    id: (index + 1).toString(),
    title: JSON.stringify({
      id: (index + 1).toString(),
      service: '',
      patient: '',
      color: '',
    }),
    start: date,
    end: date,
  }));
};