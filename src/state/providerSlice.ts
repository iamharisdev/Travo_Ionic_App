import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { resetAll } from './common.actions';
import { getProfile } from '../api/services/provider';
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

export interface ProviderState extends ProviderProfileResponse {
  state: StatusState;
}

interface GetProfile {
  practiceId: string;
  providerId: string;
}

const initialState: ProviderState = {
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
  state: {
    success: false,
  }
}

export const getProfileAction = createAsyncThunk(
  'provider/getProfile',
  async ({ practiceId, providerId }: GetProfile): Promise<ProviderState> => {
    try {
      const response = await getProfile(practiceId, providerId);
      console.log('getProfileAction: ', response);

      const payload: ProviderState = {
        ...response.data,
        state: {
          success: true,
        }
      };

      return payload;
    } catch (error: any) {
      console.error('[provider-service]: ', error);
      const payload = { ...initialState, state: { message: error.response.statusText, error, success: false } };

      return payload;
    }
  }
);

const providerSlice = createSlice({
  name: 'provider',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProfileAction.pending, () => console.log('pending get profile'))
      .addCase(getProfileAction.fulfilled, (state, action: PayloadAction<ProviderState>) => {
        state = { ...action.payload }
      })
      .addCase(resetAll, () => initialState)
      .addCase(getProfileAction.rejected, (state) => {
        state = { ...initialState }
      });
  }
});

export default providerSlice.reducer;