import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { resetAll } from './common.actions';
import { getMe, getProfile } from '../api/services/provider';
import { StatusState } from '../shared/types/state.type';

export interface ProviderProfileResponse {
  profilePictureUrl: string | null;
  firstName: string;
  lastName: string;
  displayName: string;
  languages: string;
  qualificationsAndTitle: string;
  bio: string;
  preferredCurrency: string;
  phoneNumber: string;
  phoneNumberPrefix: string;
  userName: string;
  skipAppointmentRequestNotifications: boolean | null;
}

interface GetProfile {
  practiceId: string;
  providerId: string;
}

interface Principal {
  username: string;
  providerId: string;
  firstName: string;
  lastName: string;
  displayName: string;
  profilePicture: string;
  countryCode: string;
  timeZone: string;
  superAdmin: boolean;
}

interface ProviderPractices {
  practiceId: string;
  providerId: string;
  profileRole: string;
  active: string;
}

export interface MeInterface {
  principal: Principal | null;
  providerPractices: Array<ProviderPractices>;
}

// for practice details
interface Practice {
  profilePictureUrl: null,
  firstName: '',
  lastName: '',
  displayName: '',
  languages: '',
  qualificationsAndTitle: '',
  bio: '',
  preferredCurrency: '',
  phoneNumber: '',
  phoneNumberPrefix: '',
  userName: '',
  skipAppointmentRequestNotifications: null,
}

export interface ProviderState extends MeInterface {
  state: StatusState;
}

const initialState: ProviderState = {
  principal: null,
  providerPractices: [],
  state: {
    success: false,
  }
}

export const getMeAction = createAsyncThunk(
  'provider/getMe',
  async (): Promise<ProviderState> => {
    try {
      const response = await getMe();

      const payload: ProviderState = {
        principal: response.data.principal,
        providerPractices: response.data.providerPractices,
        state: {
          success: true,
        }
      };

      return payload;
    } catch (error: any) {
      console.error('[getMe]: ', error);
      const payload = { ...initialState, state: { message: error.response.statusText, error, success: false } };

      return payload;
    }
  }
);

export const getPractice = createAsyncThunk(
  'provider/getPractice',
  async ({ practiceId, providerId }: GetProfile): Promise<ProviderProfileResponse | null> => {
    try {
      const response = await getProfile(practiceId, providerId);

      return response.data;
    } catch (error: any) {
      console.error('[getPractice]: ', error);
      return null;
    }
  }
);

const providerSlice = createSlice({
  name: 'provider',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMeAction.pending, () => console.log('pending get profile'))
      .addCase(getMeAction.fulfilled, (state, action: PayloadAction<ProviderState>) => {
        state.principal = action.payload.principal;
        state.providerPractices = action.payload.providerPractices;
        state.state = { ...action.payload.state };
      })
      .addCase(resetAll, () => initialState)
      .addCase(getMeAction.rejected, (state) => {
        state = initialState;
      });
  }
});

export default providerSlice.reducer;