import React, { useRef } from "react";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonPage,
  IonText,
} from "@ionic/react";
import Header from "../../components/Header/Header";
import { caretForwardOutline, exitOutline } from "ionicons/icons";
import {
  CONFIGRATION,
  MY_PROFILE,
  SING_IN,
  SUBSCRIPTION_DETAILS,
} from "../../shared/routes/routes";
import { useHistory } from "react-router";
import Menu from "../../components/Menu/Menu";
import { PROFILE_MENU_ID } from "../../shared/constants/menu";
import SwipeHandler from "../../components/SwipeHandler/SwipeHandler";
import UseSwipeGesture from "../../hooks/useSwipeGesture";
import {
  closeMenuHandler,
  openMenuHandler,
} from "../../shared/utils/menu.util";
import Logout from "../../components/Logout/Logout";
import { useDispatch } from "react-redux";
import { resetAll } from "../../state/common.actions";
import { removeStorageValue } from "../../storage/storage.util";
import { STORAGE_TOKEN } from "../../constant/storage.constant";

import "./Profile.scss";
import { useTranslation } from "react-i18next";

const CSSprefix = "profile";

const Profile: React.FC = (): React.ReactElement => {
  const profileRef = useRef();
  const history = useHistory();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const { handlers, refPassthrough } = UseSwipeGesture({
    parentRef: profileRef,
    onSwipedLeft: async () => closeMenuHandler(PROFILE_MENU_ID),
    onSwipedRight: async () => openMenuHandler(PROFILE_MENU_ID),
  });

  return (
    <>
      <Menu menuId={PROFILE_MENU_ID} contentId="profile-content" />
      <IonPage
        className={CSSprefix}
        id="profile-content"
        {...handlers}
        ref={refPassthrough}
      >
        <SwipeHandler parentRef={profileRef} />
        <Header showMenu menuId={PROFILE_MENU_ID} />
        <IonContent fullscreen={true} className={CSSprefix}>
          <IonItem lines="none">
            <IonText className={`${CSSprefix}-title`}>
              {t("profile_settings")}
            </IonText>
          </IonItem>
          <div className="custom-item" onClick={() => history.push(MY_PROFILE)}>
            <IonText className="custom-text">
              {t("profile_settings_my_profile")}
            </IonText>
            <IonIcon icon={caretForwardOutline} className="custom-icon" />
          </div>

          <div
            className="custom-item"
            onClick={() => history.push(SUBSCRIPTION_DETAILS)}
          >
            <IonText className="custom-text">
              {t("profile_settings_subscription_details")}
            </IonText>
            <IonIcon className="custom-icon" icon={caretForwardOutline} />
          </div>

          <div
            className="custom-item"
            onClick={() => history.push(CONFIGRATION)}
          >
            <IonText>{t("configuration")}</IonText>

            <IonIcon icon={caretForwardOutline} className="custom-icon" />
          </div>
          <IonItem id="open-logout-modal" lines="none">
            <IonText color="danger"> {t("log_out")} </IonText>
            <IonButton fill="clear" size="small" className="ion-no-margin">
              <IonIcon
                slot="icon-only"
                color="danger"
                icon={exitOutline}
                size="medium"
              />
            </IonButton>
          </IonItem>
        </IonContent>
        <Logout
          id="logout-modal"
          trigger="open-logout-modal"
          cancel={() => null}
          logout={async () => {
            await removeStorageValue(STORAGE_TOKEN);
            const systemLang = navigator.language.split("-")[0];
            const supportedLangs = ["en", "pt"];
            const selectedLang = supportedLangs.includes(systemLang)
              ? systemLang
              : "en";
            i18n.changeLanguage(selectedLang);
            localStorage.removeItem("language");
            dispatch(resetAll());
            history.push(SING_IN);
          }}
        />
      </IonPage>
    </>
  );
};

export default Profile;
