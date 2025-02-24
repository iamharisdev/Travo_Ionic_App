import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { resetAll } from './common.actions';
import { StatusState } from '../shared/types/state.type';
import { cancelAppointment, confirmAppointment, createAppointment, CreateAppointmentPayload, editAppointment, EventsResponse, getEvents, getGoogleEvents, getMicrosoftEvents, getServices, rescheduleAppointment, RescheduleAppointmentPayload, ServicesResponse } from '../api/services/scheduling';
import { AppointmentStatusEnum, CancelAppointmentPayload, ConfirmAppointmentPayload, IAppointment, UpdateAppointmentPayload } from '../shared/types/appointment.type';

export interface SchedulingState {
  events: EventsResponse;
  microsoftEvents: Array<IAppointment>;
  googleEvents: Array<IAppointment>;
  services: ServicesResponse;
  state: StatusState & { loading: boolean };
}

const initialState: SchedulingState = {
  events: {
    total: 0,
    events: [],
  },
  microsoftEvents: [],
  googleEvents: [],
  services: {
    totalPatientServices: 0,
    patientServiceRequestDtos: []
  },
  state: {
    success: false,
    loading: false,
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

export const getMicrosoftEventsAction = createAsyncThunk(
  'scheduling/getMicrosoftEventsAction',
  async ({
    practiceId,
    providerId,
    start,
    end,
  }: {
    practiceId: string;
    providerId: string;
    start: string;
    end: string;
  }): Promise<Array<IAppointment>> => {
    try {
      const response = await getMicrosoftEvents(practiceId, providerId, start, end);

      return response.data;
    } catch (error: any) {
      console.error('[getMicrosoftEventsAction]: ', error);
      return [];
    }
  }
);

export const getGoogleEventsAction = createAsyncThunk(
  'scheduling/getGoogleEventsAction',
  async ({
    practiceId,
    providerId,
    start,
    end,
  }: {
    practiceId: string;
    providerId: string;
    start: string;
    end: string;
  }): Promise<Array<IAppointment>> => {
    try {
      const response = await getGoogleEvents(practiceId, providerId, start, end);

      return response.data;
    } catch (error: any) {
      console.error('[getGoogleEventsAction]: ', error);
      return [];
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

export const cancelAppointmentAction = createAsyncThunk(
  'scheduling/cancelAppointment',
  async ({
    practiceId,
    providerId,
    appointmentId,
    payload
  }: {
    practiceId: string;
    providerId: string;
    appointmentId: string;
    payload: CancelAppointmentPayload
  }): Promise<{ appointmentId: string } | null> => {
    try {
      await cancelAppointment(practiceId, providerId, appointmentId, payload);

      return { ...payload, appointmentId };
    } catch (error: any) {
      console.error('[cancelAppointment]: ', error);
      return null;
    }
  }
);

export const confirmAppointmentAction = createAsyncThunk(
  'scheduling/confirmAppointment',
  async ({
    practiceId,
    providerId,
    appointmentId,
    payload
  }: {
    practiceId: string;
    providerId: string;
    appointmentId: string;
    payload: ConfirmAppointmentPayload
  }): Promise<{ appointmentId: string } | null> => {
    try {
      await confirmAppointment(practiceId, providerId, appointmentId, payload);

      return { appointmentId };
    } catch (error: any) {
      console.error('[confirmAppointment]: ', error);
      return null;
    }
  }
);

export const createAppointmentAction = createAsyncThunk(
  'scheduling/createAppointment',
  async ({
    practiceId,
    providerId,
    payload
  }: {
    practiceId: string;
    providerId: string;
    payload: CreateAppointmentPayload
  }): Promise<{ id: string } | null> => {
    try {
      const response = await createAppointment(practiceId, providerId, payload);

      return response.data;
    } catch (error: any) {
      console.error('[createAppointment]: ', error);
      return null;
    }
  }
);

export const rescheduleAppointmentAction = createAsyncThunk(
  'scheduling/rescheduleAppointment',
  async ({
    practiceId,
    providerId,
    appointmentId,
    payload
  }: {
    practiceId: string;
    providerId: string;
    appointmentId: string;
    payload: RescheduleAppointmentPayload
  }): Promise<boolean> => {
    try {
      await rescheduleAppointment(practiceId, providerId, appointmentId, payload);
      return true;
    } catch (error: any) {
      console.error('[rescheduleAppointment]: ', error);
      return false;
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
      .addCase(getEventsAction.pending, (state, action: PayloadAction<void>) => {
        console.log('pending get events');
        state.state.loading = true;
      })
      .addCase(getEventsAction.fulfilled, (state, action: PayloadAction<EventsResponse>) => {
        let newEvents = [...state.events.events];

        action.payload.events.forEach((updatedEvent) => {
          const exist = newEvents.some((nEvent) => nEvent?.id === updatedEvent?.id);
          if (!exist) {
            newEvents.push(updatedEvent);
          }

          if (exist) {
            newEvents = newEvents.map((nEvent) => {
              if (nEvent?.id === updatedEvent?.id) {
                const assigned = Object.assign(nEvent, updatedEvent);

                return assigned;
              }

              return nEvent;
            })
          }
        });

        state.events = {
          total: newEvents.length,
          events: newEvents,
        };
        state.state = { ...state.state, success: true, loading: false, error: null, message: '' };
      })
      .addCase(getEventsAction.rejected, (state) => {
        state = initialState;
      })
      .addCase(getMicrosoftEventsAction.pending, (state, action: PayloadAction<void>) => {
        console.log('pending get microsoft events');
        state.state.loading = true;
      })
      .addCase(getMicrosoftEventsAction.fulfilled, (state, action: PayloadAction<Array<IAppointment>>) => {
        let newEvents = [...state.microsoftEvents];

        action.payload.forEach((updatedEvent) => {
          const exist = newEvents.some((nEvent) => nEvent?.id === updatedEvent?.id);
          if (!exist) {
            newEvents.push(updatedEvent);
          }

          if (exist) {
            newEvents = newEvents.map((nEvent) => {
              if (nEvent?.id === updatedEvent?.id) {
                const assigned = Object.assign(nEvent, updatedEvent);

                return assigned;
              }

              return nEvent;
            })
          }
        });

        state.microsoftEvents = newEvents;
        state.state = { ...state.state, success: true, loading: false, error: null, message: '' };
      })
      .addCase(getMicrosoftEventsAction.rejected, (state) => {
        state = initialState;
      })
      .addCase(getGoogleEventsAction.pending, (state, action: PayloadAction<void>) => {
        console.log('pending get google events');
        state.state.loading = true;
      })
      .addCase(getGoogleEventsAction.fulfilled, (state, action: PayloadAction<Array<IAppointment>>) => {
        let newEvents = [...state.googleEvents];

        action.payload.forEach((updatedEvent) => {
          const exist = newEvents.some((nEvent) => nEvent?.id === updatedEvent?.id);
          if (!exist) {
            newEvents.push(updatedEvent);
          }

          if (exist) {
            newEvents = newEvents.map((nEvent) => {
              if (nEvent?.id === updatedEvent?.id) {
                const assigned = Object.assign(nEvent, updatedEvent);

                return assigned;
              }

              return nEvent;
            })
          }
        });

        state.googleEvents = newEvents;
        state.state = { ...state.state, success: true, loading: false, error: null, message: '' };
      })
      .addCase(getGoogleEventsAction.rejected, (state) => {
        state = initialState;
      })
      .addCase(getServicesAction.pending, (state) => {
        console.log('pending get services');
        state.state.loading = true;
      })
      .addCase(getServicesAction.fulfilled, (state, action: PayloadAction<ServicesResponse>) => {
        state.services = action.payload;
        state.state = { ...state.state, success: true, loading: false, error: null, message: '' };
      })
      .addCase(getServicesAction.rejected, (state) => {
        state = initialState;
      })
      .addCase(editAppointmentAction.pending, (state) => {
        console.log('pending edit appointment');
        state.state.loading = true;
      })
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
        state.state = { ...state.state, success: true, loading: false, error: null, message: '' };
      })
      .addCase(editAppointmentAction.rejected, (state) => {
        state = initialState;
      })
      .addCase(cancelAppointmentAction.pending, (state) => {
        console.log('pending cancel appointment');
        state.state.loading = true;
      })
      .addCase(cancelAppointmentAction.fulfilled, (state, action: PayloadAction<{ appointmentId: string } | null>) => {
        let updatedEvents = [...state.events?.events];
        updatedEvents = updatedEvents.map((event) => {
          if (event.id === action.payload?.appointmentId) {
            return { ...event, status: AppointmentStatusEnum.CANCELLED };
          }

          return event;
        })

        state.events.events = updatedEvents;
        state.events.total = updatedEvents.length;
        state.state = { ...state.state, success: true, loading: false, error: null, message: '' };
      })
      .addCase(cancelAppointmentAction.rejected, (state) => {
        state = initialState;
      })
      .addCase(confirmAppointmentAction.pending, (state) => {
        console.log('pending confirm appointment');
        state.state.loading = true;
      })
      .addCase(confirmAppointmentAction.fulfilled, (state, action: PayloadAction<{ appointmentId: string } | null>) => {
        let updatedEvents = [...state.events?.events];
        updatedEvents = updatedEvents.map((event) => {
          if (event.id === action.payload?.appointmentId) {
            return { ...event, status: AppointmentStatusEnum.CONFIRMEND };
          }

          return event;
        })

        state.events.events = updatedEvents;
        state.events.total = updatedEvents.length;
        state.state = { ...state.state, success: true, loading: false, error: null, message: '' };
      })
      .addCase(confirmAppointmentAction.rejected, (state) => {
        state = initialState;
      })
      .addCase(createAppointmentAction.pending, (state) => {
        console.log('pending create appointment');
        state.state.loading = true;
      })
      .addCase(createAppointmentAction.fulfilled, (state, action: PayloadAction<{ id: string } | null>) => {
        state.state = { ...state.state, success: true, loading: false, error: null, message: '' };
      })
      .addCase(createAppointmentAction.rejected, (state) => {
        state = initialState;
      })
      .addCase(rescheduleAppointmentAction.pending, (state) => {
        console.log('pending reschedule appointment');
        state.state.loading = true;
      })
      .addCase(rescheduleAppointmentAction.fulfilled, (state) => {
        state.state = { ...state.state, success: true, loading: false, error: null, message: '' };
      })
      .addCase(rescheduleAppointmentAction.rejected, (state) => {
        state = initialState;
      });
  }
});

export default schedulingSlice.reducer;