import { IonContent, IonIcon, IonImg, IonItem, IonLabel, IonMenu } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { MenuProps } from './menu.type';
import TrovaLogo from '../../../public/assets/TrovaLogo.png';
import { calendarClearOutline, calendarNumberOutline, calendarOutline, enterOutline, listOutline } from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router';
import { APPOINTMENT_REQUESTS, APPOINTMENTS, CALENDAR_MONTH, CALENDAR_DAY, CALENDAR_WEEK } from '../../shared/routes/routes';
import useMenu from '../../hooks/useMenu';
import { getMenuIdByLocation } from '../../shared/utils/menu.util';

import './Menu.scss';
import { useTranslation } from 'react-i18next';
import LanguageToggle from '../LanguageSwitcher/LanguageSwitcher';

const CSSprefix = 'menu';

const Menu: React.FC<MenuProps> = ({ menuId, contentId }) => {
  const history = useHistory();
  const location = useLocation();
  const { i18n, t } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);

  // Load saved language from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem("language") || "en";
    i18n.changeLanguage(savedLang);
    setCurrentLang(savedLang);
  }, [i18n]);
  const changeLanguageas = () => {
    console.log("here");
    
  };
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setCurrentLang(lang);
    localStorage.setItem("language", lang); // Save language preference
  };
  const { closeMenuHandler } = useMenu();
  const navigateHandler = async (route: string) => {
    await closeMenuHandler(getMenuIdByLocation(location.pathname));
    history.push(route);
  }

  return (
    <IonMenu menuId={menuId} contentId={contentId} aria-hidden={true}>
      <IonContent className={`${CSSprefix} ion-padding`}>
        <IonItem lines='none' className={`${CSSprefix}-first-item`}>
          <IonImg
            className={`${CSSprefix}-logo`}
            src={TrovaLogo}
            alt='Trova Logo'
          />
        </IonItem>
        <IonItem className="ion-margin-bottom" lines="none" onClick={async () => navigateHandler(APPOINTMENTS)}>
          <IonIcon aria-hidden="true" icon={listOutline} slot="start" />
          <IonLabel>{t("scheduling_schedule")}</IonLabel>
        </IonItem>
        <IonItem className="ion-margin-bottom" lines="none" onClick={async () => navigateHandler(CALENDAR_DAY)}>
          <IonIcon aria-hidden="true" icon={calendarNumberOutline} slot="start" />
          <IonLabel>{t("scheduling_day")}</IonLabel>
        </IonItem>
        <IonItem className="ion-margin-bottom" lines="none" onClick={async () => navigateHandler(CALENDAR_WEEK)}>
          <IonIcon aria-hidden="true" icon={calendarClearOutline} slot="start" />
          <IonLabel>{t("scheduling_week")}</IonLabel>
        </IonItem>
        <IonItem className="ion-margin-bottom" lines="none" onClick={async () => navigateHandler(CALENDAR_MONTH)}>
          <IonIcon aria-hidden="true" icon={calendarOutline} slot="start" />
          <IonLabel>{t("scheduling_month")}</IonLabel>
        </IonItem>
        <IonItem className="ion-margin-bottom" lines="none" onClick={async () => navigateHandler(APPOINTMENT_REQUESTS)}>
          <IonIcon aria-hidden="true" icon={enterOutline} slot="start" />
          <IonLabel>{t("appointment_requests")}</IonLabel>
        </IonItem>
        <IonItem className="ion-margin-bottom" lines="none">
          <IonLabel>{t("language")}</IonLabel>
          <LanguageToggle/>
        </IonItem>
      </IonContent>
    </IonMenu>
  );
}

export default Menu;