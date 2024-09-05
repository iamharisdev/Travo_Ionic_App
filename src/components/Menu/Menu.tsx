import { IonContent, IonIcon, IonImg, IonItem, IonLabel, IonMenu } from '@ionic/react';
import React from 'react';
import { MenuProps } from './menu.type';
import TrovaLogo from '../../../public/assets/TrovaLogo.png';
import { calendarClearOutline, calendarNumberOutline, calendarOutline, enterOutline, listOutline } from 'ionicons/icons';

import './Menu.scss';

const CSSprefix = 'menu';

const Menu: React.FC<MenuProps> = ({ menuId, contentId }) => (
  <IonMenu menuId={menuId} contentId={contentId}>
    <IonContent className={`${CSSprefix} ion-padding`}>
      <IonItem lines='none' className={`${CSSprefix}-first-item`}>
        <IonImg
          className={`${CSSprefix}-logo`}
          src={TrovaLogo}
          alt='Trova Logo'
        />
      </IonItem>
      <IonItem className="ion-margin-bottom" lines="none">
        <IonIcon aria-hidden="true" icon={listOutline} slot="start"></IonIcon>
        <IonLabel>Schedule</IonLabel>
      </IonItem>
      <IonItem className="ion-margin-bottom" lines="none">
        <IonIcon aria-hidden="true" icon={calendarNumberOutline} slot="start"></IonIcon>
        <IonLabel>Day</IonLabel>
      </IonItem>
      <IonItem className="ion-margin-bottom" lines="none">
        <IonIcon aria-hidden="true" icon={calendarClearOutline} slot="start"></IonIcon>
        <IonLabel>Week</IonLabel>
      </IonItem>
      <IonItem className="ion-margin-bottom" lines="none">
        <IonIcon aria-hidden="true" icon={calendarOutline} slot="start"></IonIcon>
        <IonLabel>Month</IonLabel>
      </IonItem>
      <IonItem className="ion-margin-bottom" lines="none">
        <IonIcon aria-hidden="true" icon={enterOutline} slot="start"></IonIcon>
        <IonLabel>Appointment Requests</IonLabel>
      </IonItem>
    </IonContent>
  </IonMenu>
);

export default Menu;