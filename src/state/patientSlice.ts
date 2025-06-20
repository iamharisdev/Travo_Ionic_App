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
  patients: [],
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
      .addCase(searchPatientAction.pending, () => console.log('pending search patient'))
      .addCase(searchPatientAction.fulfilled, (state, action: PayloadAction<Array<Patient>>) => {
        const newPatients = [...state.patients];
        if (action.payload.length > 0) {
          action.payload.forEach((patient) => {
            if (!state.patients.some(({ id }) => id === patient.id)) {
              newPatients.push(patient);
            }
          })
        }

        state.patients = newPatients;
        state.state = { ...state.state, success: true, error: null, message: '' };
      })
      .addCase(searchPatientAction.rejected, (state) => {
        state.patients = [];
        state.state = { ...state.state, success: false }
      });
  }
});

export default patientSlice.reducer;