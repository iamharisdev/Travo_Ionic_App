import React, { useMemo, useState } from 'react';
import { IonIcon, IonInput, IonItem, IonList, IonText } from '@ionic/react';
import { searchOutline } from 'ionicons/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../state/store';
import { Services } from '../../../../shared/types/appointment.type';
import ServiceCard from '../../../ServiceCard/ServiceCard';

import './SelectService.scss';
import { useTranslation } from 'react-i18next';

const CSSPrefix = 'select-service';

interface SelectServiceProps {
  setSelectedService: (service: Services) => void;
}

const SelectService: React.FC<SelectServiceProps> = ({ setSelectedService }) => {
  const [serviceToSearch, setClientToSearch] = useState<string | null | undefined>('');
  const { scheduling } = useSelector((state: RootState) => state);
    const { t } = useTranslation();

  const services = useMemo(() => {
    if (serviceToSearch) {
      return scheduling.services.patientServiceRequestDtos.filter(({ name }) => name.toLocaleLowerCase().includes(serviceToSearch.toLocaleLowerCase()));
    }

    return scheduling.services.patientServiceRequestDtos;
  }, [serviceToSearch]);

  const content = useMemo(() => {
    if (services.length === 0) {
      return (
        <div className={`${CSSPrefix}-no-services-container`}>
          <IonItem lines="none">
            <IonText className={`${CSSPrefix}-no-services ion-text-center`}>
            {t("blank_states_no_services_message")}
            </IonText>
          </IonItem>
        </div>
      )
    }

    return services.map((service: Services) => (
      <ServiceCard key={service.id} service={service} onClick={() => setSelectedService(service)} />
    ));
  }, [services]);

  return (
    <div className={CSSPrefix}>
      <IonItem lines="none">
        <IonText className={`${CSSPrefix}-title`}>
          {t("schedule_appointment")}
        </IonText>
      </IonItem>
      <IonItem lines="none" className={`${CSSPrefix}-subtitle`}>
        <IonText>
          {t("schedule_appointment_select_service")}
        </IonText>
      </IonItem>
      <IonItem lines="none" className="ion-margin-top">
        <IonInput
          className={`${CSSPrefix}-search-input`}
          class="custom"
          type="text"
          placeholder={t("schedule_appointment_search_service")}
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
        {content}
      </IonList>
    </div>
  );
}

export default SelectService;