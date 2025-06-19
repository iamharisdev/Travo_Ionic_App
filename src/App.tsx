import { IonApp, IonRouterOutlet, setupIonicReact, useIonLoading } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import React, { useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import Tabs from './components/Tabs/Tabs';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import PasswordSuccess from './pages/PasswordSuccess/PasswordSuccess';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import SignIn from './pages/SignIn/SignIn';
import VerifyEmail from './pages/VerifyEmail/VerifyEmail';
import {
  COUNTRY_PICKER,
  DASHBOARD,
  FORGOT_PASSWORD,
  LOADING,
  PASSWORD_CHANGED_SUCCESSFULLY,
  RESET_PASSWORD,
  SING_IN,
  VERIFY_EMAIL,
} from './shared/routes/routes';

import { Device } from '@capacitor/device';
import eruda from 'eruda';
import { useSelector } from 'react-redux';
import { RootState } from './state/store';
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/display.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';

/* Theme variables */
import './global.scss';
import './theme/variables.scss';

/* Big calendar */
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useTranslation } from 'react-i18next';
import './i18n'; // Ensure this is at the top
import CountryPickerScreen from './pages/CountryPicker/CountryPicker';
import Loading from './pages/Loading/Loading';

setupIonicReact();

const App: React.FC = () => {
  const { loading, message } = useSelector((state: RootState) => state.loading);
  const { isCountry, currentEnv } = useSelector((state: RootState) => state.white);

  const [present, dismiss] = useIonLoading();
  const { t } = useTranslation();

  useEffect(() => {
    const initHandler = async () => {
      const info = await Device.getInfo();
      if (
        (info.platform === 'ios' || info.platform === 'android') &&
        currentEnv?.showEruda === true
      ) {
        const el = document.createElement('div');
        document.body.appendChild(el);

        eruda.init({
          container: el,
        });
      }
    };

    initHandler();
  }, []);

  useEffect(() => {
    if (loading) {
      present({
        message,
        spinner: 'bubbles',
        cssClass: 'spinner custom-loading',
      });
    }

    if (!loading) {
      dismiss();
    }
  }, [dismiss, loading, message, present]);

  const hasCountry = (country: string | null) => {
    console.log(country !== null && country !== 'null' && country !== '');
    return country !== null && country !== 'null' && country !== '';
  };
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet defaultValue={COUNTRY_PICKER}>
          <Route path={COUNTRY_PICKER}>
            <CountryPickerScreen />
          </Route>
          <Route path={SING_IN}>
            <SignIn />
          </Route>
          <Route path={LOADING}>
            <Loading />
          </Route>
          <Route path={FORGOT_PASSWORD}>
            <ForgotPassword />
          </Route>
          <Route path={VERIFY_EMAIL}>
            <VerifyEmail />
          </Route>
          <Route path={RESET_PASSWORD}>
            <ResetPassword />
          </Route>
          <Route path={PASSWORD_CHANGED_SUCCESSFULLY}>
            <PasswordSuccess />
          </Route>
          <Route path={DASHBOARD}>
            <Tabs />
          </Route>
          <Route exact path="/">
            {hasCountry(isCountry) ? <Redirect to={SING_IN} /> : <Redirect to={COUNTRY_PICKER} />}
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
