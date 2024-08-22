import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { FORGOT_PASSWORD, LANDING, SING_IN, RESET_PASSWORD, VERIFY_EMAIL } from './shared/routes/routes';
import SignIn from './pages/SignIn/SignIn';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import Tabs from './components/Tabs/Tabs';
import VerifyEmail from './pages/VerifyEmail/VerifyEmail';
import ResetPassword from './pages/ResetPassword/ResetPassword';

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

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet defaultValue={SING_IN}>
        <Route exact path={SING_IN}>
          <SignIn />
        </Route>
        <Route exact path={FORGOT_PASSWORD}>
          <ForgotPassword />
        </Route>
        <Route exact path={VERIFY_EMAIL}>
          <VerifyEmail />
        </Route>
        <Route exact path={RESET_PASSWORD}>
          <ResetPassword />
        </Route>
        <Route exact path={LANDING}>
          <Tabs />
        </Route>
        <Route exact path="/">
          <Redirect to={SING_IN} />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
