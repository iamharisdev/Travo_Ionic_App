import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'trova-provider-mobile',
  appName: 'trova-provider-mobile',
  webDir: 'dist',
  server: {
    allowNavigation: [`${process.env.REACT_APP_API_URL}`],
    androidScheme: 'https',
    iosScheme: 'https',
  }
};

export default config;
