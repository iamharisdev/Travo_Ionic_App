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