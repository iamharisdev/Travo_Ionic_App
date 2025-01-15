import React, { useCallback, useMemo, useRef, useState } from 'react';
import { CreateAppointmentProps } from './createAppointment.type';
import { IonButton, IonButtons, IonContent, IonHeader, IonModal, IonToolbar } from '@ionic/react';
import SelectClient from './Steps/SelectClient/SelectClient';
import { Patient } from '../../state/patientSlice';
import SelectService from './Steps/SelectService/SelectService';
import { Services } from '../../shared/types/appointment.type';
import SelectDateTime from './Steps/SelectDateTime/SelectDateTime';
import ReviewDetails from './Steps/ReviewDetails/ReviewDetails';
import dayjs from 'dayjs';

import './CreateAppointment.scss';

const CSSPrefix = 'create-appointment';

export interface AppointmentDateTime {
  startTime: string;
  endTime: string;
}

const CreateAppointment: React.FC<CreateAppointmentProps> = ({ view, isOpen, selectedSlot, setIsOpen }) => {
  const [selectedClient, setSelectedClient] = useState<Patient>();
  const [selectedService, setSelectedService] = useState<Services>();
  const [selectedDateTime, setSelectedDateTime] = useState<AppointmentDateTime>();
  const [step, setStep] = useState<number>(0);
  const [prevStep, setPrevStep] = useState<number>(-1);
  const contentRef = useRef<HTMLIonContentElement | null>(null);

  const configNylasId = useMemo(() => {
    if (selectedService?.externalSchedulerId)
      return selectedService.externalSchedulerId;

    return '';
  }, [selectedService]);

  const cancelOrBackText = useMemo(() => {
    if (step === 1 || step === 2 || step === 3 || prevStep > -1) return 'Back';

    return 'Cancel';
  }, [step, prevStep]);

  const closeHandler = useCallback((close?: boolean) => {
    if ((step === 1 || step === 2 || step === 3) && !close && prevStep === -1) {
      setStep(step - 1);
    }

    if ((step === 0 || close) && prevStep === -1) {
      setIsOpen(false);
      setStep(0);
    }

    if (prevStep > -1) {
      setStep(prevStep);
      setPrevStep(-1);
    }
  }, [step, prevStep, isOpen]);


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
          setSelectedService(service);
          if (prevStep === -1) {
            if (selectedSlot && selectedSlot?.start && selectedSlot?.end) {
              const endTime = dayjs(selectedSlot?.start).add(service.duration, 'minutes').toISOString();
              setSelectedDateTime({
                startTime: dayjs(selectedSlot?.start).toISOString(),
                endTime
              });
              if (view !== 'month') {
                setStep(3);
              } else setStep(2);
            } else {
              setStep(2);
            }
          } else {
            setStep(prevStep);
            setPrevStep(-1);
          }
        }} />;
      case 2:
        return (
          <SelectDateTime
            configurationId={configNylasId}
            selectedDate={selectedSlot?.start}
            start_time={selectedSlot?.start}
            end_time={selectedSlot?.end}
            setSelectedDateTime={(selectedDateTime) => {
              setSelectedDateTime({ ...selectedDateTime });
              if (prevStep === -1) {
                setStep(3);
              } else {
                setStep(prevStep);
                setPrevStep(-1);
              }
            }}
            onDateSelected={() => scrollBottomHandler()}
          />
        );
      case 3:
        return <ReviewDetails
          selectedClient={selectedClient}
          selectedService={selectedService}
          selectedDateTime={selectedDateTime}
          closeHandler={closeHandler}
          goToStep={(step) => setStep((prevState) => {
            setPrevStep(prevState);
            return step;
          })}
        />;

      default:
        <SelectClient isOpen={isOpen} setSelectedClient={setSelectedClient} />;
    }
  }, [step, selectedClient, selectedService, selectedDateTime, isOpen, selectedSlot, prevStep, configNylasId]);

  const scrollBottomHandler = () => {
    contentRef.current && contentRef.current.scrollToBottom();
  };

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
              onClick={() => closeHandler()}
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

export default CreateAppointment;