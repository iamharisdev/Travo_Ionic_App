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
import { useTranslation } from 'react-i18next';

const CSSprefix = 'verify-email';

const VerifyEmail: React.FC = (): React.ReactElement => {
  const [code, setCode] = useState<string>('');
  const history = useHistory();
  const verifyEmailRef = useRef();
  const {t} = useTranslation();

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
            {t("forgot_password_verify_email")}
            </IonText>
          </IonItem>
          <IonItem className='ion-no-padding' lines='none'>
            <IonText
              color='dark'
              className={`${CSSprefix}-description`}
            >
              {t("forgot_password_verification_code_message")}
            </IonText>
          </IonItem>
          <IonItem lines='none' className='custom-input ion-margin-bottom'>
            <IonLabel position='stacked' class='custom-input'>
            {t("forgot_password_verification_code")}
            </IonLabel>
            <IonInput
              class='custom'
              type='number'
              placeholder={t("forgot_password_enter_your_6_digit_code")}
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
            {t("forgot_password_submit")}
          </IonButton>
          <IonButton
            href={SING_IN}
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

export default VerifyEmail;
