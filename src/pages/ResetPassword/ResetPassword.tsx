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
import { PASSWORD_CHANGED_SUCCESSFULLY, SING_IN } from '../../shared/routes/routes';
import { useHistory } from 'react-router';

import './ResetPassword.scss';

const CSSprefix = 'reset-password';

const ResetPassword: React.FC = (): React.ReactElement => {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const history = useHistory();

  const disableButton = useMemo(
    () => password === '' || confirmPassword === '' || password !== confirmPassword,
    [password, confirmPassword]
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
              Reset password
            </IonText>
          </IonItem>
          <IonItem lines='none'>
            <IonText
              color='dark'
              className={`${CSSprefix}-description`}
            >
              Create your new password. Please, use a minimum of 8 characters with at least one number and special character.
            </IonText>
          </IonItem>
          <IonItem lines="none" className="custom-input ion-margin-bottom">
            <IonLabel position="stacked" class="custom-input">Password</IonLabel>
            <IonInput
              class="custom"
              type="password"
              placeholder="Enter password"
              onIonInput={(e) => setPassword(e.detail.value || '')}
            >
              <IonInputPasswordToggle slot="end" color="dark" />
            </IonInput>
          </IonItem>
          <IonItem lines="none" className="custom-input ion-margin-bottom">
            <IonLabel position="stacked" class="custom-input">Confirm password</IonLabel>
            <IonInput
              class="custom"
              type="password"
              placeholder="Re-enter password"
              onIonInput={(e) => setConfirmPassword(e.detail.value || '')}
            >
              <IonInputPasswordToggle slot="end" color="dark" />
            </IonInput>
          </IonItem>
          <IonButton
            className='ion-margin-bottom'
            color='primary'
            disabled={disableButton}
            expand='block'
            onClick={() => history.push(PASSWORD_CHANGED_SUCCESSFULLY)}
          >
            Reset password
          </IonButton>
          <IonButton
            href={SING_IN}
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

export default ResetPassword;
