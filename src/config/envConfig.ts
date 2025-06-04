// src/config/envConfig.ts

export const ENV_CONFIGS = {
  default: {
    dev: {
      build: "dev",
      idApiBaseUrl: "https://qaid.trovahealth.app/",
      providerApiBaseUrl: "https://qaproviderapi.trovahealth.app/api/v1/",
      practiceApiBaseUrl: "https://qapracticeapi.trovahealth.app/api/v1/",
      billingApiBaseUrl: "https://qabilling.trovahealth.app/api/v1/",
      schedulingApiBaseUrl: "https://qaschedulingapi.trovahealth.app/api/v1/",
      patientApiBaseUrl: "https://qapatientapi.trovahealth.app/api/v1/",
      personalizedBaseUrl: "YOUR_PERSONALIZED_BASE_DOMAIN",
      nylasApiUrl: "https://api.eu.nylas.com",
      forgotPasswordUrl: "https://qaid.trovahealth.app/forgot-password-1",
      showEruda: false,
    },
    prod: {
      build: "prod",
      idApiBaseUrl: "https://qaid.trovahealth.app/",
      providerApiBaseUrl: "https://qaproviderapi.trovahealth.app/api/v1/",
      practiceApiBaseUrl: "https://qapracticeapi.trovahealth.app/api/v1/",
      billingApiBaseUrl: "https://qabilling.trovahealth.app/api/v1/",
      schedulingApiBaseUrl: "https://qaschedulingapi.trovahealth.app/api/v1/",
      patientApiBaseUrl: "https://qapatientapi.trovahealth.app/api/v1/",
      personalizedBaseUrl: "YOUR_PERSONALIZED_BASE_DOMAIN",
      nylasApiUrl: "https://api.eu.nylas.com",
      forgotPasswordUrl: "https://qaid.trovahealth.app/forgot-password-1",
      showEruda: false,
    },
    qa: {
      build: "qa",
      idApiBaseUrl: "https://qaid.trovahealth.app/",
      providerApiBaseUrl: "https://qaproviderapi.trovahealth.app/api/v1/",
      practiceApiBaseUrl: "https://qapracticeapi.trovahealth.app/api/v1/",
      billingApiBaseUrl: "https://qabilling.trovahealth.app/api/v1/",
      schedulingApiBaseUrl: "https://qaschedulingapi.trovahealth.app/api/v1/",
      patientApiBaseUrl: "https://qapatientapi.trovahealth.app/api/v1/",
      personalizedBaseUrl: "YOUR_PERSONALIZED_BASE_DOMAIN",
      nylasApiUrl: "https://api.eu.nylas.com",
      forgotPasswordUrl: "https://qaid.trovahealth.app/forgot-password-1",
      showEruda: false,
    },
  },
  brazil: {
    dev: {
      build: " br dev",
      practiceApiBaseUrl: "https://practiceapi.trovahealth.com.br/api/",
      providerApiBaseUrl: "https://providerapi.trovahealth.com.br/api/",
      patientApiBaseUrl: "https://patientapi.trovahealth.com.br/api/",
      schedulingApiBaseUrl: "https://schedulingapi.trovahealth.com.br/api/",
      notesApiBaseUrl: "https://notesapi.trovahealth.com.br/api/",
      billingApiBaseUrl: "https://billing.trovahealth.com.br/api/",
      analyticsApiBaseUrl: "https://analyticsapi.trovahealth.com.br/api/",
    },
    prod: {
      build: " br prod",
      practiceApiBaseUrl: "https://practiceapi.trovahealth.com.br/api/",
      providerApiBaseUrl: "https://providerapi.trovahealth.com.br/api/",
      patientApiBaseUrl: "https://patientapi.trovahealth.com.br/api/",
      schedulingApiBaseUrl: "https://schedulingapi.trovahealth.com.br/api/",
      notesApiBaseUrl: "https://notesapi.trovahealth.com.br/api/",
      billingApiBaseUrl: "https://billing.trovahealth.com.br/api/",
      analyticsApiBaseUrl: "https://analyticsapi.trovahealth.com.br/api/",
    },
    qa: {
      build: " br qa",
      practiceApiBaseUrl: "https://practiceapi.trovahealth.com.br/api/",
      providerApiBaseUrl: "https://providerapi.trovahealth.com.br/api/",
      patientApiBaseUrl: "https://patientapi.trovahealth.com.br/api/",
      schedulingApiBaseUrl: "https://schedulingapi.trovahealth.com.br/api/",
      notesApiBaseUrl: "https://notesapi.trovahealth.com.br/api/",
      billingApiBaseUrl: "https://billing.trovahealth.com.br/api/",
      analyticsApiBaseUrl: "https://analyticsapi.trovahealth.com.br/api/",
    },

    // Add any other Brazil specific URLs here
  },
};

export const BUILD_MOOD = "qa";
