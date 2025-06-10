import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { resetAll } from "./common.actions";
import { StatusState } from "../shared/types/state.type";
import {
  getBusinessInformation,
  getCountries,
  getCurrencies,
  getPhoneCodes,
  updateBusinessInformation,
} from "../api/services/practice";

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
  logoUrl: string | null;
  practiceNumber: string;
  subdomain: string;
  fqDomain: string;
}

export interface Country {
  name: string;
  code: string;
}
export interface NewModalCountry {
  [key: string]: string|undefined;
}

export interface PhoneCode {
  countryName: string;
  countryCode: string;
  code: string;
}

export interface Currencies {
  id: string | null;
  name: string;
  code: string;
  symbol: string;
}

interface UpdatebusinessInformation {
  practiceId: string;
  businessInformation: Partial<BusinessInformation>;
}

export interface ProviderState {
  businessInformation: BusinessInformation | null;
  countries: Country;
  phoneCodes: Array<PhoneCode>;
  currencies: Array<Currencies>;
  state: StatusState;
}

const initialState: ProviderState = {
  businessInformation: null,
  countries: {},
  phoneCodes: [],
  currencies: [],
  state: {
    success: false,
  },
};

export const getBusinessInformationAction = createAsyncThunk(
  "practice/getBusinessInformation",
  async (practiceId: string): Promise<BusinessInformation | null> => {
    try {
      const response = await getBusinessInformation(practiceId);

      return response.data;
    } catch (error: any) {
      console.error("[getBusinessInformation]: ", error);
      return null;
    }
  }
);

export const updateBusinessInformationAction = createAsyncThunk(
  "practice/updateBusinessInformation",
  async ({
    practiceId,
    businessInformation,
  }: UpdatebusinessInformation): Promise<Partial<BusinessInformation> | null> => {
    try {
      await updateBusinessInformation(practiceId, businessInformation);

      return businessInformation;
    } catch (error: any) {
      console.error("[updateBusinessInformation]: ", error);

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
  "practice/getPhoneCodes",
  async (): Promise<Array<PhoneCode>> => {
    try {
      const response = await getPhoneCodes();

      return response.data;
    } catch (error: any) {
      console.error("[getPhoneCodes]: ", error);
      return [];
    }
  }
);

export const getCurrenciesAction = createAsyncThunk(
  "practice/getCurrencies",
  async (): Promise<Array<Currencies>> => {
    try {
      const response = await getCurrencies();

      return response.data;
    } catch (error: any) {
      console.error("[getCurrencies]: ", error);
      return [];
    }
  }
);

const practiceSlice = createSlice({
  name: "practice",
  initialState,
  reducers: {
    updateBrandingInformationAction: (
      state,
      action: PayloadAction<{ logoUrl: string | null }>
    ) => {
      if (state.businessInformation) {
        state.businessInformation.logoUrl = action.payload.logoUrl;
        state.state = { success: true };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(resetAll, () => initialState)
      .addCase(getBusinessInformationAction.pending, () =>
        console.log("pending get business information")
      )
      .addCase(
        getBusinessInformationAction.fulfilled,
        (state, action: PayloadAction<BusinessInformation | null>) => {
          state.businessInformation = action.payload;
          state.state = {
            ...state.state,
            success: true,
            error: null,
            message: "",
          };
        }
      )
      .addCase(getBusinessInformationAction.rejected, (state) => {
        state.businessInformation = null;
        state.state = { ...state.state, success: false };
      })
      .addCase(updateBusinessInformationAction.pending, () =>
        console.log("pending update business information")
      )
      .addCase(
        updateBusinessInformationAction.fulfilled,
        (state, action: PayloadAction<Partial<BusinessInformation> | null>) => {
          state.businessInformation = action.payload as BusinessInformation;
          state.state = {
            ...state.state,
            success: true,
            error: null,
            message: "",
          };
        }
      )
      .addCase(updateBusinessInformationAction.rejected, (state) => {
        state.businessInformation = state.businessInformation;
        state.state = {
          ...state.state,
          success: false,
          message: "error at update business information state",
        };
      })
      .addCase(getCountriesAction.pending, () =>
        console.log("pending get countries")
      )
      .addCase(
        getCountriesAction.fulfilled,
        (state, action: PayloadAction<Country>) => {
          state.countries = action.payload;
          state.state = {
            ...state.state,
            success: true,
            error: null,
            message: "",
          };
        }
      )
      .addCase(getCountriesAction.rejected, (state) => {
        state.businessInformation = state.businessInformation;
        state.state = {
          ...state.state,
          success: false,
          message: "error at get countries state",
        };
      })
      .addCase(getPhoneCodesAction.pending, () =>
        console.log("pending get phone codes")
      )
      .addCase(
        getPhoneCodesAction.fulfilled,
        (state, action: PayloadAction<Array<PhoneCode>>) => {
          state.phoneCodes = action.payload;
          state.state = {
            ...state.state,
            success: true,
            error: null,
            message: "",
          };
        }
      )
      .addCase(getPhoneCodesAction.rejected, (state) => {
        state.businessInformation = state.businessInformation;
        state.state = {
          ...state.state,
          success: false,
          message: "error at get phone codes state",
        };
      })
      .addCase(getCurrenciesAction.pending, () =>
        console.log("pending get currencies")
      )
      .addCase(
        getCurrenciesAction.fulfilled,
        (state, action: PayloadAction<Array<Currencies>>) => {
          state.currencies = action.payload;
          state.state = {
            ...state.state,
            success: true,
            error: null,
            message: "",
          };
        }
      )
      .addCase(getCurrenciesAction.rejected, (state) => {
        state.businessInformation = state.businessInformation;
        state.state = {
          ...state.state,
          success: false,
          message: "error at get currencies state",
        };
      });
  },
});

export const { updateBrandingInformationAction } = practiceSlice.actions;

export default practiceSlice.reducer;
