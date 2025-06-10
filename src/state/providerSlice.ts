import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { resetAll } from './common.actions';
import {
  getCountriesForRegion,
  getMe,
  getPractice,
  updatePractice,
} from '../api/services/provider';
import { StatusState } from '../shared/types/state.type';
import { NewModalCountry } from './practiceSlice';

interface GetProfile {
  practiceId: string;
  providerId: string;
}

interface UpdatePractice extends GetProfile {
  practice: Practice;
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

export interface Practice {
  profilePictureUrl?: string | null;
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
  skipAppointmentRequestNotifications?: boolean | null;
  displayTwentyFourHourTime: boolean | null;
  dateFormat: string | null;
}

export interface MeInterface {
  principal: Principal | null;
  providerPractices: Array<ProviderPractices>;
  practice: Practice | null;
  countries: NewModalCountry;
}

export interface ProviderState extends MeInterface {
  state: StatusState;
}

const initialState: ProviderState = {
  principal: null,
  providerPractices: [],
  practice: null,
  countries: {},
  state: {
    success: false,
  },
};

export const getCountriesForRegionAction = createAsyncThunk(
  'practice/getCountriesForRegion',
  async (): Promise<NewModalCountry> => {
    try {
      const response = await getCountriesForRegion();

      // Ensure countries is an object (not a string!)
      const countries: NewModalCountry = response?.data?.countries;

      return countries;
    } catch (error: any) {
      console.error('[getCountries]: ', error);
      return {}; // return an empty object on error
    }
  }
);

export const getMeAction = createAsyncThunk('provider/getMe', async (): Promise<ProviderState> => {
  try {
    let practice: Practice | null = null;
    const response = await getMe();

    if (response.data.providerPractices.length > 0) {
      const [providerPractice] = response.data.providerPractices;
      practice = (await getPractice(providerPractice.practiceId, providerPractice.providerId)).data;
    }

    const payload: ProviderState = {
      principal: response.data.principal,
      providerPractices: response.data.providerPractices,
      practice,
      state: {
        success: true,
      },
    };

    return payload;
  } catch (error: any) {
    console.error('[getMe]: ', error);
    const payload = {
      ...initialState,
      state: { message: error.response.statusText, error, success: false },
    };

    return payload;
  }
});

export const getPracticeAction = createAsyncThunk(
  'provider/getPractice',
  async ({ practiceId, providerId }: GetProfile): Promise<Practice | null> => {
    try {
      const response = await getPractice(practiceId, providerId);

      return response.data;
    } catch (error: any) {
      console.error('[getPractice]: ', error);
      return null;
    }
  }
);

export const updatePracticeAction = createAsyncThunk(
  'provider/updatePractice',
  async ({ practiceId, providerId, practice }: UpdatePractice): Promise<Practice | null> => {
    try {
      await updatePractice(practiceId, providerId, practice);

      return practice;
    } catch (error: any) {
      console.error('[updatePractice]: ', error);

      return null;
    }
  }
);

const providerSlice = createSlice({
  name: 'provider',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getMeAction.pending, () => console.log('pending get profile'))
      .addCase(getMeAction.fulfilled, (state, action: PayloadAction<ProviderState>) => {
        state.principal = action.payload.principal;
        state.providerPractices = action.payload.providerPractices;
        state.practice = action.payload.practice;
        state.state = { ...action.payload.state };
      })
      .addCase(resetAll, () => initialState)
      .addCase(getMeAction.rejected, state => {
        state = initialState;
      })
      .addCase(getPracticeAction.pending, () => console.log('pending get practice'))
      .addCase(getPracticeAction.fulfilled, (state, action: PayloadAction<Practice | null>) => {
        state.practice = action.payload;
        state.state = { ...state.state, success: true, error: null, message: '' };
      })
      .addCase(getPracticeAction.rejected, state => {
        state.practice = null;
        state.state = { ...state.state, success: false };
      })
      .addCase(getCountriesForRegionAction.pending, () => console.log('pending get countries'))
      .addCase(
        getCountriesForRegionAction.fulfilled,
        (state, action: PayloadAction<NewModalCountry>) => {
          state.countries = action.payload;
        }
      )
      .addCase(getCountriesForRegionAction.rejected, state => {
        state.state = {
          ...state.state,
          success: false,
          message: 'error at get countries state',
        };
      })
      .addCase(updatePracticeAction.pending, () => console.log('pending update practice'))
      .addCase(updatePracticeAction.fulfilled, (state, action: PayloadAction<Practice | null>) => {
        state.practice = action.payload;
        state.state = { ...state.state, success: true, error: null, message: '' };
      })
      .addCase(updatePracticeAction.rejected, state => {
        state.practice = state.practice;
        state.state = { ...state.state, success: false, message: 'error at update practice state' };
      });
  },
});

export default providerSlice.reducer;
