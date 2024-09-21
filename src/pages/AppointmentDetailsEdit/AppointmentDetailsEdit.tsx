import React, { useMemo } from "react";
import {
  IonButton,
  IonContent,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
} from "@ionic/react";
import Header from "../../components/Header/Header";
import { useFormik } from "formik";
import { useLocation } from "react-router";
import { caretDownOutline, caretUpOutline, informationCircle } from "ionicons/icons";
import { AppointmentDetailsEditState } from "./AppointmentDetailsEdit.type";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";

import "./AppointmentDetailsEdit.scss";

const CSSprefix = 'appointment-details-edit';

const AppointmentDetailsEdit: React.FC = (): React.ReactElement => {
  const { scheduling: { services } } = useSelector((state: RootState) => state);
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

  const paymentType = useMemo(() => services?.patientServiceRequestDtos.find(
    ({ id }) => id === location.state.patientServiceId)?.paymentType,
    [location.state.patientServiceId, services]
  );

  return (
    <IonPage className={CSSprefix}>
      <Header showBack showMenu={false} />
      <IonContent fullscreen={true} className={CSSprefix}>
        <IonGrid className="ion-padding">
          <IonRow>
            <IonText className={`${CSSprefix}-title ion-margin-top`}>
              Edit appointment
            </IonText>
          </IonRow>
          <IonRow>
            <IonText className={`${CSSprefix}-description`}>
              Edit appointment details
            </IonText>
          </IonRow>
        </IonGrid>
        <IonList>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical`}
          >
            <IonLabel position="stacked" className={`${CSSprefix}-label-disabled`} class="custom-input">
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
            <IonLabel position="stacked" className={`${CSSprefix}-label-disabled`} class="custom-input">
              Service
            </IonLabel>
            <IonSelect
              disabled
              name="service"
              toggleIcon={caretDownOutline}
              expandedIcon={caretUpOutline}
              selectedText={`${formik.values.patientServiceName} (${location.state.duration})`}
              value={formik.values.patientServiceName}
              onIonChange={(e) => formik.setFieldValue('patientServiceName', e.detail.value)}
            >
              {services?.patientServiceRequestDtos.map(({ id, name }) => (
                <IonSelectOption key={id} value={name}>{name}</IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical`}
          >
            <IonLabel position="stacked" className={`${CSSprefix}-label-disabled`} class="custom-input">
              Adjusted price
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
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical`}
          >
            <IonLabel position="stacked" className={`${CSSprefix}-label-disabled`} class="custom-input">
              Payment type
              <IonIcon className={`${CSSprefix}-info-icon`} icon={informationCircle} />
            </IonLabel>
            <IonInput
              disabled
              class="custom"
              type="text"
              value={paymentType}
            />
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
