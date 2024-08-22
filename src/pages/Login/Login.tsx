import {
  IonButton,
  IonContent,
  IonImg,
  IonInput,
  IonInputPasswordToggle,
  IonItem,
  IonLabel,
  IonPage,
  IonText,
} from '@ionic/react';
import React, { useMemo, useState } from 'react';
import TrovaLogo from '../../../public/assets/TrovaLogo.png';

import './Login.scss';

const CSSprefix = 'login';

const Login: React.FC = (): React.ReactElement => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const disableButton = useMemo(
    () => email === '' || password === '',
    [email, password]
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
            <IonText className={`${CSSprefix}-sign-in`}>
              Sign in
            </IonText>
          </IonItem>
          <IonItem lines='none'>
            <IonText
              color='dark'
              className={`${CSSprefix}-welcome`}
            >
              Welcome back! Please enter your details.
            </IonText>
          </IonItem>
          <IonItem lines='none' className='custom-input ion-margin-bottom'>
            <IonLabel position='stacked' class='custom-input'>Email address</IonLabel>
            <IonInput
              class='custom'
              type='email'
              placeholder='Enter email address'
              onIonInput={(e) => setEmail(e.detail.value || '')}
            />
          </IonItem>
          <IonItem lines='none' className='custom-input ion-margin-bottom'>
            <IonLabel position='stacked' class='custom-input'>Password</IonLabel>
            <IonInput
              class='custom'
              type='password'
              placeholder='Enter your password'
              onIonInput={(e) => setPassword(e.detail.value || '')}
            >
              <IonInputPasswordToggle slot='end' color='dark' />
            </IonInput>
          </IonItem>
          <IonButton
            href='/'
            className={`${CSSprefix}-forgot-password`}
            fill='clear'
          >
            Forgot Password?
          </IonButton>
          <IonButton
            className='login-button'
            color='primary'
            disabled={disableButton}
            expand='block'
            onClick={async () => console.log('login')}
          >
            Sign in
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
