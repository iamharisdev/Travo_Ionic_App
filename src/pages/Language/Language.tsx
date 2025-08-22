import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  IonContent,
  IonItem,
  IonLabel,
  IonPage,
  IonRadio,
  IonRadioGroup,
  IonText,
} from '@ionic/react';
import Header from '../../components/Header/Header';
import UseSwipeGesture from '../../hooks/useSwipeGesture';
import { useHistory } from 'react-router';
import SwipeHandler from '../../components/SwipeHandler/SwipeHandler';
import usePresentToast from '../../hooks/usePresentToast';
import './Language.scss';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { getStorageValue } from '../../storage/storage.util';
import { STORAGE_TOKEN } from '../../constant/storage.constant';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../state/store';
import { setLang } from '../../state/persistSlice';
import { updatePracticeAction } from '../../state/providerSlice';
import { getLookupCurrenciesAction } from '../../state/practiceSlice';
import { setLoading } from '../../state/loadingSlice';

const CSSprefix = 'subscription-deatils';

const LanguagePage: React.FC = (): React.ReactElement => {
  const subscriptionDetailsRef = useRef(null);
  const history = useHistory();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [presentToast] = usePresentToast();

  const {
    provider,
    practice: { phoneCodes },
    white: { currentEnv, lang },
  } = useSelector((state: RootState) => state);

  const [selectedLang, setSelectedLang] = useState<string>(lang || 'en');

  const [newLang, setNewLang] = useState<string>(lang || 'en');

  useEffect(() => {
    if (lang) {
      setSelectedLang(lang); // what’s currently saved
      setNewLang(lang); // update radio if language changed elsewhere (pull-to-refresh)
    }
  }, [lang]);

  const { handlers, refPassthrough } = UseSwipeGesture({
    parentRef: subscriptionDetailsRef,
    onSwipedRight: () => history.goBack(),
  });

  const {
    practiceId,
    providerId,
  }: {
    practiceId?: string;
    providerId?: string;
  } = useMemo(() => {
    if (provider.providerPractices.length > 0) {
      const [providerPractice] = provider.providerPractices;
      return {
        practiceId: providerPractice.practiceId,
        providerId: providerPractice.providerId,
      };
    }

    return {};
  }, [provider.providerPractices]);

  const handleLanguageSave = async () => {
    dispatch(
      setLoading({
        loading: true,
        message: t('configuration_updating_language') || 'Updating language…',
      })
    );

    try {
      const res = await updateLanguage();
      if (!res?.payload) throw new Error('updateLanguage failed');

      dispatch(setLang(newLang));
      dispatch(getLookupCurrenciesAction(newLang));
      localStorage.setItem('language', newLang);
      setSelectedLang(newLang);

      try {
        await i18n.loadLanguages?.(newLang);
        await i18n.changeLanguage(newLang);
      } catch (e) {
        console.log('i18n changeLanguage error', e);
      }
      const token = await getStorageValue(STORAGE_TOKEN);
      try {
        await axios.get(`${currentEnv.providerApiBaseUrl}lookups/${newLang}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
      } catch (error) {
        console.log(error);
      }
      dispatch(setLoading({ loading: false, message: '' }));
      history.goBack();
    } catch (err) {
      console.log(err);
      dispatch(setLoading({ loading: false, message: '' }));
    }
  };

  const updateLanguage = async () => {
    let practice = provider.practice;

    const updatedPractice = {
      ...practice,
      preferredLanguage: newLang, // or any updated value
    };

    const response = await dispatch(
      updatePracticeAction({ practiceId, providerId, practice: updatedPractice })
    );

    return response;
  };

  return (
    <IonPage className={CSSprefix} {...handlers} ref={refPassthrough}>
      <SwipeHandler parentRef={subscriptionDetailsRef} />
      <Header
        showBack
        showMenu={false}
        showSave
        selectedLang={selectedLang}
        newLang={newLang}
        saveCB={handleLanguageSave}
      />
      <IonContent fullscreen={true}>
        <IonItem className="ion-margin-vertical" lines="none">
          <IonText className={`${CSSprefix}-title ion-margin-top`}>
            {t('configuration_Language')}
          </IonText>
        </IonItem>

        <IonRadioGroup value={newLang} onIonChange={e => setNewLang(e.detail.value)}>
          <IonItem lines="none">
            <IonLabel>{t('configuration_english')}</IonLabel>
            <IonRadio slot="end" value="en" mode="md" />
          </IonItem>
          <IonItem lines="none">
            <IonLabel>{t('configuration_portuguese')}</IonLabel>
            <IonRadio slot="end" value="pt" mode="md" />
          </IonItem>
          <IonItem lines="none">
            <IonLabel>{t('configuration_spanish')}</IonLabel>
            <IonRadio slot="end" value="es" mode="md" />
          </IonItem>
        </IonRadioGroup>
      </IonContent>
    </IonPage>
  );
};

export default LanguagePage;
