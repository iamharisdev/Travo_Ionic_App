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
import { LOGIN, RESET_PASSWORD } from '../../shared/routes/routes';
import { useHistory } from 'react-router';

import './VerifyEmail.scss';

const CSSprefix = 'verify-email';

const VerifyEmail: React.FC = (): React.ReactElement => {
  const [code, setCode] = useState<string>('');
  const history = useHistory();

  const disableButton = useMemo(
    () => code === '',
    [code]
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
            <IonText className={`${CSSprefix}-title`}>
              Verify email
            </IonText>
          </IonItem>
          <IonItem lines='none'>
            <IonText
              color='dark'
              className={`${CSSprefix}-description`}
            >
              For your security, we sent a 6-digit code to your email address. Please enter that code here.
            </IonText>
          </IonItem>
          <IonItem lines='none' className='custom-input ion-margin-bottom'>
            <IonLabel position='stacked' class='custom-input'>
              Verification code
            </IonLabel>
            <IonInput
              class='custom'
              type='number'
              placeholder='Enter your 6 digit code'
              onIonInput={(e) => setCode(e.detail.value || '')}
            />
          </IonItem>
          <IonButton
            className='ion-margin-bottom'
            color='primary'
            disabled={disableButton}
            expand='block'
            onClick={() => history.push(RESET_PASSWORD)}
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

export default VerifyEmail;
