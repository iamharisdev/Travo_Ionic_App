import { AcceptInvoicePayload, InvoicePreviewPayload, Preview, Templates } from "../../shared/types/invoice.type";
import { PaymentMethod, ProductDetails, ProductsDetails } from "../../state/billingSlice";
import { billingApiInstance } from "../axios.instance";

export const getPaymentMethod = async (practiceId: string, providerId: string) => {
  return await billingApiInstance.get<PaymentMethod>(`/practices/${practiceId}/providers/${providerId}/subscriptions/payment-method`);
}

export const getProductDetails = async (practiceId: string, providerId: string) => {
  return await billingApiInstance.get<ProductDetails>(`/practices/${practiceId}/providers/${providerId}/subscriptions/product-details`);
}

export const getProductsDetails = async (practiceId: string, countryCode: string) => {
  return await billingApiInstance.get<Array<ProductsDetails>>(`/practices/${practiceId}/subscription-products`, { params: { countryCode } });
}

export const generateInvoicePreview = async (practiceId: string, providerId: string, serviceId: string, payload: InvoicePreviewPayload) => {
  return await billingApiInstance.post<Preview>(`/practices/${practiceId}/providers/${providerId}/services/${serviceId}/invoice-template/preview`, payload);
}

export const getInvoiceTemplates = async (practiceId: string, providerId: string, countryCode: string, pageNumber: number, pageSize: number) => {
  return await billingApiInstance.get<Templates>(`/practices/${practiceId}/providers/${providerId}/invoice-template-library/me`, { params: { countryCode, pageNumber, pageSize } });
}

export const acceptInvoiceTemplate = async (practiceId: string, providerId: string, payload: AcceptInvoicePayload) => {
  return await billingApiInstance.post<{ id: string }>(`/practices/${practiceId}/providers/${providerId}/invoices/data/in-advance`, payload);
}