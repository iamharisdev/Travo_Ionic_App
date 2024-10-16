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
    setNextWeek: (state) => {
      const newDate = nextWeek(state.selectedDate);
      const start = dayjs(newDate).startOf('week').format('YYYY-MM-DD');
      const end = dayjs(newDate).endOf('week').format('YYYY-MM-DD');

      state.selectedDate = newDate.toISOString();
      state.selectedDates = [start, end];
    },
    setPrevWeek: (state) => {
      const newDate = prevWeek(state.selectedDate);
      const start = dayjs(newDate).startOf('week').format('YYYY-MM-DD');
      const end = dayjs(newDate).endOf('week').format('YYYY-MM-DD');

      state.selectedDate = newDate.toISOString();
      state.selectedDates = [start, end];
    },
    setDate: (state, action: PayloadAction<string>) => {
      const start = dayjs(action.payload).startOf('week').format('YYYY-MM-DD');
      const end = dayjs(action.payload).endOf('week').format('YYYY-MM-DD');

      state.selectedDate = action.payload;
      state.selectedDates = [start, end];
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

export const { setNextWeek, setPrevWeek, setDate } = calendarSlice.actions

export default calendarSlice.reducer;