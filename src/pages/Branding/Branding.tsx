import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActionSheetButton,
  IonActionSheet,
  IonButton,
  IonContent,
  IonImg,
  IonItem,
  IonList,
  IonPage,
  IonRow,
  IonText,
} from "@ionic/react";
import Header from "../../components/Header/Header";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import usePresentToast from "../../hooks/usePresentToast";
import useFiles, { FileResponse } from "../../hooks/useFiles";
import { setLoading } from "../../state/loadingSlice";
import { uploadPracticeLogo, updateBrandingInformation } from "../../api/services/practice";
import { updateBrandingInformationAction } from "../../state/practiceSlice";
import UseSwipeGesture from "../../hooks/useSwipeGesture";
import { useHistory } from "react-router";
import SwipeHandler from "../../components/SwipeHandler/SwipeHandler";

import "./Branding.scss";
import { useTranslation } from "react-i18next";

const CSSprefix = 'branding';

const Branding: React.FC = (): React.ReactElement => {
  const brandingRef = useRef();
  const { practice } = useSelector((state: RootState) => state);
  const dispatch = useDispatch<AppDispatch>();
  const history = useHistory();
  const [presentToast] = usePresentToast();
    const { t } = useTranslation();
  const { takePhoto, pickPhoto } = useFiles();
  const [openUploadImageActionSheet, setOpenUploadImageActionSheet] =
    useState<boolean>(false);
  const [initialLogoUrl, setInitialLogoUrl] = useState<string>('');
  const [practiceLogo, setPracticeLogo] = useState<{
    file: File | null;
    url: string | null;
  }>({ file: null, url: null });

  const changePhotoHandler = async (action: 'take' | 'pick') => {
    setOpenUploadImageActionSheet(false);

    if (action === "take") {
      const res = await takePhoto();

      if (res.file === null && res.url === '') {
        setPracticeLogo({ file: null, url: practice.businessInformation?.logoUrl!! });
      } else {
        setPracticeLogo(res);
      }
    }

    if (action === "pick") {
      const res = await pickPhoto();
      if (res.file === null && res.url === '') {
        setPracticeLogo({ file: null, url: practice.businessInformation?.logoUrl!! });
      } else {
        setPracticeLogo(res);
      }
    }
  };

  const saveAndUpdateLogoHandler = async () => {
    if (practice.businessInformation?.id) {
      try {
        dispatch(
          setLoading({ loading: true })
        );
        let logoUrl: string | null = null;
        if (practiceLogo.file) {
          const practiceLogoResponse = await uploadPracticeLogo(practice.businessInformation.id, practiceLogo.file);
          logoUrl = practiceLogoResponse.data.data;
        }

        await updateBrandingInformation(
          practice.businessInformation.id,
          { logoUrl }
        );
        dispatch(updateBrandingInformationAction({
          logoUrl,
        }));
        setPracticeLogo({ ...practiceLogo, url: logoUrl || '' });
        setInitialLogoUrl(logoUrl || '');

        dispatch(setLoading({ loading: false, message: '' }));
      } catch (error) {
        dispatch(setLoading({ loading: false, message: '' }));
        presentToast(
          `!${t("toast_messages_error_upload_practice_logo")}!`,
          1000,
          'top',
          'danger'
        );
        setPracticeLogo({ file: null, url: practice.businessInformation?.logoUrl || '' });
        setInitialLogoUrl(practice.businessInformation?.logoUrl || '');
      }

    }
  };

  const uploadActions = useMemo(() => {
    const actions: (string | ActionSheetButton<any>)[] = [
      {
        text: "Take photo",
        data: {
          action: "takePhoto",
        },
        handler: async () => changePhotoHandler("take"),
      },
      {
        text: "Choose photo",
        data: {
          action: "pickPhoto",
        },
        handler: async () => changePhotoHandler("pick"),
      },
      {
        text: "Cancel",
        role: "cancel",
        data: {
          action: "cancel",
        },
        handler: () => setPracticeLogo({ file: null, url: practice.businessInformation?.logoUrl!! }),
      },
    ];

    return actions;
  }, [changePhotoHandler]);

  useEffect(() => {
    // Initial load image
    if (practice.businessInformation?.logoUrl && practiceLogo.url === null) {
      setPracticeLogo({ file: null, url: practice.businessInformation.logoUrl });
      setInitialLogoUrl(practice.businessInformation.logoUrl);
    }
  }, [practice.businessInformation?.logoUrl, practiceLogo.url]);

  const { handlers, refPassthrough } = UseSwipeGesture({
    parentRef: brandingRef,
    onSwipedRight: () => history.goBack(),
  });

  return (
    <IonPage className={CSSprefix} {...handlers} ref={refPassthrough}>
      <SwipeHandler parentRef={brandingRef} />
      <Header showBack showMenu={false} />
      <IonContent fullscreen={true} className={CSSprefix}>
        <IonItem className="ion-margin-vertical" lines="none">
          <IonText className={`${CSSprefix}-title ion-margin-top`}>
            {t("profile_settings_branding")}
          </IonText>
        </IonItem>
        <IonItem className="ion-margin-vertical" lines="none">
          <IonText className={`${CSSprefix}-description ion-margin-top`}>
            {t("profile_settings_logo_appearance_message")}
          </IonText>
        </IonItem>
        <IonList>
          <IonRow className="ion-justify-content-center">
            <IonImg src={practiceLogo.url || ''} />
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonItem lines="none">
              <IonButton
                fill="clear"
                color="primary"
                onClick={() => setOpenUploadImageActionSheet(true)}
              >
                {t("profile_settings_Upload_logo")}
              </IonButton>
            </IonItem>
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonText className={`${CSSprefix}-image-description`}>
            {t("profile_settings_preferred_image_size")}
            </IonText>
          </IonRow>
          <IonButton
            className={`${CSSprefix}-save-button`}
            color="primary"
            expand="block"
            disabled={initialLogoUrl === practiceLogo.url}
            onClick={saveAndUpdateLogoHandler}
          >
            {t("profile_settings_save_and_update")}
          </IonButton>
        </IonList>
      </IonContent>
      <IonActionSheet
        header="Choose option"
        buttons={uploadActions}
        isOpen={openUploadImageActionSheet}
        onDidDismiss={() => setOpenUploadImageActionSheet(false)}
      />
    </IonPage >
  );
};

export default Branding;
