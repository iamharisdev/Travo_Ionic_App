import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonPage,
  IonText,
} from "@ionic/react";
import { caretForwardOutline } from "ionicons/icons";
import React, { useRef } from "react";
import { useHistory } from "react-router";
import Header from "../../components/Header/Header";
import SwipeHandler from "../../components/SwipeHandler/SwipeHandler";
import UseSwipeGesture from "../../hooks/useSwipeGesture";
import { LANGUAGE } from "../../shared/routes/routes";

import { useTranslation } from "react-i18next";
import "./Configuration.scss";

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
