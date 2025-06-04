import { PayloadAction, createSlice } from "@reduxjs/toolkit";



interface EnvState {
  isCountry: string | null;
  
}

const initialState: EnvState = {
  isCountry: null,
 
};

const whiteSlice = createSlice({
  name: "white",
  initialState,
  reducers: {
    setCountryFlag(state, action: PayloadAction<string | null>) {
      state.isCountry = action.payload;
    },
    
  },
});

export const { setCountryFlag} = whiteSlice.actions;

export default whiteSlice.reducer;
