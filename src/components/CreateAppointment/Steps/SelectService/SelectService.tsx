import React, { useMemo, useState } from 'react';
import { IonIcon, IonInput, IonItem, IonList, IonText } from '@ionic/react';
import { searchOutline } from 'ionicons/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../state/store';
import { Services } from '../../../../shared/types/appointment.type';
import ServiceCard from '../../../ServiceCard/ServiceCard';

import './SelectService.scss';

const CSSPrefix = 'select-service';

interface SelectServiceProps {
  setSelectedService: (service: Services) => void;
}

const SelectService: React.FC<SelectServiceProps> = ({ setSelectedService }) => {
  const [serviceToSearch, setClientToSearch] = useState<string | null | undefined>('');
  const { scheduling } = useSelector((state: RootState) => state);

  const services = useMemo(() => {
    if (serviceToSearch) {
      return scheduling.services.patientServiceRequestDtos.filter(({ name }) => name.toLocaleLowerCase().includes(serviceToSearch.toLocaleLowerCase()));
    }

    return scheduling.services.patientServiceRequestDtos;
  }, [serviceToSearch]);

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
          value={serviceToSearch}
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
      <IonList className={`${CSSPrefix}-list`}>
        {services.map((service: Services) => (
          <ServiceCard key={service.id} service={service} onClick={() => setSelectedService(service)} />
        ))}
      </IonList>
    </div>
  );
}

export default SelectService;