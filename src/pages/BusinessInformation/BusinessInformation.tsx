import React from "react";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonText,
} from "@ionic/react";
import Header from "../../components/Header/Header";
import { caretDownOutline, caretUpOutline, copyOutline } from "ionicons/icons";

import "./BusinessInformation.scss";

const CSSprefix = 'business-information';

const BusinessInformation: React.FC = (): React.ReactElement => {

  return (
    <IonPage className={CSSprefix}>
      <Header showBack showMenu={false} />
      <IonContent fullscreen={true} className={CSSprefix}>
        <IonItem className="ion-margin-vertical" lines="none">
          <IonText className={`${CSSprefix}-title ion-margin-top`}>
            Business information
          </IonText>
        </IonItem>
        <IonList>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical ${CSSprefix}-form-item`}
          >
            <IonLabel position="stacked" class="custom-input">
              Booking page personalized URL*
            </IonLabel>
            <IonInput
              class="custom"
              type="text"
              placeholder="Enter page name"
              value={null}
              onIonInput={(e) => null}
            />
          </IonItem>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical ${CSSprefix}-form-item`}
          >
            <IonLabel position="stacked" class="custom-input">
              Auto booking page personalized URL
            </IonLabel>
            <IonInput
              class="custom"
              type="text"
              placeholder="Enter page name above to generate"
              value={null}
              onIonInput={(e) => null}
            />
            <IonIcon className={`${CSSprefix}-copy-icon`} slot="end" icon={copyOutline} />
          </IonItem>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical ${CSSprefix}-form-item`}
          >
            <IonLabel position="stacked" class="custom-input">
              Business legal name*
            </IonLabel>
            <IonInput
              class="custom"
              type="text"
              placeholder="Enter business legal name"
              value={null}
              onIonInput={(e) => null}
            />
          </IonItem>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical ${CSSprefix}-form-item`}
          >
            <IonLabel position="stacked" class="custom-input">
              Country*
            </IonLabel>
            <IonSelect
              placeholder="Select country"
              toggleIcon={caretDownOutline}
              expandedIcon={caretUpOutline}
            >
              <IonSelectOption value="australia">Australia</IonSelectOption>
              <IonSelectOption value="brazil">Brazil</IonSelectOption>
              <IonSelectOption value="southAfrica">South Africa</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical ${CSSprefix}-form-item`}
          >
            <IonLabel position="stacked" class="custom-input">State*</IonLabel>
            <IonInput
              class="custom"
              type="text"
              placeholder="Enter state"
              value={null}
              onIonInput={(e) => null}
            />
          </IonItem>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical ${CSSprefix}-form-item`}
          >
            <IonLabel position="stacked" class="custom-input">City*</IonLabel>
            <IonInput
              class="custom"
              type="text"
              placeholder="Enter city"
              value={null}
              onIonInput={(e) => null}
            />
          </IonItem>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical ${CSSprefix}-form-item`}
          >
            <IonLabel position="stacked" class="custom-input">Address line 1*</IonLabel>
            <IonInput
              class="custom"
              type="text"
              placeholder="Enter address line"
              value={null}
              onIonInput={(e) => null}
            />
          </IonItem>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical ${CSSprefix}-form-item`}
          >
            <IonLabel position="stacked" class="custom-input">Address line 2*</IonLabel>
            <IonInput
              class="custom"
              type="text"
              placeholder="Enter address line"
              value={null}
              onIonInput={(e) => null}
            />
          </IonItem>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical ${CSSprefix}-form-item`}
          >
            <IonLabel position="stacked" class="custom-input">ZIP code*</IonLabel>
            <IonInput
              class="custom"
              type="text"
              placeholder="Enter ZIP code"
              value={null}
              onIonInput={(e) => null}
            />
          </IonItem>
          <IonButton
            className={`${CSSprefix}-save-button`}
            color="primary"
            expand="block"
            onClick={() => null}
          >
            Save details
          </IonButton>
        </IonList>
      </IonContent>
    </IonPage >
  );
};

export default BusinessInformation;
