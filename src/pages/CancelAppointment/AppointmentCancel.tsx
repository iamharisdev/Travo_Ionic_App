import React, { useMemo } from "react";
import {
  IonButton,
  IonCheckbox,
  IonContent,
  IonGrid,
  IonItem,
  IonList,
  IonPage,
  IonRow,
  IonText,
} from "@ionic/react";
import Header from "../../components/Header/Header";
import { useFormik } from "formik";
import { useLocation } from "react-router";
import { CancelAppointmentState } from "./appointmentCancel.type";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import { setLoading } from "../../state/loadingSlice";
import { cancelAppointmentAction } from "../../state/schedulingSlice";
import usePresentToast from "../../hooks/usePresentToast";
import { cancelAppointmentSchema } from "./validation/appointmentCancel.schema";

import "./AppointmentCancel.scss";

const CSSprefix = 'appointment-cancel';

const AppointmentCancel: React.FC = (): React.ReactElement => {
  const { provider } = useSelector((state: RootState) => state);
  const location = useLocation<CancelAppointmentState>();
  const dispatch = useDispatch<AppDispatch>();
  const [presentToast] = usePresentToast();
  const initialValues = {
    notAcceptingNewClients: false,
    notWithinScopeOfExpertise: false,
    needReferral: false,
    other: false,
  };

  const { practiceId, providerId }: { practiceId: string, providerId: string } = useMemo(() => {
    let practiceId = '';
    let providerId = '';

    if (provider.providerPractices.length > 0) {
      const [providerPractice] = provider.providerPractices;

      return { practiceId: providerPractice.practiceId, providerId: providerPractice.providerId };
    }

    return { practiceId, providerId };
  }, [provider.providerPractices]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const valid = await cancelAppointmentSchema.validate(values);

      if (valid && practiceId && providerId && location.state.appointmentId) {
        dispatch(setLoading({ loading: true }));
        const response = await dispatch(cancelAppointmentAction({
          practiceId,
          providerId,
          appointmentId: location.state.appointmentId,
          payload: {
            additionalDetails: '',
            reason: '',
          }
        }));

        if (response.meta.requestStatus === 'fulfilled') {
          dispatch(setLoading({ loading: false, message: undefined }));
        }

        if (response.meta.requestStatus === 'rejected') {
          presentToast(
            '¡Error at cancel appointment!',
            1000,
            'top',
            'danger'
          );
        }

        dispatch(setLoading({ loading: false, message: undefined }));
      }
    },
  });

  const checkItemHandler = (field: string) => {
    for (const key in formik.values) {
      if (key === field) {
        formik.setFieldValue(field, true);
      } else {
        formik.setFieldValue(key, false);
      }
    }
  };

  console.log('formik.values: ', formik.values);

  return (
    <IonPage className={CSSprefix}>
      <Header showBack showMenu={false} />
      <IonContent fullscreen={true} className={CSSprefix}>
        <IonGrid className="ion-padding">
          <IonRow>
            <IonText className={`${CSSprefix}-title ion-margin-top`}>
              Cancel appointment
            </IonText>
          </IonRow>
          <IonRow>
            <IonText className={`${CSSprefix}-description`}>
              Select a reason to cancel the appointment
            </IonText>
          </IonRow>
        </IonGrid>
        <IonList>
          <IonItem lines="none">
            <IonCheckbox
              justify="space-between"
              checked={formik.values.notAcceptingNewClients}
              onIonChange={(e) => checkItemHandler('notAcceptingNewClients')}
            >
              Not accepting new clients
            </IonCheckbox>
          </IonItem>
          <IonItem lines="none">
            <IonCheckbox
              justify="space-between"
              checked={formik.values.notWithinScopeOfExpertise}
              onIonChange={(e) => checkItemHandler('notWithinScopeOfExpertise')}
            >
              Not within scope of expertise
            </IonCheckbox>
          </IonItem>
          <IonItem lines="none">
            <IonCheckbox
              justify="space-between"
              checked={formik.values.needReferral}
              onIonChange={(e) => checkItemHandler('needReferral')}
            >
              Need referral
            </IonCheckbox>
          </IonItem>
          <IonItem lines="none">
            <IonCheckbox
              justify="space-between"
              checked={formik.values.other}
              onIonChange={(e) => checkItemHandler('other')}
            >
              Other
            </IonCheckbox>
          </IonItem>
        </IonList>
        <IonButton
          className={`${CSSprefix}-cancel-button ion-padding`}
          color="danger"
          expand="block"
          disabled={!formik.dirty}
          onClick={() => formik.submitForm()}
        >
          Cancel appointment
        </IonButton>
      </IonContent>
    </IonPage >
  );
};

export default AppointmentCancel;
