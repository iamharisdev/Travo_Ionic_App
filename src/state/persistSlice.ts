import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ENV_CONFIGS } from "../config/envConfig";

type EnvSubKey = keyof typeof ENV_CONFIGS.default;
interface EnvState {
  isCountry: string | null;
  currentEnv: typeof ENV_CONFIGS.default.dev; // shape of the env config (one env object)
  envMode: EnvSubKey;
}

const initialState: EnvState = {
  isCountry: null,
  envMode: "dev",
  currentEnv: ENV_CONFIGS.default.dev,
};

const whiteSlice = createSlice({
  name: "white",
  initialState,
  reducers: {
    setCountryFlag(state, action: PayloadAction<string | null>) {
      state.isCountry = action.payload;
    },
    setEnvByCountry(
      state,
      action: PayloadAction<{ countryCode: string; mode: EnvSubKey }>
    ) {
      const { countryCode, mode } = action.payload;
      const region = countryCode.toLowerCase() === "br" ? "br" : "default";

      state.envMode = mode;

      // Safely get env config, fallback to default dev if missing
      const envConfig = ENV_CONFIGS[region]?.[mode] || ENV_CONFIGS.default.dev;
      console.log(envConfig);

      state.currentEnv = envConfig;
    },
  },
});

export const { setCountryFlag,setEnvByCountry } = whiteSlice.actions;

export default whiteSlice.reducer;
