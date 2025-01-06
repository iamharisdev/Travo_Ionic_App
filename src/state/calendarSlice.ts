import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { resetAll } from './common.actions';
import { StatusState } from '../shared/types/state.type';
import dayjs from 'dayjs';
import { nextDay, nextMonth, nextWeek, prevDay, prevMonth, prevWeek } from '../shared/utils/dates.util';

interface CalendarState {
  selectedDate: string;
  selectedDates: Array<string>;
  state: StatusState;
}

const initialState: CalendarState = {
  selectedDate: dayjs().toDate().toISOString(),
  selectedDates: [
    dayjs().startOf('week').format('YYYY-MM-DD'),
    dayjs().endOf('week').format('YYYY-MM-DD')
  ],
  state: {
    success: false,
  }
}

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setNextDay: (state) => {
      const newDate = nextDay(state.selectedDate);
      const selectedDate = dayjs(newDate).format('YYYY-MM-DD');

      state.selectedDate = selectedDate;
    },
    setPrevDay: (state) => {
      const newDate = prevDay(state.selectedDate);
      const selectedDate = dayjs(newDate).format('YYYY-MM-DD');

      state.selectedDate = selectedDate;
    },
    setNextWeek: (state) => {
      const newDate = nextWeek(state.selectedDates[0]);
      const start = dayjs(newDate).startOf('week').format('YYYY-MM-DD');
      const end = dayjs(newDate).endOf('week').format('YYYY-MM-DD');

      state.selectedDates = [start, end];
    },
    setPrevWeek: (state) => {
      const newDate = prevWeek(state.selectedDates[0]);
      const start = dayjs(newDate).startOf('week').format('YYYY-MM-DD');
      const end = dayjs(newDate).endOf('week').format('YYYY-MM-DD');

      state.selectedDates = [start, end];
    },
    setNextMonth: (state) => {
      const newDate = nextMonth(state.selectedDates[0]);
      const start = dayjs(newDate).startOf('month').format('YYYY-MM-DD');
      const end = dayjs(newDate).endOf('month').format('YYYY-MM-DD');

      state.selectedDates = [start, end];
    },
    setPrevMonth: (state) => {
      const newDate = prevMonth(state.selectedDates[0]);
      const start = dayjs(newDate).startOf('month').format('YYYY-MM-DD');
      const end = dayjs(newDate).endOf('month').format('YYYY-MM-DD');

      state.selectedDates = [start, end];
    },
    setDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
    setDates: (state, action: PayloadAction<{ selectedDates: Array<string> }>) => {
      const { selectedDates } = action.payload;
      const [start, end] = selectedDates;

      state.selectedDates = [start, end];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(resetAll, () => initialState);
  }
});

export const {
  setNextDay,
  setPrevDay,
  setNextWeek,
  setPrevWeek,
  setDate,
  setDates,
  setNextMonth,
  setPrevMonth,
} = calendarSlice.actions

export default calendarSlice.reducer;