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
import TrovaLogo from '../../../public/assets/TrovaLogo.png';

import './ForgotPassword.scss';
import { LOGIN } from '../../shared/routes/routes';

const CSSprefix = 'forgot-password';

const ForgotPassword: React.FC = (): React.ReactElement => {
  const [email, setEmail] = useState<string>('');

  const disableButton = useMemo(
    () => email === '',
    [email]
  );

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className={`${CSSprefix} ion-padding`}>
          <IonItem lines='none'>
            <IonImg
              className={`${CSSprefix}-logo`}
              src={TrovaLogo}
              alt='Trova Logo'
            />
          </IonItem>
          <IonItem lines='none'>
            <IonText className={`${CSSprefix}-forgot-password-title`}>
              Forgot password
            </IonText>
          </IonItem>
          <IonItem lines='none'>
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
              type='text'
              placeholder='Email address'
              onIonInput={(e) => setEmail(e.detail.value || '')}
            />
          </IonItem>
          <IonButton
            className='ion-margin-bottom'
            color='primary'
            disabled={disableButton}
            expand='block'
            onClick={async () => console.log('forgot password')}
          >
            Submit
          </IonButton>
          <IonButton
            href={LOGIN}
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
