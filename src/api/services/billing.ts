import { InvoicePreviewPayload, Preview } from "../../shared/types/invoice.type";
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