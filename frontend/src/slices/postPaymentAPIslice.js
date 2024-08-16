import { apiSlice } from './apiSlice';
const USERS_URL = '/postpayment';

export const postPaymentAPIslice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    manualAllWallet: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/manualallwallet`, 
        method: 'POST', 
        body: data,
      }),
    }),
  }),
});

export const {
useManualAllWalletMutation
} = postPaymentAPIslice;