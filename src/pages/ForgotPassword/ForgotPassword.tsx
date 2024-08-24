import {
  IonButton,
  IonContent,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonText,
} from '@ionic/react';
import React, { useMemo, useState } from 'react';
import { SING_IN, VERIFY_EMAIL } from '../../shared/routes/routes';
import TrovaLogo from '/assets/TrovaLogo.png';
import { useHistory } from 'react-router';

import './ForgotPassword.scss';

const CSSprefix = 'forgot-password';

const ForgotPassword: React.FC = (): React.ReactElement => {
  const [email, setEmail] = useState<string>('');
  const history = useHistory();

  const disableButton = useMemo(
    () => email === '',
    [email]
  );

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className={`${CSSprefix} ion-padding`}>
          <IonItem className='ion-no-padding' lines='none'>
            <IonImg
              className={`${CSSprefix}-logo`}
              src={TrovaLogo}
              alt='Trova Logo'
            />
          </IonItem>
          <IonItem className='ion-no-padding' lines='none'>
            <IonText className={`${CSSprefix}-forgot-password-title`}>
              Forgot password
            </IonText>
          </IonItem>
          <IonItem className='ion-no-padding' lines='none'>
            <IonText
              color='dark'
              className={`${CSSprefix}-description`}
            >
              Enter your email address to reset your password.
            </IonText>
          </IonItem>
          <IonItem lines='none' className='custom-input ion-margin-bottom'>
            <IonLabel position='stacked' class='custom-input'>
              Enter your registered email address
            </IonLabel>
            <IonInput
              class='custom'
              type='email'
              placeholder='Email address'
              onIonInput={(e) => setEmail(e.detail.value || '')}
            />
          </IonItem>
          <IonButton
            className='ion-margin-bottom'
            color='primary'
            disabled={disableButton}
            expand='block'
            onClick={() => history.push(VERIFY_EMAIL)}
          >
            Submit
          </IonButton>
          <IonButton
            onClick={() => history.push(SING_IN)}
            className={`${CSSprefix}-back-to-sign-in`}
            fill='clear'
          >
            Back to Sign in
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ForgotPassword;
