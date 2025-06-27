import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize} from '@capacitor/keyboard';

const config: CapacitorConfig = {
  appId: 'trovahealth.provider',
  appName: 'Trova',
  webDir: 'dist',
  server: {
    url: "http://localhost:5173",
    cleartext: true,
    allowNavigation: ['*'],
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
