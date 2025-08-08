import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ENV_CONFIGS } from '../config/envConfig';
import { set } from 'lodash';

type EnvSubKey = keyof typeof ENV_CONFIGS.default;
interface EnvState {
  isCountry: string | null;
  currentEnv: typeof ENV_CONFIGS.default.dev; // shape of the env config (one env object)
  envMode: EnvSubKey;
  lang: string;
}

const initialState: EnvState = {
  isCountry: null,
  envMode: 'dev',
  currentEnv: ENV_CONFIGS.default.dev,
  lang: 'en',
};

const whiteSlice = createSlice({
  name: 'white',
  initialState,
  reducers: {
    setCountryFlag(state, action: PayloadAction<string | null>) {
      state.isCountry = action.payload;
    },

    setEnvByCountry(state, action: PayloadAction<{ countryCode: string; mode: EnvSubKey }>) {
      const { countryCode, mode } = action.payload;
      const region = countryCode.toLowerCase() === 'br' ? 'br' : 'default';
      state.envMode = mode;
      const envConfig = ENV_CONFIGS[region]?.[mode] || ENV_CONFIGS.default.dev;
      state.currentEnv = envConfig;
    },
    setLang(state, action: PayloadAction<string>) {
      state.lang = action.payload;
    },
  },
});

export const { setCountryFlag, setEnvByCountry, setLang } = whiteSlice.actions;

export default whiteSlice.reducer;
