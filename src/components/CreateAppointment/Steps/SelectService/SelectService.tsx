import React, { useEffect, useState } from 'react';
import { IonAvatar, IonIcon, IonInput, IonItem, IonLabel, IonList, IonText } from '@ionic/react';
import { searchOutline } from 'ionicons/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../state/store';
import { setLoading } from '../../../../state/loadingSlice';
import { searchPatientAction } from '../../../../state/patientSlice';
import { Services } from '../../../../shared/types/appointment.type';

import './SelectService.scss';

const CSSPrefix = 'select-service';

interface SelectServiceProps {
  setSelectedService: (service: Services) => void;
}

const SelectService: React.FC<SelectServiceProps> = ({ setSelectedService }) => {
  const [clientToSearch, setClientToSearch] = useState<string | null | undefined>('');
  const dispatch = useDispatch<AppDispatch>();
  const { provider, scheduling } = useSelector((state: RootState) => state);
  console.log('scheduling: ', scheduling);

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

  const getDurationHandler = (duration: number) => {
    let parsedDuration = '';

    if (duration) {
      const minutes = duration;
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
  };

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
          Select service
        </IonText>
      </IonItem>
      <IonItem lines="none" className="ion-margin-top">
        <IonInput
          className={`${CSSPrefix}-search-input`}
          class="custom"
          type="text"
          placeholder="Search service"
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
        {scheduling.services.patientServiceRequestDtos.map((service: Services) => (
          <IonItem key={service.id} lines="none" onClick={() => setSelectedService(service)}>
            <IonAvatar slot="start">
              <img alt="avatar" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
            </IonAvatar>
            <IonLabel className={`${CSSPrefix}-item-title`}>
              {service.name}
              <p className={`${CSSPrefix}-item-description`}>
                {`${service.location}, ${getDurationHandler(service.duration)}`}
              </p>
            </IonLabel>
          </IonItem>
        ))}
      </IonList>
    </div>
  );
}

export default SelectService;