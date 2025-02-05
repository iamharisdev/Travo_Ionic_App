export interface LinePreview {
  code: string;
  description: string;
  amount: number;
  serviceDate: string;
  icd10Code?: string;
}

export interface Preview {
  lines: Array<LinePreview>;
  subtotal: number;
  total: number;
  templateId: string | null;
  discount: number;
}

export interface InvoicePreviewPayload {
  patientId: string;
  currency: string;
  currencySymbol: string;
  amount: number;
  appointmentDate: string;
}

export interface TemplateItem {
  createdDate: string;
  modifiedDate: string;
  createdBy: string;
  modifiedBy: string | null;
  id: string;
  practiceId: string;
  providerId: string;
  country: string;
  entityId: string;
  baseTemplateId: string;
  receiptBaseTemplateId: string;
  templateName: string;
  template: string;
  receiptTemplate: string;
  logoId: string;
  logoBase64Content: string | null;
  signatureId: string;
  signatureBase64Content: string | null;
  templatePreviewBase64Content: string;
  receiptTemplatePreviewBase64Content: string;
  archived: boolean,
  editableFields: {
    editablePracticeNumber: {
      key: string;
      value: string;
      placeholder: string;
      label: string | null;
    },
    editableState: {
      key: string;
      value: string;
      placeholder: string;
      label: string | null;
    },
    editablePostalCode: {
      key: string;
      value: string;
      placeholder: string;
      label: string | null;
    },
    editableHPSCAValue: {
      key: string;
      value: string;
      placeholder: string;
      label: string | null;
    },
    editableTreatingPracticeTypeLabel: {
      key: string;
      value: string;
      placeholder: string;
      label: string | null;
    },
    editableProviderLicenseTypeLabel: {
      key: string;
      value: string;
      placeholder: string;
      label: string | null;
    },
    editableCountry: {
      key: string;
      value: string;
      placeholder: string;
      label: string | null;
    },
    editableBusinessRegistrationLabel: {
      key: string;
      value: string;
      placeholder: string;
      label: string | null;
    },
    editableBusinessRegistrationValue: {
      key: string;
      value: string;
      placeholder: string;
      label: string | null;
    },
    editableCity: {
      key: string;
      value: string;
      placeholder: string;
      label: string | null;
    },
    editableTreatingPracticeTypeValue: {
      key: string;
      value: string;
      placeholder: string;
      label: string | null;
    },
    editableHPSCALabel: {
      key: string;
      value: string;
      placeholder: string;
      label: string | null;
    },
    editablePracticeEmail: {
      key: string;
      value: string;
      placeholder: string;
      label: string | null;
    },
    editableProviderNameValue: {
      key: string;
      value: string;
      placeholder: string;
      label: string | null;
    },
    editableTermsLabel: {
      key: string;
      value: string;
      placeholder: string;
      label: string | null;
    },
    editableCompanyNameValue: {
      key: string;
      value: string;
      placeholder: string;
      label: string | null;
    },
    editableTermsValue: {
      key: string;
      value: string;
      placeholder: string;
      label: string | null;
    },
    editableCompanyStreet: {
      key: string;
      value: string;
      placeholder: string;
      label: string | null;
    },
    editableProviderLicenseTypeValue: {
      key: string;
      value: string;
      placeholder: string;
      label: string | null;
    },
    editableSignatureName: {
      key: string;
      value: string;
      placeholder: string;
      label: string | null;
    }
  },
  leftExtraFields: {
    extraField1Label: {
      key: string;
      value: string;
      placeholder: string;
      label: string | null;
    },
    extraField1Value: {
      key: string;
      value: string;
      placeholder: string;
      label: string | null;
    },
    extraField2Label: {
      key: string;
      value: string;
      placeholder: string;
      label: string | null;
    },
    extraField2Value: {
      key: string;
      value: string;
      placeholder: string;
      label: string | null;
    }
  },
  rightExtraFields: {
    extraField1Label: {
      key: string;
      value: string;
      placeholder: string;
      label: string | null;
    },
    extraField1Value: {
      key: string;
      value: string;
      placeholder: string;
      label: string | null;
    },
    extraField2Label: {
      key: string;
      value: string;
      placeholder: string;
      label: string | null;
    },
    extraField2Value: {
      key: string;
      value: string;
      placeholder: string;
      label: string | null;
    }
  },
  autoFields: {
    autoDOB: {
      key: string;
      value: string | null;
      placeholder: string;
      label: string | null;
    },
    autoMedicalAidNumber: {
      key: string;
      value: string;
      placeholder: string;
      label: string | null;
    },
    autoClient: {
      key: string;
      value: string;
      placeholder: string;
      label: string | null;
    },
    autoMedicalAidCompany: {
      key: string;
      value: string;
      placeholder: string;
      label: string | null;
    },
    autoTreatingPracticeNumber: {
      key: string;
      value: string;
      placeholder: string;
      label: string | null;
    },
    autoDependentCode: {
      key: string;
      value: string;
      placeholder: string;
      label: string | null;
    },
    autoInvoiceDate: {
      key: string;
      value: string | null;
      placeholder: string;
      label: string | null;
    },
    autoInvoiceNumber: {
      key: string;
      value: string | null;
      placeholder: string;
      label: string | null;
    }
  }
}

export interface Templates {
  total: number;
  items: Array<TemplateItem>;
}

export interface AcceptInvoicePayload extends Preview {
  templateId: string;
}