import React, { useMemo } from "react";
import {
  IonButton,
  IonContent,
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
import { useFormik } from "formik";
import { useLocation } from "react-router";
import { caretDownOutline, caretUpOutline } from "ionicons/icons";
import { AppointmentDetailsEditState } from "./AppointmentDetailsEdit.type";

import "./AppointmentDetailsEdit.scss";

const CSSprefix = 'appointment-details-edit';

const AppointmentDetailsEdit: React.FC = (): React.ReactElement => {
  const location = useLocation<AppointmentDetailsEditState>();
  const initialValues = useMemo(() => ({
    patientName: location.state.patientName || '',
    patientServiceName: location.state.patientServiceName || '',
    price: location.state.price || '',
    location: location.state.location || '',
  }), [location.state]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: async (values) => { },
  });

  return (
    <IonPage className={CSSprefix}>
      <Header showBack showMenu={false} />
      <IonContent fullscreen={true} className={CSSprefix}>
        <IonItem className="ion-margin-vertical" lines="none">
          <IonText className={`${CSSprefix}-title ion-margin-top`}>
            Edit appointment
          </IonText>
        </IonItem>
        <IonList>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical`}
          >
            <IonLabel position="stacked" class="custom-input">
              Client
            </IonLabel>
            <IonInput
              disabled
              class="custom"
              type="text"
              value={formik.values.patientName}
            />
          </IonItem>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical`}
          >
            <IonLabel position="stacked" class="custom-input">
              Service
            </IonLabel>
            <IonInput
              disabled
              class="custom"
              type="text"
              value={`${formik.values.patientServiceName} (${location.state.duration})`}
            />
          </IonItem>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical`}
          >
            <IonLabel position="stacked" class="custom-input">
              Adjust price
            </IonLabel>
            <IonInput
              disabled
              class="custom"
              type="number"
              value={formik.values.price}
            />
          </IonItem>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical`}
          >
            <IonLabel position="stacked" class="custom-input">Location</IonLabel>
            <IonSelect
              name="location"
              toggleIcon={caretDownOutline}
              expandedIcon={caretUpOutline}
              selectedText={formik.values.location}
              value={formik.values.location}
              onIonChange={(e) => formik.setFieldValue('location', e.detail.value)}
            >
              <IonSelectOption value="Online">Online</IonSelectOption>
              <IonSelectOption value="In Person">In Person</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonButton
            className={`${CSSprefix}-save-button`}
            color="primary"
            expand="block"
            disabled={!formik.dirty}
            onClick={() => formik.submitForm()}
          >
            Save changes
          </IonButton>
        </IonList>
      </IonContent>
    </IonPage >
  );
};

export default AppointmentDetailsEdit;
