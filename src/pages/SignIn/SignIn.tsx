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
import { SING_IN, LOADING, COUNTRY_PICKER } from "../../shared/routes/routes";
import { useHistory, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import { AuthState, signInAction } from "../../state/authSlice";
import { setLoading } from "../../state/loadingSlice";
import usePresentToast from "../../hooks/usePresentToast";
import { useFormik } from "formik";
import { signInSchema } from "./validation/signIn.schema";
import useBiometrics from "../../hooks/useBiometrics";
import { isNative } from "../../shared/utils/native.util";

import "./SignIn.scss";
import { useTranslation } from "react-i18next";
import { setCountryFlag } from "../../state/persistSlice";

const CSSprefix = "sign-in";

const Login: React.FC = (): React.ReactElement => {
  const [showingAnimation, setShowingAnimation] = useState<
    undefined | boolean
  >();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const [presentToast] = usePresentToast();
  const { checkSessionHandler } = useBiometrics();
  const { t } = useTranslation();
  const { currentEnv } = useSelector((state: RootState) => state.white);

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
      email: "",
      password: "",
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
        if (
          response.meta.requestStatus === "fulfilled" &&
          (response.payload as AuthState).success
        ) {
          dispatch(setLoading({ loading: false }));
          history.push(LOADING);
        } else {
          dispatch(setLoading({ loading: false }));
          presentToast(
            `${t("login_username/password_error")}`,
            3000,
            "middle",
            "danger"
          );
        }

        if (response.meta.requestStatus === "rejected") {
          dispatch(setLoading({ loading: false }));
          presentToast(
            `${t("login_username/password_error")}`,
            3000,
            "middle",
            "danger"
          );
        }
      } catch (error) {
        formik.resetForm();
        dispatch(setLoading({ loading: false, message: undefined }));
        presentToast(
          `${t("login_username/password_error")}`,
          3000,
          "middle",
          "danger"
        );
      }
    },
  });

  useIonViewWillEnter(() => {
    formik.resetForm();
    isNative().then((isNative) => {
      if (location.pathname === SING_IN && isNative) {
        checkSessionHandler();
      }
    });
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen>
        <div
          className={`${
            showingAnimation === true
              ? "transition-container"
              : `${CSSprefix}-main-container`
          } ion-padding`}
        >
          <IonItem
            lines="none"
            slot="start"
            id={showingAnimation ? "float" : ""}
            className={
              showingAnimation
                ? "transition-logo-item"
                : `${CSSprefix}-logo-item`
            }
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
                  {t("login_sign_in")}
                </IonText>
              </IonItem>
              <IonItem
                lines="none"
                className="ion-no-padding ion-margin-bottom"
              >
                <IonText color="dark" className={`${CSSprefix}-welcome`}>
                  {t("login_welcome_message")}
                </IonText>
              </IonItem>
              <IonItem
                lines="none"
                className={`custom-input ion-margin-bottom ${CSSprefix}-sign-in-item`}
              >
                <IonLabel position="stacked" class="custom-input">
                  {t("login_email_address")}
                </IonLabel>
                <IonInput
                  className={`${formik.errors?.email && "ion-invalid"} ${
                    formik.touched?.email && "ion-touched"
                  }`}
                  name="email"
                  class="custom"
                  type="email"
                  placeholder={t("login_enter_email_address")}
                  errorText={formik.errors?.email}
                  value={formik.values.email}
                  onIonInput={(e) =>
                    formik.setFieldValue("email", e.detail.value || "")
                  }
                />
              </IonItem>
              <IonItem
                lines="none"
                className={`custom-input ion-margin-bottom ${CSSprefix}-sign-in-item`}
              >
                <IonLabel position="stacked" class="custom-input">
                  {t("login_password")}
                </IonLabel>
                <IonInput
                  className={`${formik.errors?.password && "ion-invalid"} ${
                    formik.touched?.password && "ion-touched"
                  }`}
                  name="password"
                  class="custom"
                  type="password"
                  placeholder={t("login_enter_your_password")}
                  errorText={formik.errors?.password}
                  value={formik.values.password}
                  onIonInput={(e) =>
                    formik.setFieldValue("password", e.detail.value || "")
                  }
                >
                  <IonInputPasswordToggle slot="end" color="dark" />
                </IonInput>
              </IonItem>
              <IonButton
                href={currentEnv?.forgotPasswordUrl}
                className={`${CSSprefix}-forgot-password`}
                fill="clear"
                target="blank_state"
              >
                {t("login_forgot_password?")}
              </IonButton>
              <IonButton
                className="login-button"
                color="primary"
                disabled={!formik.dirty}
                expand="block"
                onClick={() => formik.submitForm()}
                //      onClick={()=>{
                //       dispatch(setCountryFlag(null))
                //  history.replace(COUNTRY_PICKER)
                // }}
              >
                {t("login_sign_in")}
              </IonButton>
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
