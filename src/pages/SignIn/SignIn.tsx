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
} from "@ionic/react";
import React, { useEffect, useMemo, useState } from "react";
import TrovaLogo from "/assets/TrovaLogo.png";
import { FORGOT_PASSWORD, SING_IN, DASHBOARD } from "../../shared/routes/routes";
import { useHistory, useLocation } from "react-router";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../state/store";
import { AuthState, signInAction } from "../../state/authSlice";
import { setLoading } from "../../state/loadingSlice";
import usePresentToast from "../../hooks/usePresentToast";

import "./SignIn.scss";

const CSSprefix = 'sign-in';

const Login: React.FC = (): React.ReactElement => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showingAnimation, setShowingAnimation] = useState<undefined | boolean>();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const [presentToast] = usePresentToast();

  const disableButton = useMemo(
    () => email === '' || password === '',
    [email, password]
  );

  useEffect(() => {
    if (location.pathname === SING_IN) {
      if (showingAnimation === undefined) {
        setShowingAnimation(true);
      }
      if (showingAnimation) {
        setTimeout(() => setShowingAnimation(false), 1800);
      }
    }
  }, [showingAnimation, location.pathname]);

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className={`${showingAnimation === true ? 'transition-container' : `${CSSprefix}-main-container`} ion-padding`}>
          <IonItem
            lines="none"
            slot="start"
            id={showingAnimation ? 'float' : ''}
            className={showingAnimation ? 'transition-logo-item' : `${CSSprefix}-logo-item`}
          >
            <IonImg
              className={`${CSSprefix}-logo`}
              src={TrovaLogo}
              alt="Trova Logo"
            />
          </IonItem>
          {showingAnimation === false && (
            <>
              <IonItem lines="none" className="ion-no-padding">
                <IonText className={`${CSSprefix}-sign-in`}>
                  Sign in
                </IonText>
              </IonItem>
              <IonItem lines="none" className="ion-no-padding ion-margin-bottom">
                <IonText
                  color="dark"
                  className={`${CSSprefix}-welcome`}
                >
                  Welcome back! Please enter your details.
                </IonText>
              </IonItem>
              <IonItem lines="none" className="custom-input ion-margin-bottom">
                <IonLabel position="stacked" class="custom-input">Email address</IonLabel>
                <IonInput
                  class="custom"
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onIonInput={(e) => setEmail(e.detail.value || "")}
                />
              </IonItem>
              <IonItem lines="none" className="custom-input ion-margin-bottom">
                <IonLabel position="stacked" class="custom-input">Password</IonLabel>
                <IonInput
                  class="custom"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onIonInput={(e) => setPassword(e.detail.value || '')}
                >
                  <IonInputPasswordToggle slot="end" color="dark" />
                </IonInput>
              </IonItem>
              <IonButton
                href={FORGOT_PASSWORD}
                className={`${CSSprefix}-forgot-password`}
                fill="clear"
              >
                Forgot Password?
              </IonButton>
              <IonButton
                className="login-button"
                color="primary"
                disabled={disableButton}
                expand="block"
                onClick={async () => {
                  dispatch(setLoading({ loading: true }));
                  const response = await dispatch(
                    signInAction({
                      email,
                      password,
                    })
                  );

                  if (response.meta.requestStatus === 'fulfilled' && (response.payload as AuthState).success) {
                    dispatch(setLoading({ loading: false }));
                    history.push(DASHBOARD);
                  } else {
                    dispatch(setLoading({ loading: false }));
                    presentToast((response.payload as AuthState).message, 1000, 'top', 'danger');
                  }

                  if (response.meta.requestStatus === 'rejected') {
                    dispatch(setLoading({ loading: false }));
                    presentToast((response.payload as AuthState).message, 1000, 'top', 'danger');
                  }
                }}
              >
                Sign in
              </IonButton>
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
