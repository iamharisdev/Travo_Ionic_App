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
import React, { useMemo, useRef, useState } from 'react';
import TrovaLogo from '/assets/TrovaLogo.png';
import { SING_IN, RESET_PASSWORD } from '../../shared/routes/routes';
import { useHistory } from 'react-router';
import UseSwipeGesture from '../../hooks/useSwipeGesture';
import SwipeHandler from '../../components/SwipeHandler/SwipeHandler';

import './VerifyEmail.scss';

const CSSprefix = 'verify-email';

const VerifyEmail: React.FC = (): React.ReactElement => {
  const [code, setCode] = useState<string>('');
  const history = useHistory();
  const verifyEmailRef = useRef();

  const disableButton = useMemo(
    () => code === '',
    [code]
  );

  const { handlers, refPassthrough } = UseSwipeGesture({
    parentRef: verifyEmailRef,
    onSwipedRight: async () => history.push(SING_IN),
  });

  return (
    <IonPage {...handlers} ref={refPassthrough}>
      <SwipeHandler parentRef={verifyEmailRef} />
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
            <IonText className={`${CSSprefix}-title`}>
              Verify email
            </IonText>
          </IonItem>
          <IonItem className='ion-no-padding' lines='none'>
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

export default VerifyEmail;
