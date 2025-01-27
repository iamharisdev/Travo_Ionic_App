export interface LinePreview {
  code: string;
  description: string;
  amount: number;
  serviceDate: string;
  icd10Code: string;
}

export interface Preview {
  lines: Array<LinePreview>;
  subtotal: number;
  total: number;
  templateId: string | null;
  discount: number;
}