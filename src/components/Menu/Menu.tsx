import { IonContent, IonMenu } from '@ionic/react';
import React from 'react';
import { MenuProps } from './menu.type';

const Menu: React.FC<MenuProps> = ({ menuId, contentId }) => (
  <IonMenu menuId={menuId} contentId={contentId}>
    <IonContent className="ion-padding">This is the first menu content.</IonContent>
  </IonMenu>
);

export default Menu;