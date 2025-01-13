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
  useIonViewWillEnter,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import TrovaLogo from "/assets/TrovaLogo.png";
import { SING_IN, LOADING } from "../../shared/routes/routes";
import { useHistory, useLocation } from "react-router";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../state/store";
import { AuthState, signInAction } from "../../state/authSlice";
import { setLoading } from "../../state/loadingSlice";
import usePresentToast from "../../hooks/usePresentToast";
import { useFormik } from "formik";
import { signInSchema } from "./validation/signIn.schema";
import useBiometrics from "../../hooks/useBiometrics";

import "./SignIn.scss";

const CSSprefix = 'sign-in';

const Login: React.FC = (): React.ReactElement => {
  const [showingAnimation, setShowingAnimation] = useState<undefined | boolean>();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const [presentToast] = usePresentToast();
  const { checkSessionHandler } = useBiometrics();

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

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: signInSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        dispatch(setLoading({ loading: true }));
        const response = await dispatch(
          signInAction({
            email: values.email,
            password: values.password,
          })
        );
        if (response.meta.requestStatus === 'fulfilled' && (response.payload as AuthState).success) {
          dispatch(setLoading({ loading: false }));
          history.push(LOADING);
        } else {
          dispatch(setLoading({ loading: false }));
          presentToast('Username/Password combination is not correct', 3000, 'middle', 'danger');
        }

        if (response.meta.requestStatus === 'rejected') {
          dispatch(setLoading({ loading: false }));
          presentToast('Username/Password combination is not correct', 3000, 'middle', 'danger');
        }
      } catch (error) {
        formik.resetForm();
        dispatch(setLoading({ loading: false, message: undefined }));
        presentToast(
          'Username/Password combination is not correct',
          3000,
          'middle',
          'danger'
        );
      }
    },
  });

  useIonViewWillEnter(() => {
    formik.resetForm();
    checkSessionHandler();
  }, []);

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
              <IonItem lines="none" className={`custom-input ion-margin-bottom ${CSSprefix}-sign-in-item`}>
                <IonLabel position="stacked" class="custom-input">Email address</IonLabel>
                <IonInput
                  className={`${formik.errors?.email && 'ion-invalid'} ${formik.touched?.email && 'ion-touched'}`}
                  name="email"
                  class="custom"
                  type="email"
                  placeholder="Enter email address"
                  errorText={formik.errors?.email}
                  value={formik.values.email}
                  onIonInput={(e) => formik.setFieldValue('email', e.detail.value || '')}
                />
              </IonItem>
              <IonItem lines="none" className={`custom-input ion-margin-bottom ${CSSprefix}-sign-in-item`}>
                <IonLabel position="stacked" class="custom-input">Password</IonLabel>
                <IonInput
                  className={`${formik.errors?.password && 'ion-invalid'} ${formik.touched?.password && 'ion-touched'}`}
                  name="password"
                  class="custom"
                  type="password"
                  placeholder="Enter your password"
                  errorText={formik.errors?.password}
                  value={formik.values.password}
                  onIonInput={(e) => formik.setFieldValue('password', e.detail.value || '')}
                >
                  <IonInputPasswordToggle slot="end" color="dark" />
                </IonInput>
              </IonItem>
              <IonButton
                href={process.env.REACT_APP_FORGOT_PASSWORD_URL}
                className={`${CSSprefix}-forgot-password`}
                fill="clear"
                target="blank_state"
              >
                Forgot Password?
              </IonButton>
              <IonButton
                className="login-button"
                color="primary"
                disabled={!formik.dirty}
                expand="block"
                onClick={() => formik.submitForm()}
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
