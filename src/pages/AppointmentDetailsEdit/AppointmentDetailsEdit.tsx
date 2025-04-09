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
import { useHistory, useLocation } from "react-router";
import { caretDownOutline, caretUpOutline, informationCircle } from "ionicons/icons";
import { AppointmentDetailsEditState } from "./AppointmentDetailsEdit.type";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import { editAppointmentSchema } from "./validation/appointmentDetailsEdit.schema";
import { setLoading } from "../../state/loadingSlice";
import { editAppointmentAction, getEventsAction } from "../../state/schedulingSlice";
import usePresentToast from "../../hooks/usePresentToast";
import dayjs from "dayjs";

import "./AppointmentDetailsEdit.scss";
import { useTranslation } from "react-i18next";

const CSSprefix = 'appointment-details-edit';

const AppointmentDetailsEdit: React.FC = (): React.ReactElement => {
  const { provider, scheduling: { services }, calendar: { selectedDate, selectedDates } } = useSelector((state: RootState) => state);
  const location = useLocation<AppointmentDetailsEditState>();
  const history = useHistory();
  const dispatch = useDispatch<AppDispatch>();
  const [presentToast] = usePresentToast();
        const {t} = useTranslation();
  const initialValues = useMemo(() => ({
    patientName: location?.state?.patientName || '',
    patientServiceName: location?.state?.patientServiceName || '',
    price: location?.state?.price || '',
    location: location?.state?.location || '',
    startTime: location?.state?.startTime || '',
    endTime: location?.state?.endTime || '',
    patientServiceId: location?.state?.patientServiceId || '',
  }), [location?.state]);
  const { practiceId, providerId }: { practiceId: string, providerId: string } = useMemo(() => {
    let practiceId = '';
    let providerId = '';

    if (provider.providerPractices.length > 0) {
      const [providerPractice] = provider.providerPractices;

      return { practiceId: providerPractice.practiceId, providerId: providerPractice.providerId };
    }

    return { practiceId, providerId };
  }, [provider.providerPractices]);

  const getAppointmentsHandler = async () => {
    try {
      const [providerPractice] = provider.providerPractices;
      if (providerPractice) {
        await dispatch(getEventsAction({
          practiceId: providerPractice.practiceId,
          providerId: providerPractice.providerId,
          start: dayjs(selectedDates[0]).startOf('day').toISOString(),
          end: dayjs(selectedDates[1]).endOf('day').toISOString(),
          pageNumber: 0,
          pageSize: 999,
        }));
      }
    } catch (error) {
      console.error('error at load appointments by date: ', error);
    }
  }

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const valid = await editAppointmentSchema.validate(values);

      if (valid && practiceId && providerId && location.state.appointmentId) {
        dispatch(setLoading({ loading: true }));
        const response = await dispatch(editAppointmentAction({
          practiceId,
          providerId,
          appointmentId: location.state.appointmentId,
          payload: {
            location: formik.values.location,
            patientServiceId: formik.values.patientServiceId,
            startTime: formik.values.startTime,
            endTime: formik.values.endTime
          }
        }));

        if (response.meta.requestStatus === 'fulfilled') {
          await getAppointmentsHandler();
          dispatch(setLoading({ loading: false, message: undefined }));
          history.goBack();
        }

        if (response.meta.requestStatus === 'rejected') {
          presentToast(
            '¡Error at edit appointment location!',
            1000,
            'top',
            'danger'
          );
        }

        dispatch(setLoading({ loading: false, message: undefined }));
      }
    },
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
            {t("scheduling_edit_appointment")}
            </IonText>
          </IonRow>
          <IonRow>
            <IonText className={`${CSSprefix}-description`}>
            {t("scheduling_edit_appointment_details")}
            </IonText>
          </IonRow>
        </IonGrid>
        <IonList>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical`}
          >
            <IonLabel position="stacked" className={`${CSSprefix}-label-disabled`} class="custom-input">
              {t("scheduling_client")}
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
              {t("scheduling_service")}
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
              {t("scheduling_adjusted_price")}
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
            <IonLabel position="stacked" class="custom-input">{t("scheduling_location")}</IonLabel>
            <IonSelect
              name="location"
              toggleIcon={caretDownOutline}
              expandedIcon={caretUpOutline}
              selectedText={formik.values.location}
              value={formik.values.location}
              onIonChange={(e) => formik.setFieldValue('location', e.detail.value)}
            >
              <IonSelectOption value="Online">{t("scheduling_online")}</IonSelectOption>
              <IonSelectOption value="In Person">In Person</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical`}
          >
            <IonLabel position="stacked" className={`${CSSprefix}-label-disabled`} class="custom-input">
              {t("scheduling_payment_type")}
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
            {t("scheduling_save_changes")}
          </IonButton>
        </IonList>
      </IonContent>
    </IonPage >
  );
};

export default AppointmentDetailsEdit;
