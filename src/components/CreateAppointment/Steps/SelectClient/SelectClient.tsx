import React, { useEffect, useMemo, useState } from 'react';
import { IonAvatar, IonIcon, IonInput, IonItem, IonLabel, IonList, IonText } from '@ionic/react';
import { searchOutline } from 'ionicons/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../state/store';
import { setLoading } from '../../../../state/loadingSlice';
import { Patient, searchPatientAction } from '../../../../state/patientSlice';

import './SelectClient.scss';

const CSSPrefix = 'select-client';

interface SelectedClientProps {
  setSelectedClient: (client: Patient) => void;
}

const SelectClient: React.FC<SelectedClientProps> = ({ setSelectedClient }) => {
  const [clientToSearch, setClientToSearch] = useState<string | null | undefined>('');
  const dispatch = useDispatch<AppDispatch>();
  const { provider, patient } = useSelector((state: RootState) => state);

  const getSearchClient = async () => {
    try {
      dispatch(setLoading({ loading: true, message: 'Searching client' }));

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
              You have no registered clients yet. To start adding them, please tap on the “add client” floating button on the bottom of the screen.
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
    getSearchClient();
  }, []);

  return (
    <div className={CSSPrefix}>
      <IonItem lines="none">
        <IonText className={`${CSSPrefix}-title`}>
          Schedule appointment
        </IonText>
      </IonItem>
      <IonItem lines="none" className={`${CSSPrefix}-subtitle`}>
        <IonText>
          Select client
        </IonText>
      </IonItem>
      <IonItem lines="none" className="ion-margin-top">
        <IonInput
          className={`${CSSPrefix}-search-input`}
          class="custom"
          type="text"
          placeholder="Search client"
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