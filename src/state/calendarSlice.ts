import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { resetAll } from './common.actions';
import { StatusState } from '../shared/types/state.type';
import dayjs from 'dayjs';
import { nextWeek, prevWeek } from '../shared/utils/dates.util';

interface CalendarState {
  selectedDate: string;
  selectedDates: Array<string>;
  state: StatusState;
}

const initialState: CalendarState = {
  selectedDate: dayjs().startOf('week').toDate().toISOString(),
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
    setNextWeek: (state) => {
      const newDate = nextWeek(state.selectedDate);
      const start = dayjs(newDate).startOf('week');
      const end = dayjs(newDate).endOf('week');

      state.selectedDate = newDate.toISOString();
      state.selectedDates = [start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')];
    },
    setPrevWeek: (state) => {
      const newDate = prevWeek(state.selectedDate);
      const start = dayjs(newDate).startOf('week');
      const end = dayjs(newDate).endOf('week');

      state.selectedDate = newDate.toISOString();
      state.selectedDates = [start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')];
    },
    setSelectedDates: (state, action: PayloadAction<{ selectedDates: Array<string> }>) => {
      const { selectedDates } = action.payload;
      state.selectedDates = selectedDates;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(resetAll, () => initialState);
  }
});

export const { setNextWeek, setPrevWeek } = calendarSlice.actions

export default calendarSlice.reducer;