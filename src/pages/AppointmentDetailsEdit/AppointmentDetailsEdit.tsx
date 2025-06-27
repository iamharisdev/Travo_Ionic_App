import React, { useMemo, useState } from 'react';
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonInput,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
} from '@ionic/react';
import Header from '../../components/Header/Header';
import { useFormik } from 'formik';
import { useHistory, useLocation } from 'react-router';
import {
  caretDownOutline,
  caretUpOutline,
  informationCircle,
  radioButtonOff,
  radioButtonOn,
} from 'ionicons/icons';
import { AppointmentDetailsEditState } from './AppointmentDetailsEdit.type';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../state/store';
import { editAppointmentSchema } from './validation/appointmentDetailsEdit.schema';
import { setLoading } from '../../state/loadingSlice';
import {
  editAppointmentAction,
  editAppointmentRecurringAction,
  getEventsAction,
  rescheduleAppointmentAction,
} from '../../state/schedulingSlice';
import usePresentToast from '../../hooks/usePresentToast';
import dayjs from 'dayjs';

import './AppointmentDetailsEdit.scss';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { APPOINTMENTS } from '../../shared/routes/routes';
import { setDate } from '../../state/calendarSlice';
import { editAppointmentsRecurring } from '../../api/services/scheduling';

const CSSprefix = 'appointment-details-edit';

const AppointmentDetailsEdit: React.FC = (): React.ReactElement => {
  const {
    provider,
    scheduling: { services },
    calendar: { selectedDate, selectedDates },
  } = useSelector((state: RootState) => state);
  const location = useLocation<AppointmentDetailsEditState>();
  const history = useHistory();
  const dispatch = useDispatch<AppDispatch>();
  const [presentToast] = usePresentToast();
  const { t } = useTranslation();

  const event = location?.state?.event;
  const selected = location?.state?.selected;

  const [isChecked, setIsChecked] = useState(event?.recurring);
  const [endsAfter, setEndsAfter] = useState<number>(event?.count);
  const [repeatOption, setRepeatOption] = useState<string>(event?.frequency);

  // console.log("Location:=>  ",location?.state?.location )

  const initialValues = useMemo(
    () => ({
      patientName: location?.state?.patientName || '',
      patientServiceName: location?.state?.patientServiceName || '',
      price: location?.state?.price || '',
      location: location?.state?.location || '',
      startTime: location?.state?.startTime || '',
      endTime: location?.state?.endTime || '',
      patientServiceId: location?.state?.patientServiceId || '',
    }),
    [location?.state]
  );
  const { practiceId, providerId }: { practiceId: string; providerId: string } = useMemo(() => {
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
        await dispatch(
          getEventsAction({
            practiceId: providerPractice.practiceId,
            providerId: providerPractice.providerId,
            start: dayjs(selectedDates[0]).startOf('day').toISOString(),
            end: dayjs(selectedDates[1]).endOf('day').toISOString(),
            pageNumber: 0,
            pageSize: 999,
          })
        );
      }
    } catch (error) {
      console.error('error at load appointments by date: ', error);
    }
  };

  const editRecurringAppointments = async () => {
    let redirect = false;
    if (isChecked) {
      if (!repeatOption) {
        presentToast(
          `${t('recurring_appointment_please_select_value_for_Repeats_on')}`,
          1500,
          'top',
          'danger'
        );
        return;
      }

      if (!endsAfter || endsAfter <= 0) {
        presentToast(
          `${t('recurring_appointment_please_enter_at_least_one_value_for_ends_after')}`,
          1500,
          'top',
          'danger'
        );
        return;
      }
    }

    try {
      dispatch(
        setLoading({ loading: true, message: `${t('schedule_appointment_creating_appointment')}` })
      );

      const [providerPractice] = provider.providerPractices;
      if (providerPractice) {
        const startTime = dayjs(formik.values.startTime);

        const endTimeByDuration = startTime.add(15, 'minutes');
        const practiceId = providerPractice.practiceId;
        const providerId = providerPractice.providerId;
        const recurring = event?.recurring;

        const response: any = await dispatch(
          editAppointmentRecurringAction({
            practiceId,
            providerId,
            appointmentId: location?.state?.appointmentId,
            payload: {
              frequency: repeatOption || 'Monthly',
              count: endsAfter || 1,
              recurring: recurring,
              futureAppointments: [],
              ignoreOthers: selected == 'this' ? true : false,
              patientEmail: event?.patientEmail,
              patientId: event?.patientId,
              patientName: event?.patientName,
              patientNumber: event?.patientNumber,
              patientServiceId: event?.patientServiceId || '',
              startTime: startTime.toISOString(),
              endTime: endTimeByDuration.toISOString(),
              price: event?.price || 0,
              location: event?.location,
              invoiceDataId: event?.invoiceDataId || '',
            },
          })
        );

        const responsePayload = response?.payload?.id ? response?.payload?.id : response?.payload;

        if (responsePayload && response.type === 'scheduling/editAppointmentRecurring/fulfilled') {
          await dispatch(
            getEventsAction({
              practiceId: providerPractice.practiceId,
              providerId: providerPractice.providerId,
              start: dayjs(formik.values.startTime).startOf('day').toISOString(),
              end: dayjs(formik.values.startTime).endOf('day').toISOString(),
              pageNumber: 0,
              pageSize: 999,
            })
          );

          dispatch(setDate(dayjs(formik.values.startTime).startOf('day').toISOString()));
          dispatch(setLoading({ loading: false, message: '' }));
          redirect = true;
        }

        if (!response.payload) {
          presentToast(`${t('toast_messages_error_create_appointment')}`, 1000, 'middle', 'danger');
          dispatch(setLoading({ loading: false, message: '' }));
        }
      }
    } catch (error) {
      dispatch(setLoading({ loading: false, message: '' }));

      presentToast(`${t('toast_messages_error_create_appointment')}`, 1000, 'top', 'danger');
      console.error(`${t('toast_messages_error_create_appointment')} :`, error);
    } finally {
      if (redirect) {
        history.push(APPOINTMENTS);
      }
    }
  };

  const editAppointmentWithOutRecurring = async (valid: any) => {
    if (valid && practiceId && providerId && location.state.appointmentId) {
      dispatch(setLoading({ loading: true }));
      const response = await dispatch(
        editAppointmentAction({
          practiceId,
          providerId,
          appointmentId: location.state.appointmentId,
          payload: {
            location: formik?.values?.location,
            patientServiceId: formik?.values?.patientServiceId,
            startTime: formik?.values?.startTime,
            endTime: formik?.values?.endTime,
          },
        })
      );

      if (response.meta.requestStatus === 'fulfilled') {
        await getAppointmentsHandler();
        dispatch(setLoading({ loading: false, message: undefined }));
        history.goBack();
      }

      if (response.meta.requestStatus === 'rejected') {
        presentToast(`${t('toast_messages_error_edit_appointment')}`, 1000, 'top', 'danger');
      }

      dispatch(setLoading({ loading: false, message: undefined }));
    }
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: async values => {
      const valid = await editAppointmentSchema.validate(values);

      if (event?.recurring) {
        editRecurringAppointments();
      } else {
        editAppointmentWithOutRecurring(valid);
      }
    },
  });

  const paymentType = useMemo(() => {
    const servicePaymentType = services?.patientServiceRequestDtos.find(
      ({ id }) => id === location?.state?.patientServiceId
    )?.paymentType;
  
    if (servicePaymentType === 'At Completion') {
      return `${t('scheduling_at_session_completion')}`;
    }
  
    return `${t('schedule_appointment_in_advance_of_session')}`;
  }, [location?.state?.patientServiceId, services, t]);
  const handleClick = () => {
    setIsChecked(!isChecked);
  };

  const handleEndsAfterInput = (e: any) => {
    setEndsAfter(e.target.value);
  };

  const selectedDayName = useMemo(() => {
    if (event?.startTime) {
      return dayjs(event?.startTime).locale(i18n.language).format('dddd');
    }
    return '';
  }, [event?.startTime, i18n.language]);

  function formatLabel(label:string) {
    return label.toLowerCase().replace(/\s+/g, '_');
  }

  const translatedText = t(formatLabel(formik.values.location));

  

  return (
    <IonPage className={CSSprefix}>
      <Header showBack showMenu={false} />
      <IonContent fullscreen={true} className={CSSprefix}>
        <IonText className="title">{t('scheduling_edit_appointment')}</IonText>

        <div className="subtitle">
          <IonText> {t('scheduling_edit_appointment_details')}</IonText>
        </div>

        <div className="custom-input-container">
          <label className="custom-label">{t('scheduling_client')}</label>
          <IonInput disabled class="custom-value" type="text" value={formik.values.patientName} />
        </div>

        <div className="custom-input-container">
          <label className="custom-label"> {t('scheduling_service')}</label>
          <IonSelect
            disabled
            name="service"
            toggleIcon={caretDownOutline}
            expandedIcon={caretUpOutline}
            selectedText={`${formik.values.patientServiceName} (${location?.state?.duration})`}
            value={formik.values.patientServiceName}
            onIonChange={e => formik.setFieldValue('patientServiceName', e.detail.value)}
          >
            {services?.patientServiceRequestDtos.map(({ id, name }) => (
              <IonSelectOption key={id} value={name}>
                {name}
              </IonSelectOption>
            ))}
          </IonSelect>
        </div>

        <div className="custom-input-container">
          <label className="custom-label"> {t('scheduling_adjusted_price')}</label>
          <IonInput disabled class="custom-value" type="number" value={formik.values.price} />
        </div>

        <div className="custom-input-container">
          <label className="custom-label"> {t('scheduling_location')}</label>
          <IonSelect
            name="location"
            toggleIcon={caretDownOutline}
            expandedIcon={caretUpOutline}
            cancelText={t('log_out_cancel')}
            selectedText={translatedText}
            value={formik.values.location}
            onIonChange={e => formik.setFieldValue('location', e.detail.value)}
          >
            <IonSelectOption value={'Online'}>
              {t('scheduling_online')}
            </IonSelectOption>
            <IonSelectOption value={'In Person'}>
              {t('scheduling_in_person')}
            </IonSelectOption>
          </IonSelect>
        </div>

        <div className="custom-input-container">
          <div className="custom-label-with-icon">
            <label className="custom-label"> {t('scheduling_payment_type')}</label>
            <IonIcon className="info-icon" icon={informationCircle} />
          </div>

          <IonInput disabled class="custom-value" type="text" value={paymentType} />
        </div>
        {event?.recurring && selected === 'thisAndFollowing' && (
          <>
            <div className="custom-radio-container">
              <IonIcon
                icon={isChecked ? radioButtonOn : radioButtonOff}
                className="custom-radio-icon"
              />
              <span className="custom-radio-label">{t('recurring_appointment')}</span>
            </div>

            {isChecked && (
              <IonGrid>
                <IonRow class="recurring-appointment-row">
                  <IonCol size="5.7" className="custom-input-container2">
                    <label className="custom-label">{t('recurring_appointment_repeats_on')}</label>
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
                    <label className="custom-label">{t('recurring_appointment_ends_after')}</label>
                    <div className="flex-row">
                      <IonInput
                        type="number"
                        value={endsAfter}
                        placeholder="0"
                        onIonInput={handleEndsAfterInput}
                      />
                      <div className="flex-cloumn">
                        <IonIcon
                          onClick={() => setEndsAfter(prev => Number(prev || 0) + 1)}
                          icon={caretUpOutline}
                        />
                        <IonIcon
                          onClick={() => setEndsAfter(prev => Math.max(0, Number(prev || 0) - 1))}
                          icon={caretDownOutline}
                        />
                      </div>
                    </div>
                  </IonCol>
                </IonRow>
              </IonGrid>
            )}
          </>
        )}

        <IonButton
          className="ion-padding"
          color="primary"
          expand="block"
          disabled={!formik.dirty}
          onClick={() => formik.submitForm()}
        >
          {t('scheduling_save_changes')}
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default AppointmentDetailsEdit;
