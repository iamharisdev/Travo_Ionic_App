import {
  IonBadge,
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonInput,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { HeaderProps } from './header.type';
import { useHistory } from 'react-router';
import {
  caretDownOutline,
  menu,
  notifications,
  searchOutline,
  reloadOutline,
} from 'ionicons/icons';
import { menuController } from '@ionic/core/components';

import './Header.scss';
import { useTranslation } from 'react-i18next';
import { NOTIFICATIONS_DETAILS } from '../../shared/routes/routes';

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
  showNotifications,
  showSearchOption,
  reloadClick,
  editCB,
  cancelCB,
  datePickerCB,
  saveCB,
}): React.ReactElement => {
  const history = useHistory();
  const { t } = useTranslation();
  const [showSearchInput, setShowSearchInput] = useState(false);

  async function openMenuHandler() {
    await menuController.open(menuId);
  }
  const inputRef = useRef<HTMLIonInputElement | null>(null);

  // Focus input when it appears
  useEffect(() => {
    if (showSearchInput && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.setFocus();
      }, 100); // Small delay helps on some devices
    }
  }, [showSearchInput]);
  let count = 900;

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
              onClick={() => (customBackRoute ? history.push(customBackRoute) : history.goBack())}
            >
              {t('scheduling_back')}
            </IonButton>
          </IonButtons>
        )}
        {showCancel && (
          <IonButtons slot="start">
            <IonButton className="header-button" color="primary" onClick={cancelCB}>
              {t('log_out_cancel')}
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
            <IonButton className="header-button" color="primary" onClick={editCB}>
              {t('scheduling_edit')}
            </IonButton>
          </IonButtons>
        )}
        {showSave && (
          <IonButtons slot="end">
            <IonButton
              className="header-button"
              color={selectedLang === newLang ? 'medium' : 'primary'}
              disabled={selectedLang === newLang}
              onClick={saveCB}
            >
              {t('configuration_save')}
            </IonButton>
          </IonButtons>
        )}
        {showSearchOption && (
          <>
            {!showSearchInput && (
              <IonButtons slot="end">
                <IonButton
                  className="header-button"
                  color="dark"
                  onClick={() => setShowSearchInput(true)}
                >
                  <IonIcon icon={searchOutline} />
                </IonButton>
              </IonButtons>
            )}

            {showSearchInput && (
              <IonInput
                ref={inputRef}
                className="search-input"
                placeholder="Search..."
                clearInput
                onIonBlur={() => setShowSearchInput(false)}
              />
            )}
          </>
        )}
        {reloadClick && (
          <IonButtons slot="end">
            <IonButton className="header-button" color="dark" onClick={reloadClick}>
              <IonIcon icon={reloadOutline} />
            </IonButton>
          </IonButtons>
        )}
        {showDatePicker && (
          <IonButtons slot="end">
            <IonButton className="header-button" color="dark" onClick={datePickerCB}>
              <IonText className={`${CSSPrefix}-date-text`}>{datePickerText}</IonText>
              <IonIcon className={`${CSSPrefix}-date-icon`} icon={caretDownOutline} size="small" />
            </IonButton>
          </IonButtons>
        )}
        {showNotifications && (
          <IonButtons
            slot="end"
            className="header-button main-notification"
            color="dark"
            onClick={() => history.push(NOTIFICATIONS_DETAILS)}
          >
            <IonIcon className="notifications-icon" icon={notifications} />
            <IonBadge
              className={`notifications-badge ${
                count >= 99 ? 'notifications-badge-text' : 'notifications-badge-text-small'
              }`}
              color="danger"
            >
              {count >= 99 ? '99+' : count}
            </IonBadge>
          </IonButtons>
        )}
        {leftLabel && (
          <IonButtons slot="end">
            <IonButton className="header-button" color="dark" onClick={datePickerCB}>
              <IonText className={`${CSSPrefix}-date-text`}>{leftLabel}</IonText>
            </IonButton>
          </IonButtons>
        )}
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;
