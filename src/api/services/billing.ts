import { PaymentMethod } from "../../state/billingSlice";
import { billingApiInstance } from "../axios.instance";

export const getPaymentMethod = async (practiceId: string, providerId: string) => {
  return await billingApiInstance.get<PaymentMethod>(`/practices/${practiceId}/providers/${providerId}/subscriptions/payment-method`);
}