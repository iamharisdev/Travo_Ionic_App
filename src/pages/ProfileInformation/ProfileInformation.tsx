import React, { useMemo } from "react";
import {
  IonAvatar,
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTextarea,
} from "@ionic/react";
import { useFormik } from 'formik';
import Header from "../../components/Header/Header";
import { caretDownOutline, caretUpOutline } from "ionicons/icons";
import PersonSvg from '/assets/person-circle.svg';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import usePresentToast from "../../hooks/usePresentToast";
import { setLoading } from "../../state/loadingSlice";
import { updatePracticeAction } from "../../state/providerSlice";
import { practiceUpdateSchema } from "./validation/profileInformation.schema";

import "./ProfileInformation.scss";

const CSSprefix = 'profile-information';

const ProfileInformation: React.FC = (): React.ReactElement => {
  const { provider } = useSelector((state: RootState) => state);
  const dispatch = useDispatch<AppDispatch>();
  const [presentToast] = usePresentToast();
  const initialValues = useMemo(() => provider.practice || {
    firstName: '',
    lastName: '',
    displayName: '',
    languages: '',
    qualificationsAndTitle: '',
    bio: '',
    preferredCurrency: '',
    phoneNumber: '',
    phoneNumberPrefix: '',
    userName: '',
  }, [provider.practice]);
  const { practiceId, providerId }: {
    practiceId?: string;
    providerId?: string;
  } = useMemo(() => {
    if (provider.providerPractices.length > 0) {
      const [providerPractice] = provider.providerPractices;
      return {
        practiceId: providerPractice.practiceId,
        providerId: providerPractice.providerId
      }
    }

    return {}
  }, [provider.providerPractices]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const valid = await practiceUpdateSchema.validate(values);

      if (practiceId && providerId && valid) {
        dispatch(setLoading({ loading: true }));
        const response = await dispatch(updatePracticeAction({ practiceId, providerId, practice: values }));

        if (response.meta.requestStatus === 'fulfilled') {
          dispatch(setLoading({ loading: false, message: undefined }));
        }

        if (response.meta.requestStatus === 'rejected') {
          presentToast(
            '¡Error at update practice!',
            1000,
            'top',
            'danger'
          );
        }
        dispatch(setLoading({ loading: false, message: undefined }));
      }
    },
  });

  return (
    <IonPage className={CSSprefix}>
      <Header showBack showMenu={false} />
      <IonContent className={CSSprefix}>
        <IonItem className="ion-margin-vertical" lines="none">
          <IonText className={`${CSSprefix}-title ion-margin-top`}>
            My profile information
          </IonText>
        </IonItem>
        <IonList>
          <IonRow className="ion-justify-content-center">
            <IonAvatar>
              <img
                alt="person"
                src={PersonSvg}
              />
            </IonAvatar>
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonItem lines="none">
              <IonButton fill="clear" color="primary">Upload photo</IonButton>
              <div className={`${CSSprefix}-divider`} />
              <IonButton fill="clear" color="danger">Remove photo</IonButton>
            </IonItem>
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonText className={`${CSSprefix}-image-description`}>
              Preferred image size: 240px x 240px @ 72DPI
              Maximum size of 1MB.
            </IonText>
          </IonRow>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical ${CSSprefix}-form-item`}
          >
            <IonLabel position="stacked" class="custom-input">First name*</IonLabel>
            <IonInput
              name="firstName"
              class="custom"
              type="text"
              placeholder="Enter first name"
              value={formik.values.firstName}
              onIonInput={(e) => formik.setFieldValue('firstName', e.detail.value)}
            />
          </IonItem>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical ${CSSprefix}-form-item`}
          >
            <IonLabel position="stacked" class="custom-input">Last name*</IonLabel>
            <IonInput
              name="lastName"
              class="custom"
              type="text"
              placeholder="Enter last name"
              value={formik.values.lastName}
              onIonInput={(e) => formik.setFieldValue('lastName', e.detail.value)}
            />
          </IonItem>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical ${CSSprefix}-form-item`}
          >
            <IonLabel position="stacked" class="custom-input">Mobile</IonLabel>
            <IonItem
              lines="none"
              className={`${CSSprefix}-nested-item`}
            >
              <IonSelect
                name="phoneNumberPrefix"
                placeholder="Country Code"
                toggleIcon={caretDownOutline}
                expandedIcon={caretUpOutline}
                selectedText={formik.values.phoneNumberPrefix}
                value={formik.values.phoneNumberPrefix}
                onIonChange={(e) => formik.setFieldValue('phoneNumberPrefix', e.detail.value)}
              >
                <IonSelectOption value="+52">+52</IonSelectOption>
                <IonSelectOption value="+53">+53</IonSelectOption>
                <IonSelectOption value="+54">+54</IonSelectOption>
              </IonSelect>
              <IonInput
                name="phoneNumber"
                class="custom"
                type="number"
                placeholder="Number"
                value={formik.values.phoneNumber}
                onIonInput={(e) => formik.setFieldValue('phoneNumber', e.detail.value)}
              />

            </IonItem>
          </IonItem>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical ${CSSprefix}-form-item`}
          >
            <IonLabel position="stacked" class="custom-input">Display name*</IonLabel>
            <IonInput
              name="displayName"
              class="custom"
              type="text"
              placeholder="Enter display name"
              value={formik.values.displayName}
              onIonInput={(e) => formik.setFieldValue('displayName', e.detail.value)}
            />
          </IonItem>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical ${CSSprefix}-form-item`}
          >
            <IonLabel position="stacked" class="custom-input">Qualifications and titles</IonLabel>
            <IonInput
              name="qualificationsAndTitle"
              class="custom"
              type="text"
              placeholder="Enter qualifications and titles"
              value={formik.values.qualificationsAndTitle}
              onIonInput={(e) => formik.setFieldValue('qualificationsAndTitle', e.detail.value)}
            />
          </IonItem>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical ${CSSprefix}-form-item`}
          >
            <IonLabel position="stacked" class="custom-input">Currency*</IonLabel>
            <IonSelect
              name="preferredCurrency"
              placeholder="Enter currency"
              toggleIcon={caretDownOutline}
              expandedIcon={caretUpOutline}
              selectedText={formik.values.preferredCurrency}
              value={formik.values.preferredCurrency}
              onIonChange={(e) => formik.setFieldValue('preferredCurrency', e.detail.value)}
            >
              <IonSelectOption value="AUD">AUD</IonSelectOption>
              <IonSelectOption value="BRL">BRL</IonSelectOption>
              <IonSelectOption value="ZAR">ZAR</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical ${CSSprefix}-form-item`}
          >
            <IonLabel position="stacked" class="custom-input">Bio*</IonLabel>
            <IonTextarea
              name="bio"
              autoGrow
              aria-label="bio"
              value={formik.values.bio}
              onIonInput={(e) => formik.setFieldValue('bio', e.detail.value)}
            />
          </IonItem>
          <IonButton
            className={`${CSSprefix}-save-button`}
            color="primary"
            expand="block"
            disabled={!formik.dirty}
            onClick={() => formik.submitForm()}
          >
            Save details
          </IonButton>
        </IonList>
      </IonContent>
    </IonPage >
  );
};

export default ProfileInformation;
