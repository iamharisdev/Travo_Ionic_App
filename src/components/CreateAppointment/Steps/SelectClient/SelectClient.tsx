import React, { useEffect, useMemo, useState } from 'react';
import { IonAvatar, IonIcon, IonInput, IonItem, IonLabel, IonList, IonText, useIonViewWillEnter } from '@ionic/react';
import { searchOutline } from 'ionicons/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../state/store';
import { setLoading } from '../../../../state/loadingSlice';
import { Patient, searchPatientAction } from '../../../../state/patientSlice';

import './SelectClient.scss';
import { useTranslation } from 'react-i18next';

const CSSPrefix = 'select-client';

interface SelectedClientProps {
  isOpen: boolean;
  setSelectedClient: (client: Patient) => void;
}

const SelectClient: React.FC<SelectedClientProps> = ({ isOpen, setSelectedClient }) => {
  const [clientToSearch, setClientToSearch] = useState<string | null | undefined>('');
  const dispatch = useDispatch<AppDispatch>();
  const { provider, patient } = useSelector((state: RootState) => state);
    const { t } = useTranslation();

  const getSearchClient = async () => {
    try {
      dispatch(setLoading({ loading: true, message: `${t("Searching_client_loading")}` }));

      const [providerPractice] = provider.providerPractices;
      if (providerPractice && typeof clientToSearch === 'string') {
        await dispatch(searchPatientAction({
          practiceId: providerPractice.practiceId,
          patient: clientToSearch
        }));
      }

      dispatch(setLoading({ loading: false, message: '' }));
    } catch (error) {
      dispatch(setLoading({ loading: false, message: '' }));
      setClientToSearch('');
      console.error('error at search client: ', error);
    }
  }

  const content = useMemo(() => {
    if (patient.patients.length === 0) {
      return (
        <div className={`${CSSPrefix}-no-clients-container`}>
          <IonItem lines="none">
            <IonText className={`${CSSPrefix}-no-clients ion-text-center`}>
            {t("blank_states_no_registered_clients_message")}
            </IonText>
          </IonItem>
        </div>
      );
    }

    if (clientToSearch && clientToSearch !== '') {
      return patient.patients.filter(
        (patient: Patient) => `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(clientToSearch.toLowerCase())
      ).map((patient) => (
        <IonItem key={patient.id} lines="none" onClick={() => setSelectedClient(patient)}>
          <IonAvatar slot="start">
            <img alt="avatar" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
          </IonAvatar>
          <IonLabel className={`${CSSPrefix}-item-name`}>
            {`${patient.firstName} ${patient.lastName}`}
            <p className={`${CSSPrefix}-item-email`}>
              {patient.email}
            </p>
          </IonLabel>
        </IonItem>
      ));
    }

    return patient.patients.map((patient: Patient) => (
      <IonItem key={patient.id} lines="none" onClick={() => setSelectedClient(patient)}>
        <IonAvatar slot="start">
          <img alt="avatar" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
        </IonAvatar>
        <IonLabel className={`${CSSPrefix}-item-name`}>
          {`${patient.firstName} ${patient.lastName}`}
          <p className={`${CSSPrefix}-item-email`}>
            {patient.email}
          </p>
        </IonLabel>
      </IonItem>
    ));
  }, [patient.patients, clientToSearch]);

  const pressEnterKeyHandler = async (e: React.KeyboardEvent<HTMLIonInputElement>) => {
    if (clientToSearch && clientToSearch !== '' && e.key === 'Enter') {
      getSearchClient();
    }
  };

  useEffect(() => {
    if (isOpen) {
      getSearchClient();
    }
  }, [isOpen]);

  return (
    <div className={CSSPrefix}>
      <IonItem lines="none">
        <IonText className={`${CSSPrefix}-title`}>
          {t("schedule_appointment")}
        </IonText>
      </IonItem>
      <IonItem lines="none" className={`${CSSPrefix}-subtitle`}>
        <IonText>
          {t("schedule_appointment_select_client")}
        </IonText>
      </IonItem>
      <IonItem lines="none" className="ion-margin-top">
        <IonInput
          className={`${CSSPrefix}-search-input`}
          class="custom"
          type="text"
          placeholder={t("schedule_appointment_search_client")}
          value={clientToSearch}
          enterkeyhint="search"
          onIonInput={(e) => setClientToSearch(e.detail.value)}
          onKeyDown={pressEnterKeyHandler}
        >
          <IonIcon
            className={`${CSSPrefix}-search-icon`}
            slot="start"
            icon={searchOutline}
            aria-hidden="true"
          />
        </IonInput>
      </IonItem>
      <div className={`${CSSPrefix}-divider`} />
      <IonList>
        {content}
      </IonList>
    </div>
  );
}

export default SelectClient;