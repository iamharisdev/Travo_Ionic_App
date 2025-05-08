import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CreateAppointmentProps } from './createAppointment.type';
import { IonButton, IonButtons, IonContent, IonHeader, IonModal, IonToolbar } from '@ionic/react';
import SelectClient from './Steps/SelectClient/SelectClient';
import { Patient } from '../../state/patientSlice';
import SelectService from './Steps/SelectService/SelectService';
import { Services } from '../../shared/types/appointment.type';
import SelectDateTime from './Steps/SelectDateTime/SelectDateTime';
import ReviewDetails from './Steps/ReviewDetails/ReviewDetails';
import dayjs from 'dayjs';
import PaidInAdvance from './Steps/PaidInAdvance/PaidInAdvance';

import './CreateAppointment.scss';
import { useTranslation } from 'react-i18next';

const CSSPrefix = 'create-appointment';

export interface AppointmentDateTime {
  startTime: string;
  endTime: string;
}

const CreateResheduleAppointment: React.FC<CreateAppointmentProps> = ({ view, isOpen, selectedSlot, currentDate, setIsOpen, currentStep, appointment }) => {
  const [selectedClient, setSelectedClient] = useState<Patient>();
  const [selectedService, setSelectedService] = useState<Services>();
  const [selectedPrevService, setSelectedPrevService] = useState<Services>();
  const [selectedDateTime, setSelectedDateTime] = useState<AppointmentDateTime>();
  const [step, setStep] = useState<number>(currentStep ?? 0);
  const [prevStep, setPrevStep] = useState<number>(-1);
  const contentRef = useRef<HTMLIonContentElement | null>(null);
  const [invoiceDataId, setInvoiceDataId] = useState<string>();
  const {t} = useTranslation();

  const cancelOrBackText = useMemo(() => {
    if (step === 1 || step === 2 || step === 3 || step === 4 || prevStep > -1) return `${t("scheduling_back")}`;

    return `${t("log_out_cancel")}`;
  }, [step, prevStep]);

  const closeHandler = useCallback((close?: boolean) => {

    if (!close) {
      if ((step === 1 || step === 2 || step === 3 || step === 4) && prevStep === -1) {
        if (selectedService?.paymentType === 'At Completion' && step === 4) {
          // if the user comes from paid in advance and go back and change to services that is at completion
          setStep(step - 2);
        } else {
          setStep(step - 1);
        }
      } else {
        // In advance flow
        setStep(step - 1);
      }

      if ((step === 0) && prevStep === -1) {
        setIsOpen(false);
        setStep(0);
      }

      if (prevStep > -1 && selectedService?.paymentType === 'At Completion') {
        setStep(prevStep);
        setPrevStep(-1);
      } else {
        // In advance flow
        // Paid in advance
        if (prevStep === 4 && step === 3) {
          setStep(1);
          setPrevStep(4);
        }
        // Paid in advance select service
        if (prevStep === 4 && step === 1) {
          setStep(prevStep);
          setPrevStep(-1);
          if (!invoiceDataId) {
            setSelectedService(selectedPrevService);
            setSelectedPrevService(undefined);
          }
        }
        // review
        if (prevStep === 4 && step === 4) {
          setStep(step - 1);
          setPrevStep(-1);
        }
        // select date time & select client
        if (prevStep === 4 && step === 2 || prevStep === 4 && step === 0) {
          setStep(prevStep);
          setPrevStep(-1);
        }
      }
    }

    if (close) {
      setIsOpen(false);
      setStep(2);
    }
  }, [step, prevStep, isOpen, selectedService, selectedPrevService, invoiceDataId]);

  // Android native back button
  document.addEventListener('ionBackButton', (ev: any) => {
    ev.detail.register(140, () => {
      closeHandler();
    });
  });

  const steps = useMemo(() => {
    switch (step) {
      case 0:
        return <SelectClient isOpen={isOpen} setSelectedClient={(client) => {
          setSelectedClient(client);
          if (prevStep === -1) {
            setStep(1);
          } else {
            setStep(prevStep);
            setPrevStep(-1);
          }
        }} />;
      case 1:
        return <SelectService setSelectedService={(service) => {
          if (service.paymentType === 'In Advance') {
            setSelectedPrevService(selectedService);
            setSelectedService(service);
          } else {
            setSelectedService(service);
            setSelectedPrevService(undefined);
            setInvoiceDataId(undefined);
          }
          // if comes from selected timeslot
          if (prevStep === -1) {
            if (selectedSlot && selectedSlot?.start && selectedSlot?.end) {
              const endTime = dayjs(selectedSlot?.start).add(service.duration, 'minutes').toISOString();
              setSelectedDateTime({
                startTime: dayjs(selectedSlot?.start).toISOString(),
                endTime
              });
              if (view !== 'month') {
                if (service.paymentType === 'In Advance') {
                  setStep(3);
                } else {
                  setStep(4);
                }
              } else {
                setStep(2);
              }
            } else {
              setStep(2);
            }
          } else {
            // from month or appointments view
            if (service.paymentType === 'In Advance') {
              setStep(3);
            } else {
              setStep(4);
            }
          }
        }} />;
      case 2:
        return (
          <SelectDateTime
            selectedDate={currentDate || (selectedDateTime?.startTime ? dayjs(selectedDateTime?.startTime).toISOString() : dayjs(selectedSlot?.start).toISOString())}
            start_time={selectedDateTime ? (dayjs(selectedDateTime?.startTime).toDate()!!) : selectedSlot?.start}
            end_time={selectedDateTime ? (dayjs(selectedDateTime?.endTime).toDate()!!) : selectedSlot?.end}
            setSelectedDateTime={(selectedDateTime) => {
              setSelectedDateTime({ ...selectedDateTime });
              if (prevStep === -1) {
                if (selectedService?.paymentType === 'In Advance') {
                  setStep(3);
                } else {
                  setStep(3);
                }
              } else {
                setStep(prevStep);
                setPrevStep(-1);
              }
            }}
            onDateSelected={() => scrollBottomHandler()}
            duration={selectedService?.duration}
          />
        );
      case 3:
        return <ReviewDetails
        selectedClient={appointment?.patientName ? { firstName: appointment.patientName, lastName: '', id: '', email: '', patientNumber: '' } as Patient : undefined}
        selectedService={appointment?.patientServiceName ? { name: appointment.patientServiceName, id: '', duration: 0, paymentType: 'At Completion' } as Services : undefined}
        selectedDateTime={selectedDateTime}
        invoiceDataId={appointment?.invoiceDataId}
        closeHandler={closeHandler}
        goToStep={(step) => setStep((prevState) => {
          setPrevStep(prevState);
          return step;
        })}
      />;

      default:
        <SelectClient isOpen={isOpen} setSelectedClient={setSelectedClient} />;
    }
  }, [step, selectedClient, selectedService, selectedDateTime, isOpen, selectedSlot, prevStep, invoiceDataId, selectedPrevService, currentDate]);

  const scrollBottomHandler = () => {
    contentRef.current && contentRef.current.scrollToBottom();
  };

  useEffect(() => {
    if (!isOpen) {
      setInvoiceDataId(undefined);
      setSelectedClient(undefined);
      setSelectedService(undefined);
      setSelectedDateTime(undefined);
      setSelectedPrevService(undefined);
    }
  }, [isOpen]);

  return (
    <IonModal
      isOpen={isOpen}
      className={CSSPrefix}
    >
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton
              color="primary"
              onClick={() => step < 3 ? closeHandler(true) :closeHandler()}
            >
              {cancelOrBackText}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-no-padding" ref={contentRef}>
        {steps}
      </IonContent>
    </IonModal>
  );
}

export default CreateResheduleAppointment;