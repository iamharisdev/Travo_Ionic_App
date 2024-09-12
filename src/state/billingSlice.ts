import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { resetAll } from './common.actions';
import { StatusState } from '../shared/types/state.type';
import { getPaymentMethod } from '../api/services/billing';

export interface PaymentMethod {
  subscriptionActive: boolean;
  cardBrand: string;
  expirationMonth: string;
  expirationYear: string;
  last4: string;
  upcomingInvoiceAmountDue: number;
  upcomingInvoiceDueDate: string | null;
  currentStripePriceId: string;
  primarySubscription: boolean;
}

export interface ProviderState {
  paymentMethod: PaymentMethod | null;
  state: StatusState;
}

const initialState: ProviderState = {
  paymentMethod: null,
  state: {
    success: false,
  }
}

export const getPaymentMethodAction = createAsyncThunk(
  'billing/getPaymentMethod',
  async ({ practiceId, providerId }: { practiceId: string; providerId: string; }): Promise<PaymentMethod | null> => {
    try {
      const response = await getPaymentMethod(practiceId, providerId);

      return response.data;
    } catch (error: any) {
      console.error('[getPaymentMethod]: ', error);
      return null;
    }
  }
);

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(resetAll, () => initialState)
      .addCase(getPaymentMethodAction.pending, () => console.log('pending get business information'))
      .addCase(getPaymentMethodAction.fulfilled, (state, action: PayloadAction<PaymentMethod | null>) => {
        state.paymentMethod = action.payload;
        state.state = { ...state.state, success: true, error: null, message: '' };
      })
      .addCase(getPaymentMethodAction.rejected, (state) => {
        state.paymentMethod = null;
        state.state = { ...state.state, success: false }
      });
  }
});

export default billingSlice.reducer;