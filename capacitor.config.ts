import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'trova-provider-mobile',
  appName: 'trova-provider-mobile',
  webDir: 'dist',
  server: {
    allowNavigation: [
      `${process.env.REACT_APP_ID_API_URL}`,
      `${process.env.REACT_APP_PROVIDER_API_URL}`,
      `${process.env.REACT_APP_PRACTICE_API_URL}`,
    ],
    androidScheme: 'https',
    iosScheme: 'https',
  }
};

export default config;
