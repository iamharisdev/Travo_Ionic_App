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
import React, { useMemo, useRef, useState } from 'react';
import TrovaLogo from '/assets/TrovaLogo.png';
import { PASSWORD_CHANGED_SUCCESSFULLY, SING_IN } from '../../shared/routes/routes';
import { useHistory } from 'react-router';
import UseSwipeGesture from '../../hooks/useSwipeGesture';
import SwipeHandler from '../../components/SwipeHandler/SwipeHandler';

import './ResetPassword.scss';
import { useTranslation } from 'react-i18next';

const CSSprefix = 'reset-password';

const ResetPassword: React.FC = (): React.ReactElement => {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const history = useHistory();
  const resetPasswordRef = useRef();
    const {t} = useTranslation();

  const disableButton = useMemo(
    () => password === '' || confirmPassword === '' || password !== confirmPassword,
    [password, confirmPassword]
  );

  const { handlers, refPassthrough } = UseSwipeGesture({
    parentRef: resetPasswordRef,
    onSwipedRight: async () => history.push(SING_IN),
  });

  return (
    <IonPage {...handlers} ref={refPassthrough}>
      <SwipeHandler parentRef={resetPasswordRef} />
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
            {t("forgot_password_reset_password")}
            </IonText>
          </IonItem>
          <IonItem className='ion-no-padding' lines='none'>
            <IonText
              color='dark'
              className={`${CSSprefix}-description`}
            >
              {t("forgot_password_create_new_password_message")}
            </IonText>
          </IonItem>
          <IonItem lines="none" className="custom-input ion-margin-bottom">
            <IonLabel position="stacked" class="custom-input">{t("login_password")}</IonLabel>
            <IonInput
              class="custom"
              type="password"
              placeholder={t("forgot_password_enter_password")}
              onIonInput={(e) => setPassword(e.detail.value || '')}
            >
              <IonInputPasswordToggle slot="end" color="dark" />
            </IonInput>
          </IonItem>
          <IonItem lines="none" className="custom-input ion-margin-bottom">
            <IonLabel position="stacked" class="custom-input">{t("forgot_password_confirm_password")}</IonLabel>
            <IonInput
              class="custom"
              type="password"
              placeholder={t("forgot_password_re_enter_password")}
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
            {t("forgot_password_reset_password")}
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

export default ResetPassword;
