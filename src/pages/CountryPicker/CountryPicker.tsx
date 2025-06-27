import {
  IonButton,
  IonContent,
  IonImg,
  IonItem,
  IonLabel,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText,
  useIonViewWillEnter,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { BUILD_MOOD } from '../../config/envConfig';
import { SING_IN } from '../../shared/routes/routes';
import { setCountryFlag, setEnvByCountry } from '../../state/persistSlice';
import { getCountriesForRegionAction } from '../../state/providerSlice';
import { AppDispatch } from '../../state/store';
import './CountryPicker.scss';
import TrovaLogo from '/assets/TrovaLogo.png';
import { countries } from '../../shared/utils/json';

const CSSprefix = 'country-picker';

const CountryPickerScreen: React.FC = (): React.ReactElement => {
  const history = useHistory();
  const dispatch = useDispatch<AppDispatch>();

  const [showingAnimation, setShowingAnimation] = useState<undefined | boolean>();
  // const [countries, setCountries] = useState<any>();
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    setShowingAnimation(true);
    setTimeout(() => setShowingAnimation(false), 1800);
    setLoading(false);
    // getCountries();
  }, []);

  // const getCountries = async () => {
  //   let res = await dispatch(getCountriesForRegionAction());
  //   setCountries(res?.payload);
  // };

  useIonViewWillEnter(() => {
    setSelectedCountry('');
  }, []);

  const getFlagEmoji = (countryCode: any) => {
    return countryCode
      .toUpperCase()
      .replace(/./g, (char: any) => String.fromCodePoint(127397 + char.charCodeAt(0)));
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div
          className={`${
            showingAnimation === true ? 'transition-container' : `${CSSprefix}-main-container`
          } ion-padding`}
        >
          <IonItem
            lines="none"
            slot="start"
            id={showingAnimation ? 'float' : ''}
            className={showingAnimation ? 'transition-logo-item' : `${CSSprefix}-logo-item`}
          >
            <IonImg className={`${CSSprefix}-logo`} src={TrovaLogo} alt="Trova Logo" />
          </IonItem>

          {showingAnimation === false && (
            <>
              <IonItem lines="none" className="ion-no-padding">
                <IonText className={`${CSSprefix}-sign-in`}>{t('select_country')}</IonText>
              </IonItem>
              <IonItem lines="none" className="ion-no-padding ion-margin-bottom">
                <IonText color="dark" className={`${CSSprefix}-welcome`}>
                  {t('please_select_your_country')}
                </IonText>
              </IonItem>

              <IonItem
                lines="none"
                className={`custom-input ion-margin-bottom ${CSSprefix}-sign-in-item`}
              >
                <IonLabel position="stacked" class="custom-input">
                  {t('country')}
                </IonLabel>
                {loading ? (
                  <IonSpinner name="dots" />
                ) : (
                  <IonSelect
                    interface="popover"
                    value={selectedCountry}
                    placeholder={t('select_country')}
                    onIonChange={e => {
                      setSelectedCountry(e.detail.value);
                      dispatch(setCountryFlag(e.detail.value));
                    }}
                  >
                    {/* {countries && Object.keys(countries).length > 0 ? (
                      Object.entries(countries).map(([code, name]) => (
                        <IonSelectOption key={code} value={code}>
                          {getFlagEmoji(code)} {name}
                        </IonSelectOption>
                      ))
                    ) : (
                      <IonSpinner name="dots" />
                    )} */}
                    {countries?.map(({ code, name }: any) => (
                      <IonSelectOption key={code} value={code}>
                        {getFlagEmoji(code)} {name}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                )}
              </IonItem>

              <IonButton
                className="login-button"
                color="primary"
                disabled={!selectedCountry}
                expand="block"
                onClick={() => {
                  dispatch(
                    setEnvByCountry({
                      countryCode: selectedCountry,
                      mode: BUILD_MOOD,
                    })
                  );

                  history.push(SING_IN);
                }}
              >
                {t('continue')}
              </IonButton>
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CountryPickerScreen;
