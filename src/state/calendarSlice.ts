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
  selectedDates: [],
  state: {
    success: false,
  }
}

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setNextWeek: (state) => {
      state.selectedDate = nextWeek(state.selectedDate).toISOString();
    },
    setPrevWeek: (state) => {
      state.selectedDate = prevWeek(state.selectedDate).toISOString();
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