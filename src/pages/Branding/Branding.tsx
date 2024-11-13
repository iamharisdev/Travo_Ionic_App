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

const CSSprefix = 'branding';

const Branding: React.FC = (): React.ReactElement => {
  const brandingRef = useRef();
  const { practice } = useSelector((state: RootState) => state);
  const dispatch = useDispatch<AppDispatch>();
  const history = useHistory();
  const [presentToast] = usePresentToast();
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
    let practiceLogo: FileResponse = { file: null, url: '' };

    if (action === "take") {
      practiceLogo = await takePhoto();
    }

    if (action === "pick") {
      practiceLogo = await pickPhoto();
    }

    setPracticeLogo(practiceLogo);
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
          '¡Error at upload practice logo!',
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
            Branding
          </IonText>
        </IonItem>
        <IonItem className="ion-margin-vertical" lines="none">
          <IonText className={`${CSSprefix}-description ion-margin-top`}>
            Your logo will appear on your public profile and your invoices.
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
                Upload logo
              </IonButton>
            </IonItem>
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonText className={`${CSSprefix}-image-description`}>
              Preferred image size: 240px x 240px @ 72DPI
              Maximum size of 1MB.
            </IonText>
          </IonRow>
          <IonButton
            className={`${CSSprefix}-save-button`}
            color="primary"
            expand="block"
            disabled={initialLogoUrl === practiceLogo.url}
            onClick={saveAndUpdateLogoHandler}
          >
            Save and update
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
