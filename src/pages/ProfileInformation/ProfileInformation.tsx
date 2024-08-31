import React from "react";
import {
  IonAvatar,
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTextarea,
} from "@ionic/react";
import Header from "../../components/Header/Header";
import { caretDownOutline, caretUpOutline } from "ionicons/icons";
import PersonSvg from '/assets/person-circle.svg';

import "./ProfileInformation.scss";

const CSSprefix = 'profile-information';

const ProfileInformation: React.FC = (): React.ReactElement => {

  return (
    <IonPage className={CSSprefix}>
      <Header showBack showMenu={false} />
      <IonContent fullscreen={true} className={CSSprefix}>
        <IonItem className="ion-margin-vertical" lines="none">
          <IonText className={`${CSSprefix}-title ion-margin-top`}>
            My profile information
          </IonText>
        </IonItem>
        <IonList>
          <IonRow className="ion-justify-content-center">
            <IonAvatar>
              <img
                alt="person"
                src={PersonSvg}
              />
            </IonAvatar>
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonItem lines="none">
              <IonButton fill="clear" color="primary">Upload photo</IonButton>
              <div className={`${CSSprefix}-divider`} />
              <IonButton fill="clear" color="danger">Remove photo</IonButton>
            </IonItem>
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonText className={`${CSSprefix}-image-description`}>
              Preferred image size: 240px x 240px @ 72DPI
              Maximum size of 1MB.
            </IonText>
          </IonRow>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical ${CSSprefix}-form-item`}
          >
            <IonLabel position="stacked" class="custom-input">First name*</IonLabel>
            <IonInput
              class="custom"
              type="text"
              placeholder="Enter first name"
              value={null}
              onIonInput={(e) => null}
            />
          </IonItem>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical ${CSSprefix}-form-item`}
          >
            <IonLabel position="stacked" class="custom-input">Last name*</IonLabel>
            <IonInput
              class="custom"
              type="text"
              placeholder="Enter last name"
              value={null}
              onIonInput={(e) => null}
            />
          </IonItem>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical ${CSSprefix}-form-item`}
          >
            <IonLabel position="stacked" class="custom-input">Mobile</IonLabel>
            <IonItem
              lines="none"
              className={`${CSSprefix}-nested-item`}
            >
              <IonSelect
                placeholder="Country Code"
                toggleIcon={caretDownOutline}
                expandedIcon={caretUpOutline}
              >
                <IonSelectOption value="52">+52</IonSelectOption>
                <IonSelectOption value="53">+53</IonSelectOption>
                <IonSelectOption value="54">+54</IonSelectOption>
              </IonSelect>
              <IonInput
                class="custom"
                type="number"
                placeholder="Number"
                value={null}
                onIonInput={(e) => null}
              />

            </IonItem>
          </IonItem>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical ${CSSprefix}-form-item`}
          >
            <IonLabel position="stacked" class="custom-input">Display name*</IonLabel>
            <IonInput
              class="custom"
              type="text"
              placeholder="Enter display name"
              value={null}
              onIonInput={(e) => null}
            />
          </IonItem>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical ${CSSprefix}-form-item`}
          >
            <IonLabel position="stacked" class="custom-input">Qualifications and titles</IonLabel>
            <IonInput
              class="custom"
              type="text"
              placeholder="Enter qualifications and titles"
              value={null}
              onIonInput={(e) => null}
            />
          </IonItem>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical ${CSSprefix}-form-item`}
          >
            <IonLabel position="stacked" class="custom-input">Currency*</IonLabel>
            <IonSelect
              placeholder="Enter currency"
              toggleIcon={caretDownOutline}
              expandedIcon={caretUpOutline}
            >
              <IonSelectOption value="aud">AUD</IonSelectOption>
              <IonSelectOption value="brl">BRL</IonSelectOption>
              <IonSelectOption value="zar">ZAR</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem
            lines="none"
            className={`custom-input ion-margin-vertical ${CSSprefix}-form-item`}
          >
            <IonLabel position="stacked" class="custom-input">Bio*</IonLabel>
            <IonTextarea
              autoGrow
              aria-label="bio"
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

export default ProfileInformation;
