import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (clientToSearch && clientToSearch !== '' && clientToSearch.length > 2) {
      setTimeout(() => {
        getSearchClient();
      }, 1000);
    }
  }, [clientToSearch]);

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
          onIonInput={(e) => setClientToSearch(e.detail.value)}
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
        {patient.patients.map((patient: Patient) => (
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
        ))}
      </IonList>
    </div>
  );
}

export default SelectClient;