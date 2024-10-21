import {
  IonButton,
  IonContent,
  IonImg,
  IonItem,
  IonPage,
  IonText,
} from '@ionic/react';
import React, { useRef } from 'react';
import TrovaLogo from '/assets/TrovaLogo.png';
import { SING_IN } from '../../shared/routes/routes';
import UseSwipeGesture from '../../hooks/useSwipeGesture';
import { useHistory } from 'react-router';
import SwipeHandler from '../../components/SwipeHandler/SwipeHandler';

import './PasswordSuccess.scss';

const CSSprefix = 'password-success';

const PasswordSuccess: React.FC = (): React.ReactElement => {
  const passwordSuccessRef = useRef();
  const history = useHistory();

  const { handlers, refPassthrough } = UseSwipeGesture({
    parentRef: passwordSuccessRef,
    onSwipedRight: async () => history.push(SING_IN),
  });

  return (
    <IonPage {...handlers} ref={refPassthrough}>
      <SwipeHandler parentRef={passwordSuccessRef} />
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
              Password changed successfully!
            </IonText>
          </IonItem>
          <IonItem className='ion-no-padding' lines='none'>
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
};

export default PasswordSuccess;
