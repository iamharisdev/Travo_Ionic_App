import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { resetAll } from './common.actions';
import { StatusState } from '../shared/types/state.type';
import { EventsResponse, getEvents } from '../api/services/scheduling';

export interface SchedulingState {
  events: EventsResponse | null;
  state: StatusState;
}

const initialState: SchedulingState = {
  events: {
    total: 0,
    events: []
  },
  state: {
    success: false,
  }
}

export const getEventsAction = createAsyncThunk(
  'scheduling/getEvents',
  async ({
    practiceId,
    providerId,
    start,
    end,
    pageNumber,
    pageSize,
    filter
  }: {
    practiceId: string;
    providerId: string;
    start: string;
    end: string;
    pageNumber: number;
    pageSize: number;
    filter?: any;
  }): Promise<EventsResponse | null> => {
    try {
      const response = await getEvents(practiceId, providerId, start, end, pageNumber, pageSize, filter);

      return response.data;
    } catch (error: any) {
      console.error('[getEvents]: ', error);
      return null;
    }
  }
);

const schedulingSlice = createSlice({
  name: 'scheduling',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(resetAll, () => initialState)
      .addCase(getEventsAction.pending, () => console.log('pending get events'))
      .addCase(getEventsAction.fulfilled, (state, action: PayloadAction<EventsResponse | null>) => {
        state.events = action.payload;
        state.state = { ...state.state, success: true, error: null, message: '' };
      })
      .addCase(getEventsAction.rejected, (state) => {
        state = initialState;
      });
  }
});

export default schedulingSlice.reducer;