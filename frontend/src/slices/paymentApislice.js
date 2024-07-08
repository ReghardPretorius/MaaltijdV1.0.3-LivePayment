import { apiSlice } from './apiSlice';
const USERS_URL = '/api/checkout';

export const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    checkout: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
    queryStatus: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/status`, 
        method: 'POST', 
        body: data,
      }),
    }),
  }),
});

export const {
  useCheckoutMutation,
  useQueryStatusMutation
} = paymentApiSlice;