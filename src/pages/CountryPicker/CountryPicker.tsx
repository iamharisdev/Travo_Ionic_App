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
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import TrovaLogo from "/assets/TrovaLogo.png";
import "./CountryPicker.scss";
import { useTranslation } from "react-i18next";

const CSSprefix = "country-picker";

const CountryPickerScreen: React.FC = (): React.ReactElement => {
  const [showingAnimation, setShowingAnimation] = useState<
    undefined | boolean
  >();
  const [countries, setCountries] = useState<{ code: string; name: string }[]>(
    []
  );
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    setShowingAnimation(true);
    setTimeout(() => setShowingAnimation(false), 1800);
  }, []);

  const countrie = [
    { code: "BR", name: "Brazil" },
    { code: "US", name: "United States" },
    { code: "DE", name: "Germany" },
    { code: "IN", name: "India" },
    { code: "AU", name: "Australia" },
  ];

  useEffect(() => {
    setCountries(countrie);
    setLoading(false);
  }, []);

  useIonViewWillEnter(() => {
    setSelectedCountry("");
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen>
        <div
          className={`${
            showingAnimation === true
              ? "transition-container"
              : `${CSSprefix}-main-container`
          } ion-padding`}
        >
          <IonItem
            lines="none"
            slot="start"
            id={showingAnimation ? "float" : ""}
            className={
              showingAnimation
                ? "transition-logo-item"
                : `${CSSprefix}-logo-item`
            }
          >
            <IonImg
              className={`${CSSprefix}-logo`}
              src={TrovaLogo}
              alt="Trova Logo"
            />
          </IonItem>

          {showingAnimation === false && (
            <>
              <IonItem lines="none" className="ion-no-padding">
                <IonText className={`${CSSprefix}-sign-in`}>
                  {t("select_country")}
                </IonText>
              </IonItem>
              <IonItem
                lines="none"
                className="ion-no-padding ion-margin-bottom"
              >
                <IonText color="dark" className={`${CSSprefix}-welcome`}>
                  {t("please_select_your_country")}
                </IonText>
              </IonItem>

              <IonItem
                lines="none"
                className={`custom-input ion-margin-bottom ${CSSprefix}-sign-in-item`}
              >
                <IonLabel position="stacked" class="custom-input">
                  {t("country")}
                </IonLabel>
                {loading ? (
                  <IonSpinner name="dots" />
                ) : (
                  <IonSelect
                    interface="popover"
                    value={selectedCountry}
                    placeholder={t("select_country")}
                    onIonChange={(e) => setSelectedCountry(e.detail.value)}
                  >
                    {countries.map((country) => (
                      <IonSelectOption key={country.code} value={country.code}>
                        {country.name}
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
                onClick={() =>
                  console.log("Selected country:", selectedCountry)
                }
              >
                {t("continue")}
              </IonButton>
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CountryPickerScreen;
