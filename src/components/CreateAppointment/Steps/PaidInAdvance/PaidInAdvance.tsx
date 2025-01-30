import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IonButton, IonIcon, IonItem, IonLabel, IonText, useIonViewDidLeave } from '@ionic/react';
import { Services } from '../../../../shared/types/appointment.type';
import { addOutline } from 'ionicons/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../state/store';
import usePresentToast from '../../../../hooks/usePresentToast';
import { Preview } from '../../../../shared/types/invoice.type';
import InvoiceCard from '../../../InvoiceCard/InvoiceCard';
import InvoiceDiscountCard from '../../../InvoiceDiscountCard/InvoiceDiscountCard';
import { generateInvoicePreview } from '../../../../api/services/billing';
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
}

const PaidInAdvance: React.FC<PaidInAdvanceProps> = ({ selectedService, selectedClient, selectedDateTime }) => {
  const formRef: any = useRef();
  const [preview, setPreview] = useState<Preview>();
  const [discount, setDiscunt] = useState<number>(0);
  const [presentToast] = usePresentToast();
  const {
    provider,
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
      console.error('[paid-in-advance]: ', error);
    }
  }, [selectedService, selectedClient, selectedDateTime, provider.providerPractices]);

  const nextHandler = (values: Preview) => {
    console.log('next:values: ', values);
  }

  useEffect(() => {
    if (!preview) {
      generateInvoicePreviewHandler();
    }
  }, [selectedService, selectedClient, selectedDateTime, provider.providerPractices]);

  useIonViewDidLeave(() => {
    setPreview(undefined);
  });

  return (
    <>
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
          onSubmit={nextHandler}
          enableReinitialize={true}
        >
          {({ values }) => (
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
                    </IonButton>
                  </>
                )}
              </FieldArray>
            </Form>
          )}
        </Formik>
        <InvoiceDiscountCard setDiscountCB={setDiscunt} />
      </div>
      <div className="paid-in-advance-footer">
        <div className="paid-in-advance-footer-wrapper">
          <div className="paid-in-advance-footer-container">
            <IonText className="paid-in-advance-footer-subtotal">Sub total:</IonText>
            <IonText className="paid-in-advance-footer-subtotal">${preview?.subtotal.toFixed(2)}</IonText>
          </div>
          <div className="paid-in-advance-footer-container">
            <IonText className="paid-in-advance-footer-subtotal">Discount:</IonText>
            <IonText className="paid-in-advance-footer-subtotal">${preview?.discount.toFixed(2)}</IonText>
          </div>
          <div className="paid-in-advance-footer-container">
            <IonText className="ion-margin-start paid-in-advance-footer-total">Total:</IonText>
            <IonText className="paid-in-advance-footer-total">${preview?.total.toFixed(2)}</IonText>
          </div>
        </div>
        <div className="paid-in-advance-footer-button-container">
          <IonButton fill="solid" expand="block" color="primary" type="submit" onClick={() => {
            if (formRef.current) {
              (formRef?.current as any).handleSubmit();
            }
          }}>
            Next
          </IonButton>
        </div>
      </div>
    </>
  );
}

export default PaidInAdvance;