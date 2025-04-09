import React, { useMemo, useRef } from "react";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonText,
} from "@ionic/react";
import Header from "../../components/Header/Header";
import { caretDownOutline, caretUpOutline, copyOutline } from "ionicons/icons";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { Clipboard } from '@capacitor/clipboard';
import { AppDispatch, RootState } from "../../state/store";
import { businessInformationSchema } from "./validation/businessInformation.schema";
import { setLoading } from "../../state/loadingSlice";
import usePresentToast from "../../hooks/usePresentToast";
import { updateBusinessInformationAction } from "../../state/practiceSlice";
import SwipeHandler from "../../components/SwipeHandler/SwipeHandler";
import UseSwipeGesture from "../../hooks/useSwipeGesture";
import { useHistory } from "react-router";

import "./BusinessInformation.scss";
import { useTranslation } from "react-i18next";

const CSSprefix = 'business-information';

const BusinessInformation: React.FC = (): React.ReactElement => {
  const businessInformationRef = useRef();
  const { practice } = useSelector((state: RootState) => state);
  const dispatch = useDispatch<AppDispatch>();
  const history = useHistory();
  const [presentToast] = usePresentToast();
  const { t } = useTranslation();
  const initialValues = useMemo(() => ({
    // Booking page personalized url
    subdomain: practice.businessInformation?.subdomain,
    // Auto generated URL
    fqDomain: practice.businessInformation?.fqDomain,
    legalName: practice.businessInformation?.legalName,
    country: practice.businessInformation?.country,
    state: practice.businessInformation?.state,
    city: practice.businessInformation?.city,
    addressLineOne: practice.businessInformation?.addressLineOne,
    addressLineTwo: practice.businessInformation?.addressLineTwo,
    zipCode: practice.businessInformation?.zipCode,
  }), [practice.businessInformation]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const valid = await businessInformationSchema.validate(values);

      if (valid && practice.businessInformation?.id) {
        dispatch(setLoading({ loading: true }));
        const response = await dispatch(updateBusinessInformationAction({
          practiceId: practice.businessInformation.id,
          businessInformation: values,
        }));

        if (response.meta.requestStatus === 'fulfilled') {
          dispatch(setLoading({ loading: false, message: undefined }));
        }

        if (response.meta.requestStatus === 'rejected') {
          presentToast(
            '¡Error at update business information!',
            1000,
            'top',
            'danger'
          );
        }
        dispatch(setLoading({ loading: false, message: undefined }));
      }
    },
  });

  const autoGeneratePersonalizedUrlHandler = (subdomain: string) => {
    const personalizedUrl = `https://${subdomain}.${process.env.REACT_APP_PERSONALIZED_URL}`;
    formik.setFieldValue('fqDomain', personalizedUrl);
  };

  const copyPersonalizedUrl = async () => {
    await Clipboard.write({
      string: formik.values.fqDomain
    });
  };

  const { handlers, refPassthrough } = UseSwipeGesture({
    parentRef: businessInformationRef,
    onSwipedRight: () => history.goBack(),
  });

  return (
    <IonPage className={CSSprefix} {...handlers} ref={refPassthrough}>
      <SwipeHandler parentRef={businessInformationRef} />
      <Header showBack showMenu={false} />
      <IonContent fullscreen={true} className={CSSprefix}>
        <IonItem className="ion-margin-vertical" lines="none">
          <IonText className={`${CSSprefix}-title ion-margin-top`}>
            Business information
          </IonText>
        </IonItem>
        <IonList>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical ${CSSprefix}-form-item`}
          >
            <IonLabel position="stacked" class="custom-input">
              Booking page personalized URL*
            </IonLabel>
            <IonInput
              class="custom"
              type="text"
              placeholder="Enter page name"
              value={formik.values.subdomain}
              onIonInput={(e) => {
                formik.setFieldValue('subdomain', e.detail.value);
                autoGeneratePersonalizedUrlHandler(e.detail.value || '');
              }}
            />
          </IonItem>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical ${CSSprefix}-form-item`}
          >
            <IonLabel position="stacked" class="custom-input">
              Auto booking page personalized URL
            </IonLabel>
            <IonInput
              disabled
              class="custom"
              type="text"
              placeholder="Enter page name above to generate"
              value={formik.values.fqDomain}
            />
            <IonIcon className={`${CSSprefix}-copy-icon`} slot="end" icon={copyOutline} onClick={copyPersonalizedUrl} />
          </IonItem>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical ${CSSprefix}-form-item`}
          >
            <IonLabel position="stacked" class="custom-input">
              Business legal name*
            </IonLabel>
            <IonInput
              class="custom"
              type="text"
              placeholder="Enter business legal name"
              value={formik.values.legalName}
              onIonInput={(e) => formik.setFieldValue('legalName', e.detail.value)}
            />
          </IonItem>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical ${CSSprefix}-form-item`}
          >
            <IonLabel position="stacked" class="custom-input">
            {t("add_new_client_country")}*
            </IonLabel>
            <IonSelect
              placeholder="Select country"
              toggleIcon={caretDownOutline}
              expandedIcon={caretUpOutline}
              selectedText={formik.values.country}
              value={formik.values.country}
              onIonChange={(e) => formik.setFieldValue('country', e.detail.value)}
            >
              {practice.countries.map(({ name, code }) => (
                <IonSelectOption key={code} value={code}>{name}</IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical ${CSSprefix}-form-item`}
          >
            <IonLabel position="stacked" class="custom-input">State*</IonLabel>
            <IonInput
              class="custom"
              type="text"
              placeholder="Enter state"
              value={formik.values.state}
              onIonInput={(e) => formik.setFieldValue('state', e.detail.value)}
            />
          </IonItem>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical ${CSSprefix}-form-item`}
          >
            <IonLabel position="stacked" class="custom-input">City*</IonLabel>
            <IonInput
              class="custom"
              type="text"
              placeholder="Enter city"
              value={formik.values.city}
              onIonInput={(e) => formik.setFieldValue('city', e.detail.value)}
            />
          </IonItem>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical ${CSSprefix}-form-item`}
          >
            <IonLabel position="stacked" class="custom-input">Address line 1*</IonLabel>
            <IonInput
              class="custom"
              type="text"
              placeholder="Enter address line"
              value={formik.values.addressLineOne}
              onIonInput={(e) => formik.setFieldValue('addressLineOne', e.detail.value)}
            />
          </IonItem>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical ${CSSprefix}-form-item`}
          >
            <IonLabel position="stacked" class="custom-input">Address line 2</IonLabel>
            <IonInput
              class="custom"
              type="text"
              placeholder="Enter address line"
              value={formik.values.addressLineTwo}
              onIonInput={(e) => formik.setFieldValue('addressLineTwo', e.detail.value)}
            />
          </IonItem>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical ${CSSprefix}-form-item`}
          >
            <IonLabel position="stacked" class="custom-input">ZIP code*</IonLabel>
            <IonInput
              class="custom"
              type="text"
              placeholder="Enter ZIP code"
              value={formik.values.zipCode}
              onIonInput={(e) => formik.setFieldValue('zipCode', e.detail.value)}
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

export default BusinessInformation;
