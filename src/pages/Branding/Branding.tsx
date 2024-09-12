import React, { useMemo, useState } from "react";
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
import useFiles from "../../hooks/useFiles";
import { setLoading } from "../../state/loadingSlice";
import { uploadPracticeLogo, updateBrandingInformation } from "../../api/services/practice";
import { updateBrandingInformationAction } from "../../state/practiceSlice";

import "./Branding.scss";

const CSSprefix = 'branding';

const Branding: React.FC = (): React.ReactElement => {
  const { practice } = useSelector((state: RootState) => state);
  const dispatch = useDispatch<AppDispatch>();
  const [presentToast] = usePresentToast();
  const { takePhoto, pickPhoto } = useFiles();
  const [openUploadImageActionSheet, setOpenUploadImageActionSheet] =
    useState<boolean>(false);

  const changePhotoHandler = async (action: "take" | "pick" | "delete") => {
    setOpenUploadImageActionSheet(false);
    let practiceLogo: File | null = null;

    if (action === "take") {
      practiceLogo = await takePhoto();
      if (!practiceLogo) return;
    }

    if (action === "pick") {
      practiceLogo = await pickPhoto();
      if (!practiceLogo) return;
    }

    if (practiceLogo && (action === 'take' || action === 'pick') && practice.businessInformation?.id) {
      try {
        dispatch(
          setLoading({ loading: true, message: 'Uploading profile picture' })
        );
        const practiceLogoResponse = await uploadPracticeLogo(practice.businessInformation.id, practiceLogo);

        if (practiceLogoResponse.data.data) {
          await updateBrandingInformation(
            practice.businessInformation.id,
            { logoUrl: practiceLogoResponse.data.data }
          );
          dispatch(updateBrandingInformationAction({
            logoUrl: practiceLogoResponse.data.data,
          }));
        }

        dispatch(setLoading({ loading: false, message: '' }));
      } catch (error) {
        dispatch(setLoading({ loading: false, message: '' }));
        presentToast(
          '¡Error at upload practice logo!',
          1000,
          'top',
          'danger'
        );
      }

    }
  };

  // Waiting to update endpoint to be able to update logoUrl as empty string
  const removePhotoHandler = async () => {
    if (practice.businessInformation?.id) {
      try {
        dispatch(
          setLoading({ loading: true, message: 'Removing practice logo' })
        );

        await updateBrandingInformation(
          practice.businessInformation.id,
          { logoUrl: '' }
        );
        dispatch(updateBrandingInformationAction({ logoUrl: '' }));

        dispatch(setLoading({ loading: false, message: '' }));
      } catch (error) {
        dispatch(setLoading({ loading: false, message: '' }));
        presentToast(
          '¡Error at remove practice logo!',
          1000,
          'top',
          'danger'
        );
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

  return (
    <IonPage className={CSSprefix}>
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
            <IonImg src={practice.businessInformation?.logoUrl || ''} />
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
              {practice.businessInformation?.logoUrl !== null && (
                <>
                  <div className={`${CSSprefix}-divider`} />
                  <IonButton
                    fill="clear"
                    color="danger"
                    onClick={removePhotoHandler}
                  >
                    Remove logo
                  </IonButton>
                </>
              )}
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
            onClick={() => null}
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
