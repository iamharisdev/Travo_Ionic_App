import React, { useMemo, useRef } from "react";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonPage,
  IonText,
} from "@ionic/react";
import Header from "../../components/Header/Header";
import { caretForwardOutline } from "ionicons/icons";
import { BRANDING, BUSINESS_INFORMATION, LANGUAGE, PROFILE_INFORMATION } from "../../shared/routes/routes";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import UseSwipeGesture from "../../hooks/useSwipeGesture";
import SwipeHandler from "../../components/SwipeHandler/SwipeHandler";

import "./Configuration.scss";
import { useTranslation } from "react-i18next";

const CSSprefix = 'my-profile';

const ConfigrationPage: React.FC = (): React.ReactElement => {
  const myProfileRef = useRef();
  const history = useHistory();
  const { t } = useTranslation();
  const { handlers, refPassthrough } = UseSwipeGesture({
    parentRef: myProfileRef,
    onSwipedRight: () => history.goBack(),
  });

  return (
    <IonPage className={CSSprefix} {...handlers} ref={refPassthrough}>
      <SwipeHandler parentRef={myProfileRef} />
      <Header showBack showMenu={false} />
      <IonContent fullscreen={true} className={CSSprefix}>
        <IonItem className="ion-margin-vertical" lines="none">
          <IonText className={`${CSSprefix}-title ion-margin-top`}>
          {t("configuration")}
          </IonText>
        </IonItem>
        <IonItem
          className="ion-margin-vertical"
          lines="none"
          onClick={() => history.push(LANGUAGE)}
        >
          <IonText>
            {t("configuration_Language")}
          </IonText>
          <IonButton slot="end" fill="clear" size="small" className="ion-no-margin">
            <IonIcon slot="icon-only" color="dark" icon={caretForwardOutline} size="small" />
          </IonButton>
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

export default ConfigrationPage;
