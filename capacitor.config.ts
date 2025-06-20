import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize, KeyboardStyle } from '@capacitor/keyboard';

const config: CapacitorConfig = {
  appId: 'trovahealth.provider',
  appName: 'Trova',
  webDir: 'dist',
  server: {
    allowNavigation: [
      `${process.env.REACT_APP_ID_API_URL}`,
      `${process.env.REACT_APP_PROVIDER_API_URL}`,
      `${process.env.REACT_APP_PRACTICE_API_URL}`,
      `${process.env.REACT_APP_BILLING_API_URL}`,
      `${process.env.REACT_APP_SCHEDULING_API_URL}`,
    ],
    androidScheme: 'http',
    iosScheme: 'https',
  },
  plugins: {
    Keyboard: {
      resize: KeyboardResize.Native,
      resizeOnFullScreen: true,
    },
  }
};

export default config;
