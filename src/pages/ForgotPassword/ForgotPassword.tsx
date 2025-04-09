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
import { SING_IN, VERIFY_EMAIL } from '../../shared/routes/routes';
import TrovaLogo from '/assets/TrovaLogo.png';
import { useHistory } from 'react-router';
import UseSwipeGesture from '../../hooks/useSwipeGesture';
import SwipeHandler from '../../components/SwipeHandler/SwipeHandler';

import './ForgotPassword.scss';
import { useTranslation } from 'react-i18next';

const CSSprefix = 'forgot-password';

const ForgotPassword: React.FC = (): React.ReactElement => {
  const [email, setEmail] = useState<string>('');
  const history = useHistory();
  const forgotPasswordRef = useRef();
  const {t} = useTranslation();
  

  const disableButton = useMemo(
    () => email === '',
    [email]
  );

  const { handlers, refPassthrough } = UseSwipeGesture({
    parentRef: forgotPasswordRef,
    onSwipedRight: async () => history.push(SING_IN),
  });

  return (
    <IonPage {...handlers} ref={refPassthrough}>
      <SwipeHandler parentRef={forgotPasswordRef} />
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
            {t("forgot_password")}
            </IonText>
          </IonItem>
          <IonItem className='ion-no-padding' lines='none'>
            <IonText
              color='dark'
              className={`${CSSprefix}-description`}
            >
              {t("forgot_password_enter_email_to_reset")}
            </IonText>
          </IonItem>
          <IonItem lines='none' className='custom-input ion-margin-bottom'>
            <IonLabel position='stacked' class='custom-input'>
            {t("forgot_password_enter_registered_email")}
            </IonLabel>
            <IonInput
              class='custom'
              type='email'
              placeholder={t("login_email_address")}
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
            {t("forgot_password_submit")}
          </IonButton>
          <IonButton
            onClick={() => history.push(SING_IN)}
            className={`${CSSprefix}-back-to-sign-in`}
            fill='clear'
          >
            {t("forgot_password_back_to_sign_in")}
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ForgotPassword;
