import {
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import { HeaderProps } from "./header.type";
import { useHistory } from "react-router";
import { caretDownOutline, menu } from "ionicons/icons";
import { menuController } from '@ionic/core/components';

import './Header.scss';

const CSSPrefix = 'header';

const Header: React.FC<HeaderProps> = ({
  className,
  translucent,
  collapse,
  showBack = false,
  showEdit = false,
  showMenu = true,
  menuId,
  showCancel = false,
  customBackRoute,
  showDatePicker,
  datePickerText,
  editCB,
  cancelCB,
  datePickerCB,
}): React.ReactElement => {
  const history = useHistory();

  async function openMenuHandler() {
    await menuController.open(menuId);
  }

  return (
    <IonHeader
      className={`${className} ${CSSPrefix}`}
      translucent={translucent}
      collapse={collapse}
    >
      <IonToolbar>
        {showBack && (
          <IonButtons slot="start">
            <IonButton
              className="header-button"
              color="primary"
              onClick={() =>
                customBackRoute ? history.push(customBackRoute) : history.goBack()}
            >
              Back
            </IonButton>
          </IonButtons>
        )}
        {showCancel && (
          <IonButtons slot="start">
            <IonButton
              className="header-button"
              color="primary"
              onClick={cancelCB}
            >
              Cancel
            </IonButton>
          </IonButtons>
        )}
        {showMenu && (
          <IonButtons slot="start">
            <IonButton onClick={openMenuHandler}>
              <IonIcon slot="icon-only" icon={menu}></IonIcon>
            </IonButton>
          </IonButtons>
        )}
        <IonTitle />
        {showEdit && (
          <IonButtons slot="end">
            <IonButton
              className="header-button"
              color="primary"
              onClick={editCB}
            >
              Edit
            </IonButton>
          </IonButtons>
        )}
        {showDatePicker && (
          <IonButtons slot="end">
            <IonButton
              className="header-button"
              color="dark"
              onClick={datePickerCB}
            >
              <IonText className={`${CSSPrefix}-date-text`}>
                {datePickerText}
              </IonText>
              <IonIcon className={`${CSSPrefix}-date-icon`} icon={caretDownOutline} size="small" />
            </IonButton>
          </IonButtons>
        )}
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;
