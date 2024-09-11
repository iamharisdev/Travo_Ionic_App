import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { resetAll } from './common.actions';
import { StatusState } from '../shared/types/state.type';
import { getBusinessInformation, getCountries, getPhoneCodes, updateBusinessInformation } from '../api/services/practice';

export interface BusinessInformation {
  id: string;
  legalName: string;
  country: string;
  addressLineOne: string;
  addressLineTwo: string;
  city: string;
  state: string;
  zipCode: string;
  timeZone: string;
  primaryColor: string | null;
  secondaryColor: string | null;
  logoUrl: string;
  practiceNumber: string;
  subdomain: string;
  fqDomain: string;
}

export interface Country {
  name: string;
  code: string;
}

export interface PhoneCode {
  countryName: string;
  countryCode: string;
  code: string;
}

interface UpdatebusinessInformation {
  practiceId: string;
  businessInformation: Partial<BusinessInformation>;
}

export interface ProviderState {
  businessInformation: BusinessInformation | null;
  countries: Array<Country>;
  phoneCodes: Array<PhoneCode>;
  state: StatusState;
}

const initialState: ProviderState = {
  businessInformation: null,
  countries: [],
  phoneCodes: [],
  state: {
    success: false,
  }
}

export const getBusinessInformationAction = createAsyncThunk(
  'practice/getBusinessInformation',
  async (practiceId: string): Promise<BusinessInformation | null> => {
    try {
      const response = await getBusinessInformation(practiceId);

      return response.data;
    } catch (error: any) {
      console.error('[getBusinessInformation]: ', error);
      return null;
    }
  }
);

export const updateBusinessInformationAction = createAsyncThunk(
  'practice/updateBusinessInformation',
  async ({ practiceId, businessInformation }: UpdatebusinessInformation): Promise<Partial<BusinessInformation> | null> => {
    try {
      await updateBusinessInformation(practiceId, businessInformation);

      return businessInformation;
    } catch (error: any) {
      console.error('[updateBusinessInformation]: ', error);

      return null;
    }
  }
);

export const getCountriesAction = createAsyncThunk(
  'practice/getCountries',
  async (): Promise<Array<Country>> => {
    try {
      const response = await getCountries();

      return response.data;
    } catch (error: any) {
      console.error('[getCountries]: ', error);
      return [];
    }
  }
);

export const getPhoneCodesAction = createAsyncThunk(
  'practice/getPhoneCodes',
  async (): Promise<Array<PhoneCode>> => {
    try {
      const response = await getPhoneCodes();

      return response.data;
    } catch (error: any) {
      console.error('[getPhoneCodes]: ', error);
      return [];
    }
  }
);

const practiceSlice = createSlice({
  name: 'practice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(resetAll, () => initialState)
      .addCase(getBusinessInformationAction.pending, () => console.log('pending get business information'))
      .addCase(getBusinessInformationAction.fulfilled, (state, action: PayloadAction<BusinessInformation | null>) => {
        state.businessInformation = action.payload;
        state.state = { ...state.state, success: true, error: null, message: '' };
      })
      .addCase(getBusinessInformationAction.rejected, (state) => {
        state.businessInformation = null;
        state.state = { ...state.state, success: false }
      })
      .addCase(updateBusinessInformationAction.pending, () => console.log('pending update business information'))
      .addCase(updateBusinessInformationAction.fulfilled, (state, action: PayloadAction<Partial<BusinessInformation> | null>) => {
        state.businessInformation = action.payload as BusinessInformation;
        state.state = { ...state.state, success: true, error: null, message: '' };
      })
      .addCase(updateBusinessInformationAction.rejected, (state) => {
        state.businessInformation = state.businessInformation;
        state.state = { ...state.state, success: false, message: 'error at update business information state' }
      })
      .addCase(getCountriesAction.pending, () => console.log('pending get countries'))
      .addCase(getCountriesAction.fulfilled, (state, action: PayloadAction<Array<Country>>) => {
        state.countries = action.payload;
        state.state = { ...state.state, success: true, error: null, message: '' };
      })
      .addCase(getCountriesAction.rejected, (state) => {
        state.businessInformation = state.businessInformation;
        state.state = { ...state.state, success: false, message: 'error at get countries state' }
      })
      .addCase(getPhoneCodesAction.pending, () => console.log('pending get phone codes'))
      .addCase(getPhoneCodesAction.fulfilled, (state, action: PayloadAction<Array<PhoneCode>>) => {
        state.phoneCodes = action.payload;
        state.state = { ...state.state, success: true, error: null, message: '' };
      })
      .addCase(getPhoneCodesAction.rejected, (state) => {
        state.businessInformation = state.businessInformation;
        state.state = { ...state.state, success: false, message: 'error at get phone codes state' }
      });
  }
});

export default practiceSlice.reducer;