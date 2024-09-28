import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { resetAll } from './common.actions';
import { StatusState } from '../shared/types/state.type';
import { editAppointment, EventsResponse, getEvents, getServices, ServicesResponse } from '../api/services/scheduling';
import { AppointmentStatusEnum, UpdateAppointmentPayload } from '../shared/types/appointment.type';

export interface SchedulingState {
  events: EventsResponse;
  services: ServicesResponse;
  state: StatusState;
}

const initialState: SchedulingState = {
  events: {
    total: 0,
    events: [],
  },
  services: {
    totalPatientServices: 0,
    patientServiceRequestDtos: []
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
    filter,
    status,
  }: {
    practiceId: string;
    providerId: string;
    start: string;
    end: string;
    pageNumber: number;
    pageSize: number;
    filter?: any;
    status?: AppointmentStatusEnum;
  }): Promise<EventsResponse> => {
    try {
      const response = await getEvents(practiceId, providerId, start, end, pageNumber, pageSize, filter, status);

      return response.data;
    } catch (error: any) {
      console.error('[getEvents]: ', error);
      return { total: 0, events: [] };
    }
  }
);

export const getServicesAction = createAsyncThunk(
  'scheduling/getServices',
  async ({
    practiceId,
    providerId,
    pageNumber,
    pageSize,
  }: {
    practiceId: string;
    providerId: string;
    pageNumber: number;
    pageSize: number;
  }): Promise<ServicesResponse> => {
    try {
      const response = await getServices(practiceId, providerId, pageNumber, pageSize);

      return response.data;
    } catch (error: any) {
      console.error('[getServices]: ', error);
      return { totalPatientServices: 0, patientServiceRequestDtos: [] };
    }
  }
);

export const editAppointmentAction = createAsyncThunk(
  'scheduling/editAppointment',
  async ({
    practiceId,
    providerId,
    appointmentId,
    payload
  }: {
    practiceId: string;
    providerId: string;
    appointmentId: string;
    payload: UpdateAppointmentPayload
  }): Promise<UpdateAppointmentPayload & { appointmentId: string } | null> => {
    try {
      await editAppointment(practiceId, providerId, appointmentId, payload);

      return { ...payload, appointmentId };
    } catch (error: any) {
      console.error('[editAppointment]: ', error);
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
      .addCase(getEventsAction.fulfilled, (state, action: PayloadAction<EventsResponse>) => {
        state.events = action.payload;
        state.state = { ...state.state, success: true, error: null, message: '' };
      })
      .addCase(getEventsAction.rejected, (state) => {
        state = initialState;
      })
      .addCase(getServicesAction.pending, () => console.log('pending get services'))
      .addCase(getServicesAction.fulfilled, (state, action: PayloadAction<ServicesResponse>) => {
        state.services = action.payload;
        state.state = { ...state.state, success: true, error: null, message: '' };
      })
      .addCase(getServicesAction.rejected, (state) => {
        state = initialState;
      })
      .addCase(editAppointmentAction.pending, () => console.log('pending edit appointment'))
      .addCase(editAppointmentAction.fulfilled, (state, action: PayloadAction<UpdateAppointmentPayload & { appointmentId: string } | null>) => {
        let updatedEvents = [...state.events?.events];
        updatedEvents = updatedEvents.map((event) => {
          if (event.id === action.payload?.appointmentId) {
            return { ...event, ...action.payload };
          }

          return event;
        })

        state.events.events = updatedEvents;
        state.events.total = updatedEvents.length;
        state.state = { ...state.state, success: true, error: null, message: '' };
      })
      .addCase(editAppointmentAction.rejected, (state) => {
        state = initialState;
      });
  }
});

export default schedulingSlice.reducer;