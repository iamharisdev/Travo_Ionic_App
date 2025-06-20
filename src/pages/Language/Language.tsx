import React, { useMemo, useRef, useState } from "react";
import {
  IonContent,
  IonItem,
  IonLabel,
  IonPage,
  IonRadio,
  IonRadioGroup,
  IonText,
} from "@ionic/react";
import Header from "../../components/Header/Header";
import UseSwipeGesture from "../../hooks/useSwipeGesture";
import { useHistory } from "react-router";
import SwipeHandler from "../../components/SwipeHandler/SwipeHandler";

import "./Language.scss";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { getStorageValue } from "../../storage/storage.util";
import { STORAGE_TOKEN } from "../../constant/storage.constant";

const CSSprefix = 'subscription-deatils';

const LanguagePage: React.FC = (): React.ReactElement => {
  const subscriptionDetailsRef = useRef(null);
  const history = useHistory();
  const { t, i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState<string>(localStorage.getItem("language") || "en");
  const [newLang, setNewLang] = useState<string>(localStorage.getItem("language") || "en");

  const { handlers, refPassthrough } = UseSwipeGesture({
    parentRef: subscriptionDetailsRef,
    onSwipedRight: () => history.goBack(),
  });

  const handleLanguageChange = (lang: string) => {
    setNewLang(lang)
  };
  
  const handleLanguageSave = async() => {
    localStorage.setItem("language", newLang);
    setSelectedLang(newLang);
    i18n.changeLanguage(newLang);
    const token = await getStorageValue(STORAGE_TOKEN);
    try {
      await axios.get(`${process.env.REACT_APP_LOOKUP_API_URL}/${newLang}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        }
      })
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <IonPage className={CSSprefix} {...handlers} ref={refPassthrough}>
      <SwipeHandler parentRef={subscriptionDetailsRef} />
      <Header showBack showMenu={false}  showSave selectedLang={selectedLang} newLang={newLang} saveCB={handleLanguageSave}/>
      <IonContent fullscreen={true}>
        <IonItem className="ion-margin-vertical" lines="none">
          <IonText className={`${CSSprefix}-title ion-margin-top`}>
            {t("configuration_Language")}
          </IonText>
        </IonItem>

        <IonRadioGroup value={newLang} onIonChange={(e) => handleLanguageChange(e.detail.value)}>
          <IonItem lines="none">
            <IonLabel>{t("configuration_english")}</IonLabel>
            <IonRadio slot="end" value="en" />
          </IonItem>
          <IonItem lines="none">
            <IonLabel>{t("configuration_portuguese")}</IonLabel>
            <IonRadio slot="end" value="pt" />
          </IonItem>
        </IonRadioGroup>
      </IonContent>
    </IonPage>
  );
};

export default LanguagePage;
