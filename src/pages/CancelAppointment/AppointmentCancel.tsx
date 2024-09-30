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
  IonTextarea,
} from "@ionic/react";
import Header from "../../components/Header/Header";
import { useFormik } from "formik";
import { useHistory, useLocation } from "react-router";
import { CancelAppointmentState } from "./appointmentCancel.type";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import { setLoading } from "../../state/loadingSlice";
import { cancelAppointmentAction } from "../../state/schedulingSlice";
import usePresentToast from "../../hooks/usePresentToast";
import { cancelAppointmentSchema } from "./validation/appointmentCancel.schema";
import { APPOINTMENTS } from "../../shared/routes/routes";

import "./AppointmentCancel.scss";

const CSSprefix = 'appointment-cancel';

const AppointmentCancel: React.FC = (): React.ReactElement => {
  const { provider } = useSelector((state: RootState) => state);
  const location = useLocation<CancelAppointmentState>();
  const dispatch = useDispatch<AppDispatch>();
  const [presentToast] = usePresentToast();
  const history = useHistory();

  const initialValues = {
    notAcceptingNewClients: {
      checked: false,
      value: 'Not accepting new clients',
    },
    notWithinScopeOfExpertise: {
      checked: false,
      value: 'Not within scope of expertise',
    },
    needReferral: {
      checked: false,
      value: 'Need referral',
    },
    other: {
      checked: false,
      value: '',
    },
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

  const preparePayloadHandler = (values: { [key: string]: { checked: boolean, value: string } }) => {
    for (const key in values) {
      const fieldValue = values[key];

      if (fieldValue.checked && key === 'other') {
        return { additionalDetails: fieldValue.value, reason: 'Other' };
      } else {
        return { additionalDetails: '', reason: fieldValue.value };
      }
    }

    return { additionalDetails: '', reason: '' };
  }

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const valid = await cancelAppointmentSchema.validate(values);

        if (valid && practiceId && providerId && location.state.appointmentId) {
          dispatch(setLoading({ loading: true }));

          const payload = preparePayloadHandler(formik.values);

          const response = await dispatch(cancelAppointmentAction({
            practiceId,
            providerId,
            appointmentId: location.state.appointmentId,
            payload
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
          formik.resetForm();
          history.push(APPOINTMENTS);
        }
      } catch (error) {
        formik.resetForm();
        dispatch(setLoading({ loading: false, message: undefined }));
        presentToast(
          '¡Error at cancel appointment!',
          1000,
          'top',
          'danger'
        );
      }
    },
  });

  const checkItemHandler = (field: string) => {
    for (const key in formik.values) {
      const fieldValue = (formik.values as { [key: string]: { checked: boolean, value: string } })[key];

      if (key === field) {
        formik.setFieldValue(field, { ...fieldValue, checked: true });
      } else {
        formik.setFieldValue(key, { checked: false, value: key === 'other' ? '' : fieldValue.value });
      }
    }
  };

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
              checked={formik.values.notAcceptingNewClients.checked}
              onIonChange={(e) => checkItemHandler('notAcceptingNewClients')}
            >
              Not accepting new clients
            </IonCheckbox>
          </IonItem>
          <IonItem lines="none">
            <IonCheckbox
              justify="space-between"
              checked={formik.values.notWithinScopeOfExpertise.checked}
              onIonChange={(e) => checkItemHandler('notWithinScopeOfExpertise')}
            >
              Not within scope of expertise
            </IonCheckbox>
          </IonItem>
          <IonItem lines="none">
            <IonCheckbox
              justify="space-between"
              checked={formik.values.needReferral.checked}
              onIonChange={(e) => checkItemHandler('needReferral')}
            >
              Need referral
            </IonCheckbox>
          </IonItem>
          <IonItem lines="none">
            <IonCheckbox
              justify="space-between"
              checked={formik.values.other.checked}
              onIonChange={(e) => checkItemHandler('other')}
            >
              Other
            </IonCheckbox>
          </IonItem>
          {formik.values.other.checked && (
            <IonItem lines="none">
              <IonTextarea
                className={`${CSSprefix}-other`}
                name="other"
                autoGrow
                aria-label="other"
                value={formik.values.other.value}
                onIonInput={(e) => formik.setFieldValue('other', { ...formik.values.other, value: e.detail.value })}
              />
            </IonItem>
          )}
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
