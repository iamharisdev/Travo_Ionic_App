import React, { useEffect, useState } from 'react';
import { IonAvatar, IonIcon, IonInput, IonItem, IonLabel, IonList, IonText } from '@ionic/react';
import { searchOutline } from 'ionicons/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../state/store';
import { setLoading } from '../../../../state/loadingSlice';
import { searchPatientAction } from '../../../../state/patientSlice';

import './SelectClient.scss';

const CSSPrefix = 'select-client';

const SelectClient: React.FC = () => {
  const [clientToSearch, setClientToSearch] = useState<string | null | undefined>('');
  const dispatch = useDispatch<AppDispatch>();
  const { provider, patient } = useSelector((state: RootState) => state);
  console.log('patient: ', patient);

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
        {patient.patients.map(({ id, firstName, lastName, email }) => (
          <IonItem key={id} lines="none">
            <IonAvatar slot="start">
              <img alt="avatar" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
            </IonAvatar>
            <IonLabel className={`${CSSPrefix}-item-name`}>
              {`${firstName} ${lastName}`}
              <p className={`${CSSPrefix}-item-email`}>
                {email}
              </p>
            </IonLabel>
          </IonItem>
        ))}
      </IonList>
    </div>
  );
}

export default SelectClient;