import {
  IonButton,
  IonContent,
  IonImg,
  IonItem,
  IonPage,
  IonText,
} from '@ionic/react';
import React from 'react';
import TrovaLogo from '../../../public/assets/TrovaLogo.png';
import { SING_IN } from '../../shared/routes/routes';

import './PasswordSuccess.scss';

const CSSprefix = 'password-success';

const PasswordSuccess: React.FC = (): React.ReactElement => (
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
            Password changed successfully!
          </IonText>
        </IonItem>
        <IonItem lines='none'>
          <IonText
            color='dark'
            className={`${CSSprefix}-description`}
          >
            Congratulations! Your password has been successfully changed.
          </IonText>
        </IonItem>
        <IonButton
          className='ion-margin-bottom'
          color='primary'
          expand='block'
          href={SING_IN}
        >
          Back to sign in
        </IonButton>
      </div>
    </IonContent>
  </IonPage>
);

export default PasswordSuccess;
