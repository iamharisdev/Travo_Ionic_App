import React, { useMemo, useRef, useState } from 'react';
import {
  ActionSheetButton,
  IonActionSheet,
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
} from '@ionic/react';
import { useFormik } from 'formik';
import Header from '../../components/Header/Header';
import { caretDownOutline, caretUpOutline } from 'ionicons/icons';
import PersonSvg from '/assets/person-circle.svg';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../state/store';
import usePresentToast from '../../hooks/usePresentToast';
import { setLoading } from '../../state/loadingSlice';
import { updatePracticeAction } from '../../state/providerSlice';
import { practiceUpdateSchema } from './validation/profileInformation.schema';
import { uploadProfilePicture } from '../../api/services/provider';
import useFiles, { FileResponse } from '../../hooks/useFiles';
import UseSwipeGesture from '../../hooks/useSwipeGesture';
import { useHistory } from 'react-router';
import SwipeHandler from '../../components/SwipeHandler/SwipeHandler';

import './ProfileInformation.scss';
import { useTranslation } from 'react-i18next';

const CSSprefix = 'profile-information';

const ProfileInformation: React.FC = (): React.ReactElement => {
  const profileInformationRef = useRef();
  const {
    provider,
    practice: { phoneCodes },
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch<AppDispatch>();
  const history = useHistory();
  const [presentToast] = usePresentToast();
  const { takePhoto, pickPhoto } = useFiles();
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const { t } = useTranslation();
  const [openUploadImageActionSheet, setOpenUploadImageActionSheet] = useState<boolean>(false);
  const initialValues = useMemo(
    () =>
      provider.practice || {
        profilePictureUrl: null,
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
      },
    [provider.practice]
  );
  const {
    practiceId,
    providerId,
  }: {
    practiceId?: string;
    providerId?: string;
  } = useMemo(() => {
    if (provider.providerPractices.length > 0) {
      const [providerPractice] = provider.providerPractices;
      return {
        practiceId: providerPractice.practiceId,
        providerId: providerPractice.providerId,
      };
    }

    return {};
  }, [provider.providerPractices]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: async values => {
      const valid = await practiceUpdateSchema.validate(values);

      if (practiceId && providerId && valid) {
        dispatch(setLoading({ loading: true }));
        let updatedValues = { ...values };
        if (profilePictureFile) {
          const profilePictureResponse = await uploadProfilePicture(providerId, profilePictureFile);
          if (profilePictureResponse.data.data) {
            updatedValues = {
              ...values,
              profilePictureUrl: profilePictureResponse.data.data,
              displayTwentyFourHourTime: false,
              dateFormat: null,
            };
          }
        }
        const response = await dispatch(
          updatePracticeAction({ practiceId, providerId, practice: updatedValues })
        );

        if (response.meta.requestStatus === 'fulfilled') {
          dispatch(setLoading({ loading: false, message: undefined }));
        }

        if (response.meta.requestStatus === 'rejected') {
          presentToast(`${t('toast_messages_error_update_practice')}`, 1000, 'top', 'danger');
        }
        dispatch(setLoading({ loading: false, message: undefined }));
      }
    },
  });

  const changePhotoHandler = async (action: 'take' | 'pick') => {
    setOpenUploadImageActionSheet(false);
    let profilePicture: FileResponse = { file: null, url: '' };

    if (action === 'take') {
      profilePicture = await takePhoto();
    }

    if (action === 'pick') {
      profilePicture = await pickPhoto();
    }

    formik.setFieldValue('profilePictureUrl', profilePicture.url);
    setProfilePictureFile(profilePicture.file);
  };

  const removePhotoHandler = () => {
    formik.setFieldValue('profilePictureUrl', null);
    setProfilePictureFile(null);
  };

  const uploadActions = useMemo(() => {
    const actions: (string | ActionSheetButton<any>)[] = [
      {
        text: 'Take photo',
        data: {
          action: 'takePhoto',
        },
        handler: async () => changePhotoHandler('take'),
      },
      {
        text: 'Choose photo',
        data: {
          action: 'pickPhoto',
        },
        handler: async () => changePhotoHandler('pick'),
      },
      {
        text: 'Cancel',
        role: 'cancel',
        data: {
          action: 'cancel',
        },
      },
    ];

    return actions;
  }, [changePhotoHandler]);

  const { handlers, refPassthrough } = UseSwipeGesture({
    parentRef: profileInformationRef,
    onSwipedRight: () => history.goBack(),
  });

  return (
    <IonPage className={CSSprefix} {...handlers} ref={refPassthrough}>
      <SwipeHandler parentRef={profileInformationRef} />
      <Header showBack showMenu={false} />
      <IonContent className={CSSprefix}>
        <IonItem className="ion-margin-vertical" lines="none">
          <IonText className={`${CSSprefix}-title ion-margin-top`}>
            {t('profile_settings_my_profile_information')}
          </IonText>
        </IonItem>
        <IonList>
          <IonRow className="ion-justify-content-center">
            <IonAvatar>
              <img alt="person" src={formik.values?.profilePictureUrl || PersonSvg} />
            </IonAvatar>
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonItem lines="none">
              <IonButton
                fill="clear"
                color="primary"
                onClick={() => setOpenUploadImageActionSheet(true)}
              >
                {t('profile_settings_upload_photo')}
              </IonButton>
              {formik.values?.profilePictureUrl !== null && (
                <>
                  <div className={`${CSSprefix}-divider`} />
                  <IonButton fill="clear" color="danger" onClick={removePhotoHandler}>
                    {t('profile_settings_remove_photo')}
                  </IonButton>
                </>
              )}
            </IonItem>
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonText className={`${CSSprefix}-image-description`}>
              {t('profile_settings_preferred_image_size')}
            </IonText>
          </IonRow>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical ${CSSprefix}-form-item`}
          >
            <IonLabel position="stacked" class="custom-input">
              {t('add_new_client_first_name')}*
            </IonLabel>
            <IonInput
              name="firstName"
              class="custom"
              type="text"
              placeholder={t('add_new_client_first_name_placeholder')}
              value={formik.values.firstName}
              onIonInput={e => formik.setFieldValue('firstName', e.detail.value)}
            />
          </IonItem>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical ${CSSprefix}-form-item`}
          >
            <IonLabel position="stacked" class="custom-input">
              {t('add_new_client_last_name')}*
            </IonLabel>
            <IonInput
              name="lastName"
              class="custom"
              type="text"
              placeholder={t('add_new_client_last_name_placeholder')}
              value={formik.values.lastName}
              onIonInput={e => formik.setFieldValue('lastName', e.detail.value)}
            />
          </IonItem>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical ${CSSprefix}-form-item`}
          >
            <IonLabel position="stacked" class="custom-input">
              {t('add_new_client_mobile')}
            </IonLabel>
            <IonItem lines="none" className={`${CSSprefix}-nested-item`}>
              <IonSelect
                name="phoneNumberPrefix"
                placeholder={t('add_new_client_country_code')}
                toggleIcon={caretDownOutline}
                expandedIcon={caretUpOutline}
                selectedText={formik.values.phoneNumberPrefix}
                value={formik.values.phoneNumberPrefix}
                onIonChange={e => formik.setFieldValue('phoneNumberPrefix', e.detail.value)}
              >
                {phoneCodes.map(({ code, countryName }, index) => (
                  <IonSelectOption key={`${countryName}-${index}`} value={code}>
                    {code}
                  </IonSelectOption>
                ))}
              </IonSelect>
              <IonInput
                name="phoneNumber"
                class="custom"
                type="number"
                placeholder={t('add_new_client_number')}
                value={formik.values.phoneNumber}
                onIonInput={e => formik.setFieldValue('phoneNumber', e.detail.value)}
              />
            </IonItem>
          </IonItem>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical ${CSSprefix}-form-item`}
          >
            <IonLabel position="stacked" class="custom-input">
              {t('profile_settings_display_name')}*
            </IonLabel>
            <IonInput
              name="displayName"
              class="custom"
              type="text"
              placeholder={t('add_new_client_enter_display_name')}
              value={formik.values.displayName}
              onIonInput={e => formik.setFieldValue('displayName', e.detail.value)}
            />
          </IonItem>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical ${CSSprefix}-form-item`}
          >
            <IonLabel position="stacked" class="custom-input">
              {t('profile_settings_qualifications_and_titles')}
            </IonLabel>
            <IonInput
              name="qualificationsAndTitle"
              class="custom"
              type="text"
              placeholder={t('profile_settings_enter_qualifications_and_titles')}
              value={formik.values.qualificationsAndTitle}
              onIonInput={e => formik.setFieldValue('qualificationsAndTitle', e.detail.value)}
            />
          </IonItem>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical ${CSSprefix}-form-item`}
          >
            <IonLabel position="stacked" class="custom-input">
              {t('profile_settings_currency')}*
            </IonLabel>
            <IonSelect
              name="preferredCurrency"
              placeholder={t('profile_settings_enter_currency')}
              toggleIcon={caretDownOutline}
              expandedIcon={caretUpOutline}
              selectedText={formik.values.preferredCurrency}
              value={formik.values.preferredCurrency}
              onIonChange={e => formik.setFieldValue('preferredCurrency', e.detail.value)}
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
            <IonLabel position="stacked" class="custom-input">
              {t('profile_settings_bio')}*
            </IonLabel>
            <IonTextarea
              name="bio"
              autoGrow
              aria-label="bio"
              className={`${CSSprefix}-bio`}
              value={formik.values.bio}
              onIonInput={e => formik.setFieldValue('bio', e.detail.value)}
            />
          </IonItem>
          <IonButton
            className={`${CSSprefix}-save-button`}
            color="primary"
            expand="block"
            disabled={!formik.dirty}
            onClick={() => formik.submitForm()}
          >
            {t('profile_settings_save_details')}
          </IonButton>
        </IonList>
      </IonContent>
      <IonActionSheet
        header="Choose option"
        buttons={uploadActions}
        isOpen={openUploadImageActionSheet}
        onDidDismiss={() => setOpenUploadImageActionSheet(false)}
      />
    </IonPage>
  );
};

export default ProfileInformation;
