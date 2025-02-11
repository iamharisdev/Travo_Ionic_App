import type { CapacitorConfig } from '@capacitor/cli';

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
  }
};

export default config;
