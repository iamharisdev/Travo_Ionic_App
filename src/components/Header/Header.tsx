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
import { useTranslation } from "react-i18next";

const CSSPrefix = 'header';

const Header: React.FC<HeaderProps> = ({
  className,
  translucent,
  collapse,
  showBack = false,
  showEdit = false,
  showMenu = true,
  showSave,
  selectedLang,
  newLang,
  menuId,
  showCancel = false,
  customBackRoute,
  showDatePicker,
  datePickerText,
  leftLabel,
  editCB,
  cancelCB,
  datePickerCB,
  saveCB,
}): React.ReactElement => {
  const history = useHistory();
      const {t} = useTranslation();

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
              {t("scheduling_back")}
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
              {t("log_out_cancel")}
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
              {t("scheduling_edit")};
            </IonButton>
          </IonButtons>
        )}
           {showSave && (
          <IonButtons slot="end">
            <IonButton
              className="header-button"
              color={selectedLang === newLang ?  "medium": "primary"}
              disabled={selectedLang === newLang}
              onClick={saveCB}
            >
              {t("configuration_save")}
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
        {leftLabel && (
          <IonButtons slot="end">
            <IonButton
              className="header-button"
              color="dark"
              onClick={datePickerCB}
            >
              <IonText className={`${CSSPrefix}-date-text`}>
                {leftLabel}
              </IonText>
            </IonButton>
          </IonButtons>
        )}
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;
