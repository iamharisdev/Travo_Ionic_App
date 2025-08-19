import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonPopover,
  IonSelect,
  IonSelectOption,
  IonText,
  useIonViewDidEnter,
  useIonViewDidLeave,
} from '@ionic/react';
import { Services } from '../../../../shared/types/appointment.type';
import { addOutline, caretDownOutline, caretUpOutline, informationCircle } from 'ionicons/icons';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../../../state/store';
import { AcceptInvoicePayload, Preview, Templates } from '../../../../shared/types/invoice.type';
import InvoiceCard from '../../../InvoiceCard/InvoiceCard';
import InvoiceDiscountCard from '../../../InvoiceDiscountCard/InvoiceDiscountCard';
import {
  acceptInvoiceTemplate,
  generateInvoicePreview,
  getInvoiceTemplates,
} from '../../../../api/services/billing';
import { FieldArray, Form, Formik } from 'formik';
import dayjs from 'dayjs';
import { AppointmentDateTime } from '../../RescheduleAppointment';

import './PaidInAdvance.scss';
import { useTranslation } from 'react-i18next';
import { setLoading } from '../../../../state/loadingSlice';

const CSSPrefix = 'paid-in-advance';

interface PaidInAdvanceProps {
  selectedService?: Services;
  selectedClientId?: string;
  selectedDateTime?: AppointmentDateTime;
  setInvoiceDataId: (id: string) => void;
}

const PaidInAdvance: React.FC<PaidInAdvanceProps> = ({
  selectedService,
  selectedClientId,
  selectedDateTime,
  setInvoiceDataId,
}) => {
  const [preview, setPreview] = useState<Preview>();
  const [templates, setTemplates] = useState<Templates>();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const { provider, practice } = useSelector((state: RootState) => state);

  const duration = useMemo(() => {
    let parsedDuration = '';

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

  const initialValues: Preview = useMemo(() => {
    if (preview)
      return {
        ...preview,
      };

    return {
      lines: [],
      subtotal: 0,
      total: 0,
      templateId: null,
      discount: 0,
    };
  }, [preview]);

  const currency = practice.lookupCurrencies.find(
    ({ currency }) => currency === selectedService?.currency
  );

  const generateInvoicePreviewHandler = useCallback(async () => {
    try {
      const [providerPractice] = provider.providerPractices;

      if (providerPractice && selectedService) {
        dispatch(setLoading({ loading: true, message: 'Loading invoice preview...' }));
        const res = await generateInvoicePreview(
          selectedService.practiceId,
          selectedService.providerId,
          selectedService.id,
          {
            patientId: selectedClientId!!,
            currency: currency?.currency!!,
            currencySymbol: currency?.symbol!!,
            amount: selectedService.price,
            appointmentDate: dayjs(selectedDateTime?.startTime).toISOString()!!,
          }
        );

        if (res.status === 200) {
          dispatch(setLoading({ loading: false, message: '' }));
          setPreview(res.data);
        }
      }
    } catch (error) {
      dispatch(setLoading({ loading: false, message: '' }));
      console.error('[generate-invoice-handler]: ', error);
    }
  }, [selectedService, selectedClientId, selectedDateTime, provider.providerPractices, currency]);

  const getInvoiceTemplatesHandler = useCallback(async () => {
    try {
      if (
        practice?.businessInformation?.country &&
        selectedService?.practiceId &&
        selectedService.providerId
      ) {
        dispatch(setLoading({ loading: true, message: 'Loading invoice templates...' }));
        const res = await getInvoiceTemplates(
          selectedService.practiceId,
          selectedService.providerId,
          practice.businessInformation.country,
          0,
          999
        );

        if (res.status === 200) {
          dispatch(setLoading({ loading: false, message: '' }));
          setTemplates(res.data);
        }
      }
    } catch (error) {
      dispatch(setLoading({ loading: false, message: '' }));
      console.error('[get-invoice-templates-handler]: ', error);
    }
  }, [practice.businessInformation?.country, selectedService]);

  const acceptInvoiceHandler = useCallback(
    async (values: Preview) => {
      try {
        if (
          selectedService?.practiceId &&
          selectedService?.providerId &&
          values.templateId !== null
        ) {
          const res = await acceptInvoiceTemplate(
            selectedService.practiceId,
            selectedService.providerId,
            values as AcceptInvoicePayload
          );

          if (res.status === 200) {
            setInvoiceDataId(res.data.id);
          }
        }
      } catch (error) {
        console.error('[accept-invoice-handler]: ', error);
      }
    },
    [selectedService, setInvoiceDataId]
  );

  useEffect(() => {
    if (!preview) {
      generateInvoicePreviewHandler();
    }

    if (!templates) {
      getInvoiceTemplatesHandler();
    }
  }, [
    selectedService,
    selectedClientId,
    selectedDateTime,
    provider.providerPractices,
    practice.businessInformation,
  ]);

  const calculateDiscountHandler = (
    discount: number,
    setFieldValue: (field: string, value: any) => void
  ) => {
    if (discount > 0 && preview) {
      const newTotal = preview.total - discount;
      setFieldValue('subtotal', preview.subtotal);
      setFieldValue('total', newTotal);
      setFieldValue('discount', discount);
    }

    if (discount === 0 && preview) {
      setFieldValue('subtotal', preview?.subtotal);
      setFieldValue('total', preview?.total);
      setFieldValue('discount', preview?.discount);
    }
  };

  useIonViewDidLeave(() => {
    setPreview(undefined);
    setTemplates(undefined);
  });

  const form = useMemo(
    () => (
      <>
        <Formik
          initialValues={initialValues}
          onSubmit={acceptInvoiceHandler}
          enableReinitialize={true}
        >
          {({ values, setFieldValue, handleSubmit }) => (
            <Form>
              <div className={`${CSSPrefix}-main-form-container`}>
                <div className={`${CSSPrefix}-form`}>
                  <IonItem lines="none">
                    <IonLabel className={`${CSSPrefix}-service`}>
                      {selectedService?.name}
                      <p>
                        {selectedService?.location}, {duration}
                      </p>
                    </IonLabel>
                    {/* <IonText className={`${CSSPrefix}-price`}>{`${currency?.symbol!!}${preview?.total?.toFixed(2)}`}</IonText> */}
                    <IonText className={`${CSSPrefix}-price`}>
                      {currency?.symbol && preview?.total !== undefined
                        ? `${currency.symbol}${preview.total.toFixed(2)}`
                        : `${currency?.symbol} 0.00`}
                    </IonText>
                  </IonItem>
                  <FieldArray name="lines">
                    {({ push, remove, form: { setFieldValue } }) => (
                      <>
                        {values.lines.map((line, index) => (
                          <InvoiceCard
                            key={index}
                            name={`lines.${index}`}
                            line={line}
                            currencySymbol={currency?.symbol!!}
                            removeLineItem={() => remove(index)}
                            setFieldValue={setFieldValue}
                          />
                        ))}
                        {/* 
                    // TODO: uncomment this in app V2
                    <IonButton
                      fill="clear"
                      expand="full"
                      color="primary"
                      onClick={() => push({
                        code: '',
                        description: '',
                        icd10Code: '',
                        amount: 0,
                        serviceDate: dayjs(selectedDateTime?.startTime).toISOString(),
                      })}
                    >
                      {t("schedule_appointment_add_new_line_item")}
                      <IonIcon icon={addOutline} slot="start" />
                    </IonButton> */}
                      </>
                    )}
                  </FieldArray>
                  <InvoiceDiscountCard
                    setDiscountCB={discount => calculateDiscountHandler(discount, setFieldValue)}
                    maxDiscount={preview?.total!!}
                    currencySymbol={currency?.symbol!!}
                  />
                  <IonItem lines="none" className="ion-no-margin">
                    <div className={`${CSSPrefix}-invoice-select-container`}>
                      <IonText>{t('schedule_appointment_invoice_template')}</IonText>
                      <IonSelect
                        name="templateId"
                        interface="action-sheet"
                        toggleIcon={caretDownOutline}
                        expandedIcon={caretUpOutline}
                        cancelText={t('log_out_cancel')}
                        placeholder={t('schedule_appointment_Select_your_invoice_template')}
                        selectedText={
                          templates?.items.find(({ id }) => values.templateId === id)?.templateName
                        }
                        value={values.templateId}
                        onIonChange={e => setFieldValue('templateId', e.detail.value)}
                      >
                        {templates?.items.map(({ id, templateName }) => (
                          <IonSelectOption key={id} value={id} color="dark">
                            {templateName}
                          </IonSelectOption>
                        ))}
                      </IonSelect>
                    </div>
                  </IonItem>
                </div>
                <div className="footer">
                  <div className="footer-container">
                    <IonText className="subtotal">{t('schedule_appointment_sub_total')}:</IonText>
                    <IonText className="subtotal right">{`${currency?.symbol!!}${values?.subtotal.toFixed(
                      2
                    )}`}</IonText>
                  </div>
                  <div className="footer-container">
                    <IonText className="subtotal">{t('schedule_appointment_discount')}:</IonText>
                    <IonText className="subtotal right">{`${currency?.symbol!!}${values?.discount.toFixed(
                      2
                    )}`}</IonText>
                  </div>
                  <div className="footer-container">
                    <IonText className="total">{t('schedule_appointment_total')}:</IonText>
                    <IonText className="total right">{`${currency?.symbol!!}${values?.total.toFixed(
                      2
                    )}`}</IonText>
                  </div>
                  <IonButton
                    fill="solid"
                    expand="block"
                    color="primary"
                    type="submit"
                    className="footer-button"
                    disabled={!values.templateId}
                    onClick={() => handleSubmit()}
                  >
                    {t('schedule_appointment_next')}
                  </IonButton>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </>
    ),
    [selectedService, initialValues, duration, templates, preview, calculateDiscountHandler]
  );

  return (
    <div className={CSSPrefix}>
      <IonItem lines="none" className="ion-no-margin">
        <IonText className={`${CSSPrefix}-title`}>{t('schedule_appointment')}</IonText>
      </IonItem>
      <IonItem lines="none" className="ion-no-margin">
        <IonText className={`${CSSPrefix}-subtitle`}>
          {t('schedule_appointment_invoice_review')}
        </IonText>
      </IonItem>
      {form}
    </div>
  );
};

export default PaidInAdvance;
