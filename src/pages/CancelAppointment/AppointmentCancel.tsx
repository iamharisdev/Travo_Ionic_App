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
import { AppointmentDetailTypeEnum } from "../../shared/types/appointment.type";

import "./AppointmentCancel.scss";
import { APPOINTMENT_REQUESTS, APPOINTMENTS } from "../../shared/routes/routes";
import { useTranslation } from "react-i18next";

const CSSprefix = 'appointment-cancel';

const AppointmentCancel: React.FC = (): React.ReactElement => {
  const { provider } = useSelector((state: RootState) => state);
  const location = useLocation<CancelAppointmentState>();
  const dispatch = useDispatch<AppDispatch>();
  const [presentToast] = usePresentToast();
  const history = useHistory();
    const {t} = useTranslation();

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

  const { title, description, buttonText }: { title: string, description: string, buttonText: string } = useMemo(() => {
    let title = `${t("scheduling_cancel_appointment")}`;
    let description = `${t("cancel_appointment_reason_message")}`;
    let buttonText = `${t("scheduling_cancel_appointment")}`;

    if (location?.state?.type === AppointmentDetailTypeEnum.ACCEPT) {
      title = 'Appointment request not accepted';
      description = 'Select a reason to not accepting the request';
      buttonText = 'Decline request';
    }

    return { title, description, buttonText }
  }, [location?.state?.type]);

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
          if (location?.state?.type === AppointmentDetailTypeEnum.RESCHEDULE) {
            history.push(APPOINTMENTS);
          }

          if (location?.state?.type === AppointmentDetailTypeEnum.ACCEPT) {
            history.push(APPOINTMENT_REQUESTS);
          }
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
              {title}
            </IonText>
          </IonRow>
          <IonRow>
            <IonText className={`${CSSprefix}-description`}>
              {description}
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
              {t("cancel_appointment_not_accepting_new_clients")}
            </IonCheckbox>
          </IonItem>
          <IonItem lines="none">
            <IonCheckbox
              justify="space-between"
              checked={formik.values.notWithinScopeOfExpertise.checked}
              onIonChange={(e) => checkItemHandler('notWithinScopeOfExpertise')}
            >
              {t("cancel_appointment_not_within_scope_of_expertise")}
            </IonCheckbox>
          </IonItem>
          <IonItem lines="none">
            <IonCheckbox
              justify="space-between"
              checked={formik.values.needReferral.checked}
              onIonChange={(e) => checkItemHandler('needReferral')}
            >
              {t("cancel_appointment_need_referral")}
            </IonCheckbox>
          </IonItem>
          <IonItem lines="none">
            <IonCheckbox
              justify="space-between"
              checked={formik.values.other.checked}
              onIonChange={(e) => checkItemHandler('other')}
            >
              {t("cancel_appointment_other")}
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
          {buttonText}
        </IonButton>
      </IonContent>
    </IonPage >
  );
};

export default AppointmentCancel;
