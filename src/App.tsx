import React, { useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact, useIonLoading } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { FORGOT_PASSWORD, DASHBOARD, SING_IN } from './shared/routes/routes';
import SignIn from './pages/SignIn/SignIn';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import Tabs from './components/Tabs/Tabs';
import { useSelector } from 'react-redux';
import { RootState } from './state/store';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.scss';
import './global.scss';

setupIonicReact();

const App: React.FC = () => {
  const { loading, message } = useSelector((state: RootState) => state.loading);
  const [present, dismiss] = useIonLoading();

  useEffect(() => {
    if (loading) {
      present({ message, spinner: "bubbles", cssClass: "spinner" });
    }

    if (!loading) {
      dismiss();
    }
  }, [dismiss, loading, message, present]);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet defaultValue={SING_IN}>
          <Route path={SING_IN}>
            <SignIn />
          </Route>
          <Route path={FORGOT_PASSWORD}>
            <ForgotPassword />
          </Route>
          <Route path={DASHBOARD}>
            <Tabs />
          </Route>
          <Route exact path="/">
            <Redirect to={SING_IN} />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
