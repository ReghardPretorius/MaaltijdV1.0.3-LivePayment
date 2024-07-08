import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  checkoutId: '',
  bearerToken: '',
  merchantTransactionId: '',
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    updateCheckoutId: (state, action) => {
      state.checkoutId = action.payload;
    },
    updateMerchantTransactionId: (state, action) => {
      state.merchantTransactionId = action.payload;
    },
    updateBearerToken: (state, action) => {
        state.bearerToken = action.payload;
      },
    resetPayment: (state) => {
      state.checkoutId = '';
      state.bearerToken = '';
      state.merchantTransactionId = '';
    }
  }
});

export const { updateCheckoutId, updateBearerToken, resetPayment, updateMerchantTransactionId } = paymentSlice.actions;
export default paymentSlice.reducer;