import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { resetAll } from './common.actions';
import { StatusState } from '../shared/types/state.type';
import { searchPatient } from '../api/services/patient';

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  dob: string;
  gender: string;
  archived: boolean;
  language: string | null;
  countryName: string;
  countryCode: string;
  mobileNumberPrefix: string;
  icd10Code: string | null;
  icd10Description: string | null;
  externalPatientId: string | null;
  patientNumber: string;
  addressLineOne: string | null;
  addressLineTwo: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  createdDate: string;
  countrySpecificFields: string | null;
  contacts: Array<string>;
  customFields: Array<string>;
}

export interface ProviderState {
  patients: Array<Patient>;
  state: StatusState;
}

const initialState: ProviderState = {
  patients: [
    {
      id: "dc75eb8d-b31a-4e02-b17a-cddd63e68841",
      firstName: "Jane",
      lastName: "Doe",
      email: "test@test.com",
      mobileNumber: "5463826289",
      dob: "2001-11-04",
      gender: "female",
      archived: false,
      language: null,
      countryName: "Australia",
      countryCode: "AU",
      mobileNumberPrefix: "+43",
      icd10Code: null,
      icd10Description: null,
      externalPatientId: null,
      patientNumber: "00003123",
      addressLineOne: null,
      addressLineTwo: null,
      city: null,
      state: null,
      zipCode: null,
      createdDate: "2024-09-18T20:36:12.674149300Z",
      countrySpecificFields: null,
      contacts: [],
      customFields: []
    }
  ],
  state: {
    success: false,
  }
}

export const searchPatientAction = createAsyncThunk(
  'practice/searchPatient',
  async ({ practiceId, patient }: { practiceId: string, patient: string }): Promise<Array<Patient>> => {
    try {
      const response = await searchPatient(practiceId, patient);

      return response.data;
    } catch (error: any) {
      console.error('[searchPatient]: ', error);
      return [];
    }
  }
);

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(resetAll, () => initialState)
      .addCase(searchPatientAction.pending, () => console.log('pending get business information'))
      .addCase(searchPatientAction.fulfilled, (state, action: PayloadAction<Array<Patient>>) => {
        state.patients = action.payload;
        state.state = { ...state.state, success: true, error: null, message: '' };
      })
      .addCase(searchPatientAction.rejected, (state) => {
        state.patients = [];
        state.state = { ...state.state, success: false }
      });
  }
});

export default patientSlice.reducer;