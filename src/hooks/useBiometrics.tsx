import { AndroidBiometryStrength, BiometricAuth, BiometryError, BiometryErrorType } from "@aparajita/capacitor-biometric-auth"
import { useCallback } from "react";
import { getStorageValue, removeStorageValue } from "../storage/storage.util";
import { STORAGE_TOKEN } from "../constant/storage.constant";
import { LOADING, SING_IN } from "../shared/routes/routes";
import { useHistory, useLocation } from "react-router";
import { useDispatch } from "react-redux";
import { resetAll } from "../state/common.actions";

interface UseBiometrics {
  authenticate: () => Promise<boolean>;
  checkBiometry: () => Promise<boolean>;
  checkSessionHandler: () => Promise<void>;
}

const useBiometrics = (): UseBiometrics => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  async function authenticate(): Promise<boolean> {
    try {
      await BiometricAuth.authenticate({
        reason: 'Please authenticate',
        cancelTitle: 'Cancel',
        allowDeviceCredential: true,
        iosFallbackTitle: 'Use passcode',
        androidTitle: 'Biometric login',
        androidSubtitle: 'Log in using biometric authentication',
        androidConfirmationRequired: false,
        androidBiometryStrength: AndroidBiometryStrength.weak,
      });

      return true;
    } catch (error) {
      // error is always an instance of BiometryError.
      if (error instanceof BiometryError) {
        if (error.code !== BiometryErrorType.userCancel) {
          // Display the error.
          console.error('[biometrics-authenticate]: ', error.message);
          return false;
        }
      }
    }

    return false;
  }

  async function checkBiometry(): Promise<boolean> {
    try {
      const { isAvailable } = await BiometricAuth.checkBiometry();

      return isAvailable;
    } catch (error) {
      console.error('[biometrics-checkBiometry]: ', error);

      return false;
    }
  }

  async function logout(): Promise<void> {
    await removeStorageValue(STORAGE_TOKEN);
    dispatch(resetAll());
    history.push(SING_IN);
  }

  const checkSessionHandler = useCallback(async (): Promise<void> => {
    try {
      const isAvailable = await checkBiometry();
      console.log('isAvailable: ', isAvailable);

      if (isAvailable) {
        const token = await getStorageValue(STORAGE_TOKEN);
        console.log('token: ', token);

        if (token) {
          const authenticated = await authenticate();

          console.log('authenticated: ', authenticated);

          if (authenticated && location.pathname === SING_IN) {
            console.log('redirecting to: ', LOADING);
            history.push(LOADING);
          }

          if (!authenticated) {
            logout();
          }
        }
      }
    } catch (error) {
      console.log('[checkSessionHandler]: ', error);
    }
  }, [location.pathname]);

  return {
    authenticate,
    checkBiometry,
    checkSessionHandler,
  };
}

export default useBiometrics;