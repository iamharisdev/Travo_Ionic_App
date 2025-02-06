import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IonButton, IonIcon, IonItem, IonLabel, IonSelect, IonSelectOption, IonText, useIonViewDidLeave } from '@ionic/react';
import { Services } from '../../../../shared/types/appointment.type';
import { addOutline, caretDownOutline, caretUpOutline } from 'ionicons/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../state/store';
import usePresentToast from '../../../../hooks/usePresentToast';
import { AcceptInvoicePayload, Preview, Templates } from '../../../../shared/types/invoice.type';
import InvoiceCard from '../../../InvoiceCard/InvoiceCard';
import InvoiceDiscountCard from '../../../InvoiceDiscountCard/InvoiceDiscountCard';
import { acceptInvoiceTemplate, generateInvoicePreview, getInvoiceTemplates } from '../../../../api/services/billing';
import { Patient } from '../../../../state/patientSlice';
import { AppointmentDateTime } from '../../CreateAppointment';
import dayjs from 'dayjs';
import { FieldArray, Form, Formik } from 'formik';

import './PaidInAdvance.scss';

const CSSPrefix = 'paid-in-advance';

interface PaidInAdvanceProps {
  selectedService?: Services;
  selectedClient?: Patient;
  selectedDateTime?: AppointmentDateTime;
  setInvoiceDataId: (id: string) => void;
}

const PaidInAdvance: React.FC<PaidInAdvanceProps> = ({ selectedService, selectedClient, selectedDateTime, setInvoiceDataId }) => {
  const formRef: any = useRef();
  const [preview, setPreview] = useState<Preview>();
  const [templates, setTemplates] = useState<Templates>();
  const [presentToast] = usePresentToast();
  const {
    provider,
    practice,
  } = useSelector((state: RootState) => state);

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
    if (preview) return {
      ...preview
    }

    return {
      lines: [],
      subtotal: 0,
      total: 0,
      templateId: null,
      discount: 0
    };
  }, [preview]);

  const generateInvoicePreviewHandler = useCallback(async () => {
    try {
      const [providerPractice] = provider.providerPractices;

      if (providerPractice && selectedService) {
        const res = await generateInvoicePreview(
          selectedService.practiceId,
          selectedService.providerId,
          selectedService.id,
          {
            patientId: selectedClient?.id!!,
            currency: 'USD',
            currencySymbol: '$',
            amount: selectedService.price,
            appointmentDate: selectedDateTime?.startTime!!,
          }
        );

        if (res.status === 200) {
          setPreview(res.data);
        }
      }
    } catch (error) {
      console.error('[generate-invoice-handler]: ', error);
    }
  }, [selectedService, selectedClient, selectedDateTime, provider.providerPractices]);

  const getInvoiceTemplatesHandler = useCallback(async () => {
    try {

      if (practice?.businessInformation?.country && selectedService?.practiceId && selectedService.providerId) {
        const res = await getInvoiceTemplates(
          selectedService.practiceId,
          selectedService.providerId,
          practice.businessInformation.country,
          0,
          999,
        );

        if (res.status === 200) {
          setTemplates(res.data);
        }
      }
    } catch (error) {
      console.error('[get-invoice-templates-handler]: ', error);
    }
  }, [practice.businessInformation?.country, selectedService]);

  const acceptInvoiceHandler = useCallback(async (values: Preview) => {
    try {
      if (selectedService?.practiceId && selectedService?.providerId && values.templateId !== null) {
        const res = await acceptInvoiceTemplate(
          selectedService.practiceId,
          selectedService.providerId,
          (values as AcceptInvoicePayload),
        );

        if (res.status === 200) {
          setInvoiceDataId(res.data.id);
        }
      }
    } catch (error) {
      console.error('[accept-invoice-handler]: ', error);
    }
  }, [selectedService, setInvoiceDataId])

  useEffect(() => {
    if (!preview) {
      generateInvoicePreviewHandler();
    }

    if (!templates) {
      getInvoiceTemplatesHandler()
    }
  }, [selectedService, selectedClient, selectedDateTime, provider.providerPractices, practice.businessInformation]);

  const calculateDiscountHandler = (discount: number, setFieldValue: (field: string, value: any) => void) => {
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
  });

  return (
    <div className={CSSPrefix}>
      <IonItem lines="none">
        <IonText className={`${CSSPrefix}-title`}>
          Schedule appointment
        </IonText>
      </IonItem>
      <IonItem lines="none" className={`${CSSPrefix}-subtitle`}>
        <IonText>
          Invoice review
        </IonText>
      </IonItem>
      <IonItem lines="none">
        <IonLabel className={`${CSSPrefix}-service`}>
          {selectedService?.name}
          <p>{selectedService?.location}, {duration}</p>
        </IonLabel>
        <IonText className={`${CSSPrefix}-price`}>${preview?.total?.toFixed(2)}</IonText>
      </IonItem>
      <Formik
        innerRef={formRef}
        initialValues={initialValues}
        onSubmit={acceptInvoiceHandler}
        enableReinitialize={true}
      >
        {({ values, setFieldValue, handleSubmit }) => (
          <Form>
            <FieldArray name="lines">
              {({ push, remove, form: { setFieldValue } }) => (
                <>
                  {values.lines.map((line, index) => (
                    <InvoiceCard
                      key={index}
                      name={`lines.${index}`}
                      line={line}
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
                      Add new line item
                      <IonIcon icon={addOutline} slot="start" />
                    </IonButton> */}
                </>
              )}
            </FieldArray>
            <InvoiceDiscountCard setDiscountCB={(discount) => calculateDiscountHandler(discount, setFieldValue)} maxDiscount={preview?.total!!} />
            <IonItem
              lines="none"
              className="ion-no-margin"
            >
              <div className={`${CSSPrefix}-invoice-select-container`}>
                <IonText>Location</IonText>
                <IonSelect
                  name="templateId"
                  interface="action-sheet"
                  toggleIcon={caretDownOutline}
                  expandedIcon={caretUpOutline}
                  placeholder="Select your invoice template"
                  selectedText={templates?.items.find(({ id }) => values.templateId === id)?.templateName || 'Select your invoice template'}
                  value={values.templateId}
                  onIonChange={(e) => setFieldValue('templateId', e.detail.value)}
                >
                  {templates?.items.map(({ id, templateName }) => (
                    <IonSelectOption key={id} value={id} color="dark">
                      {templateName}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </div>
            </IonItem>
            <div className="paid-in-advance-footer">
              <div className="paid-in-advance-footer-wrapper">
                <div className="paid-in-advance-footer-container">
                  <IonText className="paid-in-advance-footer-subtotal">Sub total:</IonText>
                  <IonText className="paid-in-advance-footer-subtotal">${values?.subtotal.toFixed(2)}</IonText>
                </div>
                <div className="paid-in-advance-footer-container">
                  <IonText className="paid-in-advance-footer-subtotal">Discount:</IonText>
                  <IonText className="paid-in-advance-footer-subtotal">${values?.discount.toFixed(2)}</IonText>
                </div>
                <div className="paid-in-advance-footer-container">
                  <IonText className="ion-margin-start paid-in-advance-footer-total">Total:</IonText>
                  <IonText className="paid-in-advance-footer-total">${values?.total.toFixed(2)}</IonText>
                </div>
              </div>
              <div className="paid-in-advance-footer-button-container">
                <IonButton
                  fill="solid"
                  expand="block"
                  color="primary"
                  type="submit"
                  disabled={!values.templateId}
                  onClick={() => handleSubmit()}
                >
                  Next
                </IonButton>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default PaidInAdvance;