import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonPopover,
  IonText,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import { Patient } from "../../../../state/patientSlice";
import { Services } from "../../../../shared/types/appointment.type";
import { AppointmentDateTime } from "../../CreateAppointment";
import dayjs from "dayjs";
import {
  caretDownOutline,
  caretUpOutline,
  informationCircle,
} from "ionicons/icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../state/store";
import { setLoading } from "../../../../state/loadingSlice";
import {
  createAppointmentAction,
  getEventsAction,
} from "../../../../state/schedulingSlice";
import usePresentToast from "../../../../hooks/usePresentToast";
import { useHistory } from "react-router";
import { APPOINTMENTS } from "../../../../shared/routes/routes";
import { setDate } from "../../../../state/calendarSlice";

import { radioButtonOn, radioButtonOff } from "ionicons/icons";
import "./ReviewDetails.scss";
import { useTranslation } from "react-i18next";
import "dayjs/locale/pt";
import "dayjs/locale/en";
const CSSPrefix = "review-details";

interface ReviewDetailsProps {
  selectedClient?: Patient;
  selectedService?: Services;
  selectedDateTime?: AppointmentDateTime;
  invoiceDataId?: string;
  closeHandler: (close?: boolean) => void;
  goToStep?: (step: number) => void;
}

const ReviewDetails: React.FC<ReviewDetailsProps> = ({
  selectedClient,
  selectedService,
  selectedDateTime,
  invoiceDataId,
  closeHandler,
  goToStep,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [presentToast] = usePresentToast();
  const { provider } = useSelector((state: RootState) => state);
  const history = useHistory();
  const popover = useRef<HTMLIonPopoverElement>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { t, i18n } = useTranslation();
  dayjs.locale(i18n.language);
  const [isChecked, setIsChecked] = useState(false);
  const [repeatOption, setRepeatOption] = useState<string>();
  const [endsAfter, setEndsAfter] = useState<number>(0);

  const handleClick = () => {
    setIsChecked(!isChecked);
  };

  const handleEndsAfterInput = (e: any) => {
    setEndsAfter(e.target.value);
  };

  useEffect(() => {
    if (endsAfter < 0) {
      setEndsAfter(0);
    }
  }, [endsAfter]);

  const openPopover = (e: any) => {
    popover.current!.event = e;
    setPopoverOpen(true);
  };

  const dateTime = useMemo(() => {
    let format = "MMMM D, hh:mm A";

    if (provider?.practice?.displayTwentyFourHourTime) {
      format = "MMMM D, HH:mm";
    }

    if (selectedDateTime) {
      return dayjs(selectedDateTime.startTime).format(format);
    }

    return "";
  }, [selectedDateTime, provider?.practice?.displayTwentyFourHourTime]);

  const selectedDayName = useMemo(() => {
    if (selectedDateTime?.startTime) {
      return dayjs(selectedDateTime.startTime)
        .locale(i18n.language)
        .format("dddd");
    }
    return "";
  }, [selectedDateTime?.startTime, i18n.language]);

  const paymentType = useMemo(() => {
    if (selectedService?.paymentType === "At Completion") {
      return `${t("scheduling_at_session_completion")}`;
    }

    return `${t("schedule_appointment_in_advance_of_session")}`;
  }, [selectedService?.paymentType]);

  const createAppointmentsHandler = async () => {
    let redirect = false;
    if (isChecked) {
      if (!repeatOption) {
        presentToast(
          `${t("recurring_appointment_please_select_value_for_Repeats_on")}`,
          1500,
          "top",
          "danger"
        );
        return;
      }

      if (!endsAfter || endsAfter <= 0) {
        presentToast(
          `${t(
            "recurring_appointment_please_enter_at_least_one_value_for_ends_after"
          )}`,
          1500,
          "top",
          "danger"
        );
        return;
      }
    }

    try {
      dispatch(
        setLoading({
          loading: true,
          message: `${t("schedule_appointment_creating_appointment")}`,
        })
      );

      const [providerPractice] = provider.providerPractices;
      if (
        providerPractice &&
        selectedService?.id &&
        selectedClient?.id &&
        selectedClient?.email &&
        selectedClient?.firstName &&
        selectedClient?.lastName &&
        selectedClient?.patientNumber &&
        selectedDateTime?.startTime &&
        selectedDateTime?.endTime
      ) {
        const startTime = dayjs(selectedDateTime.startTime);
        const endTimeByDuration = startTime.add(
          selectedService?.duration || 0,
          "minutes"
        );
        const payload = {
          practiceId: providerPractice.practiceId,
          providerId: providerPractice.providerId,
          payload:
            isChecked && endsAfter && repeatOption
              ? {
                
                  patientServiceId: selectedService.id,
                  patientId: selectedClient.id,
                  patientEmail: selectedClient.email,
                  patientName: `${selectedClient.firstName} ${selectedClient.lastName}`,
                  patientNumber: selectedClient.patientNumber,
                  startTime: startTime.toISOString(),
                  endTime: endTimeByDuration.toISOString(),
                  invoiceDataId,
                  count: endsAfter,
                  frequency: repeatOption,
                  recurring: isChecked,
                }
              : {
                
                  patientServiceId: selectedService.id,
                  patientId: selectedClient.id,
                  patientEmail: selectedClient.email,
                  patientName: `${selectedClient.firstName} ${selectedClient.lastName}`,
                  patientNumber: selectedClient.patientNumber,
                  startTime: startTime.toISOString(),
                  endTime: endTimeByDuration.toISOString(),
                  invoiceDataId,
                  recurring: false,
                },
        };

        const response: any = await dispatch(createAppointmentAction(payload));

        const responsePayload = response?.payload?.id
          ? response?.payload?.id
          : response?.payload;

        if (
          responsePayload &&
          response.type === "scheduling/createAppointment/fulfilled"
        ) {
          await dispatch(
            getEventsAction({
              practiceId: providerPractice.practiceId,
              providerId: providerPractice.providerId,
              start: dayjs(selectedDateTime?.startTime)
                .startOf("day")
                .toISOString(),
              end: dayjs(selectedDateTime?.startTime)
                .endOf("day")
                .toISOString(),
              pageNumber: 0,
              pageSize: 999,
            })
          );

          dispatch(
            setDate(
              dayjs(selectedDateTime?.startTime).startOf("day").toISOString()
            )
          );
          dispatch(setLoading({ loading: false, message: "" }));
          redirect = true;
          closeHandler(true);
        }

        if (!response.payload) {
          closeHandler(true);
          presentToast(
            `${t("toast_messages_error_create_appointment")}`,
            1000,
            "middle",
            "danger"
          );
          dispatch(setLoading({ loading: false, message: "" }));
        }
      }
    } catch (error) {
      dispatch(setLoading({ loading: false, message: "" }));
      closeHandler();
      presentToast(
        `${t("toast_messages_error_create_appointment")}`,
        1000,
        "top",
        "danger"
      );
      console.error(`${t("toast_messages_error_create_appointment")} :`, error);
    } finally {
      if (redirect) {
        history.push(APPOINTMENTS);
      }
    }
  };

  const duration = useMemo(() => {
    let parsedDuration = "";

    if (selectedService?.duration) {
      const minutes = selectedService.duration;
      const hours = Math.floor(minutes / 60);

      if (minutes > 60) {
        parsedDuration = `${hours} hours`;
      }

      if (minutes === 60) {
        parsedDuration = `${hours} hour`;
      }

      if (minutes < 60) {
        parsedDuration = `${minutes} min`;
      }
    }

    return parsedDuration;
  }, [selectedService?.duration]);

  return (
    <div className={CSSPrefix}>
      <IonText className="title">{t("schedule_appointment")}</IonText>

      <div className={`${CSSPrefix}-subtitle`}>
        <IonText>
          {t("schedule_appointment_review_appointment_details")}
        </IonText>
      </div>
      <div
        className="custom-input-container"
        onClick={() => goToStep && goToStep(0)}
      >
        <label className="custom-label">{t("scheduling_client")}</label>

        <span className="custom-value">{`${selectedClient?.firstName} ${selectedClient?.lastName}`}</span>
      </div>
      <div
        className="custom-input-container"
        onClick={() => goToStep && goToStep(1)}
      >
        <label className="custom-label">{t("scheduling_service")}</label>

        <span className="custom-value">
          {`${selectedService?.name} (${selectedService?.location}, ${duration})`}
        </span>
      </div>
      <div
        className="custom-input-container"
        onClick={() => goToStep && goToStep(2)}
      >
        <label className="custom-label">
          {t("schedule_appointment_date_and_time")}
        </label>

        <span className="custom-value">{dateTime}</span>
      </div>

      <div className="custom-radio-container" onClick={handleClick}>
        <IonIcon
          icon={isChecked ? radioButtonOn : radioButtonOff}
          className="custom-radio-icon"
        />
        <span className="custom-radio-label">{t("recurring_appointment")}</span>
      </div>

     {isChecked  && (
            <IonGrid>
              <IonRow class={`${CSSPrefix}-recurring-appointment-row`}>
              <IonCol size="5.7" className="custom-input-container2">
                  
                  <label className="custom-label">
                      {t('recurring_appointment_repeats_on')}
                   </label>
                    <IonSelect
                      className="custom-select custom-label"
                      placeholder={t('recurring_appointment_repeats_select')}
                      interface="action-sheet"
                      cancelText={t('log_out_cancel')}
                      value={repeatOption}
                      onIonChange={e => setRepeatOption(e.detail.value)}
                    >
                      <IonSelectOption value="Daily">
                        {t('recurring_appointment_repeats_daily')}
                      </IonSelectOption>
                      <IonSelectOption value="Weekly">
                        {t('recurring_appointment_weekly_on_day')} {selectedDayName}
                      </IonSelectOption>
                      <IonSelectOption value="Biweekly">
                        {t('recurring_appointment_every_two_weeks_on_day')} {selectedDayName}
                      </IonSelectOption>
                      <IonSelectOption value="Monthly">
                        {t('recurring_appointment_montly_on_the_third_day')} {selectedDayName}
                      </IonSelectOption>
                    </IonSelect>
                 
                </IonCol>
    
                <IonCol size="5.7" className="custom-input-container2">
                  
                  <label className="custom-label">
                      {t('recurring_appointment_ends_after')}
                   </label>
                    <IonInput
                      className="custom-input custom-label"
                      type="number"
                      value={endsAfter}
                      placeholder="0"
                      onIonInput={handleEndsAfterInput}
                    />
                    <IonIcon
                      className="caretUpOutline"
                      onClick={() => setEndsAfter(prev => Number(prev || 0) + 1)}
                      icon={caretUpOutline}
                    />
                    <IonIcon
                      className="caretDownOutline"
                      onClick={() => setEndsAfter(prev => Math.max(0, Number(prev || 0) - 1))}
                      icon={caretDownOutline}
                    />
                
                </IonCol>
              </IonRow>
            </IonGrid>
          )}

      <div className="custom-input-container">
        <div className="custom-label-with-icon">
          <label className="custom-label">{t("scheduling_payment_type")}</label>
          <IonIcon
            className="info-icon"
            icon={informationCircle}
            onClick={openPopover}
          />
        </div>
        <span className="custom-radio-label">{paymentType}</span>
      </div>
      <IonButton
        className={`${CSSPrefix}-schedule-button ion-padding`}
        color="primary"
        expand="block"
        onClick={async () => createAppointmentsHandler()}
      >
        {t("schedule_appointment")}
      </IonButton>
      <IonPopover
        className="info-popover"
        ref={popover}
        isOpen={popoverOpen}
        onDidDismiss={() => setPopoverOpen(false)}
        triggerAction="hover"
      >
        <div className="info-popover-content">
          <IonIcon
            className={`${CSSPrefix}-info-icon`}
            icon={informationCircle}
            onClick={openPopover}
          />
          {t("toast_messages_payment_type_message")}
        </div>
      </IonPopover>
    </div>
  );
};

export default ReviewDetails;
