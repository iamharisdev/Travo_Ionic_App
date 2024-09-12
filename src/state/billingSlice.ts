import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { resetAll } from './common.actions';
import { StatusState } from '../shared/types/state.type';
import { getPaymentMethod, getProductDetails, getProductsDetails } from '../api/services/billing';

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

export interface ProductDetails {
  productName: string;
  starter: boolean;
}

export interface ProductsDetails {
  id: string;
  name: string;
  price: string;
  currency: string;
  currencySymbol: string;
  stripePriceId: string;
  frequency: string;
}

export interface ProviderState {
  paymentMethod: PaymentMethod | null;
  productDetails: ProductDetails | null;
  productsDetails: Array<ProductsDetails>;
  state: StatusState;
}

// TODO: remove mock values after resolve CORS issue
const mockPayment: PaymentMethod = {
  subscriptionActive: true,
  cardBrand: "visa",
  expirationMonth: "10",
  expirationYear: "2028",
  last4: "4242",
  upcomingInvoiceAmountDue: 44900,
  upcomingInvoiceDueDate: null,
  currentStripePriceId: "price_1PeTZSKdGbegTckpFIv4DBoW",
  primarySubscription: true
}

const mockProductDetails: ProductDetails = {
  productName: "Starter",
  starter: true
}

const mockProductsDetails: Array<ProductsDetails> = [
  {
    id: 'tb12',
    name: 'Premium',
    price: '999.00',
    currency: 'ZAR',
    currencySymbol: 'R',
    stripePriceId: 'price_1PeTTLKdGbegTckpf113Lp5D',
    frequency: 'Monthly'
  },
  {
    id: 'pm15',
    name: 'Starter',
    price: '449.00',
    currency: 'ZAR',
    currencySymbol: 'R',
    stripePriceId: 'price_1PeTZSKdGbegTckpFIv4DBoW',
    frequency: 'Monthly'
  }
]

const initialState: ProviderState = {
  paymentMethod: mockPayment,
  productDetails: mockProductDetails,
  productsDetails: mockProductsDetails,
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
      return mockPayment;
    }
  }
);

export const getProductDetailsAction = createAsyncThunk(
  'billing/getProductDetails',
  async ({ practiceId, providerId }: { practiceId: string; providerId: string; }): Promise<ProductDetails | null> => {
    try {
      const response = await getProductDetails(practiceId, providerId);

      return response.data;
    } catch (error: any) {
      console.error('[getProductDetails]: ', error);
      return mockProductDetails;
    }
  }
);

export const getProductsDetailsAction = createAsyncThunk(
  'billing/getProductsDetails',
  async ({ practiceId, countryCode }: { practiceId: string; countryCode: string; }): Promise<Array<ProductsDetails>> => {
    try {
      const response = await getProductsDetails(practiceId, countryCode);

      return response.data;
    } catch (error: any) {
      console.error('[getProductsDetails]: ', error);
      return mockProductsDetails;
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
        state = initialState;
      })
      .addCase(getProductDetailsAction.pending, () => console.log('pending get product details'))
      .addCase(getProductDetailsAction.fulfilled, (state, action: PayloadAction<ProductDetails | null>) => {
        state.productDetails = action.payload;
        state.state = { ...state.state, success: true, error: null, message: '' };
      })
      .addCase(getProductDetailsAction.rejected, (state) => {
        state = initialState;
      })
      .addCase(getProductsDetailsAction.pending, () => console.log('pending get products details'))
      .addCase(getProductsDetailsAction.fulfilled, (state, action: PayloadAction<Array<ProductsDetails>>) => {
        state.productsDetails = action.payload;
        state.state = { ...state.state, success: true, error: null, message: '' };
      })
      .addCase(getProductsDetailsAction.rejected, (state) => {
        state = initialState;
      });
  }
});

export default billingSlice.reducer;