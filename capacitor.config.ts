import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize} from '@capacitor/keyboard';

const config: CapacitorConfig = {
  appId: 'trovahealth.provider',
  appName: 'Trova',
  webDir: 'dist',
  server: {
    allowNavigation: ['*'],
    // allowNavigation: [
    //   `${process.env.REACT_APP_ID_API_URL}`,
    //   `${process.env.REACT_APP_PROVIDER_API_URL}`,
    //   `${process.env.REACT_APP_PRACTICE_API_URL}`,
    //   `${process.env.REACT_APP_BILLING_API_URL}`,
    //   `${process.env.REACT_APP_SCHEDULING_API_URL}`,
    //   'https://id.trovahealth.app/',
    //   'https://providerapi.trovahealth.app/api/v1/',
    //   'https://practiceapi.trovahealth.app/api/v1/'
    // ],
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
