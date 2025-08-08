import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './languageSwitcher.scss';

const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);



  const toggleLanguage = () => {
    // const newLang = currentLang === 'en' ? 'pt' : 'en';
    // i18n.changeLanguage(newLang);
    // setCurrentLang(newLang);
    // localStorage.setItem("language", newLang);
  };

  return (
    <div className="switch-container">
      <div className="switch">
        <input
          id="language-toggle"
          className="check-toggle check-toggle-round-flat"
          type="checkbox"
          checked={currentLang === 'pt'}
          onChange={toggleLanguage}
        />
        <label htmlFor="language-toggle"></label>
        <span className="on">EN</span>
        <span className="off">PT</span>
      </div>
    </div>
  );
};

export default LanguageToggle;
