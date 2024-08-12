import { apiSlice } from './apiSlice';
const ORDERS_URL = '/order';

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (data) => ({
        url: `${ORDERS_URL}/createOrder`,
        method: 'POST',
        body: data,
      }),
    }),

    updateOrder: builder.mutation({
      query: (data) => ({
        url: `${ORDERS_URL}/updateOrder`,
        method: 'PUT',
        body: data,
      }),
    }),

    createOrderItem: builder.mutation({
      query: (data) => ({
        url: `${ORDERS_URL}/createOrderItem`,
        method: 'POST',
        body: data,
      }),
    }),
    createPaidOrder: builder.mutation({
      query: (data) => ({
        url: `${ORDERS_URL}/createPaidOrder`,
        method: 'POST',
        body: data,
      }),
    }),
      getUserOrders: builder.mutation({
        query: (data) => ({
          url: `${ORDERS_URL}/userOrders`,
          method: 'POST',
          body: data,
        }),
    }),
    getOrderItems: builder.mutation({
      query: (data) => ({
        url: `${ORDERS_URL}/orderItems`,
        method: 'POST',
        body: data,
      }),
  }),
  createStatusLog: builder.mutation({
    query: (data) => ({
      url: `${ORDERS_URL}/createStatus`,
      method: 'POST',
      body: data,
    }),
  }),
  updateStatusLog: builder.mutation({
    query: (data) => ({
      url: `${ORDERS_URL}/updateStatus`,
      method: 'POST',
      body: data,
    }),
  }),

  getOrderDetails: builder.mutation({
    query: (data) => ({
      url: `${ORDERS_URL}/orderdetails`,
      method: 'POST',
      body: data,
    }),
}),

getPaidOrderDetails: builder.mutation({
  query: (data) => ({
    url: `${ORDERS_URL}/paidorderdetails`,
    method: 'POST',
    body: data,
  }),
}),

sendOrderEmail: builder.mutation({
  query: (data) => ({
    url: `/email/order/sendOrder`,
    method: 'POST',
    body: data,
  }),
}),

sendAdminOrderEmail: builder.mutation({
  query: (data) => ({
    url: `/email/order/sendAdminOrder`,
    method: 'POST',
    body: data,
  }),
}),

getTransactionStatus: builder.mutation({
  query: (data) => ({
    url: `${ORDERS_URL}/transactionstatus`,
    method: 'POST',
    body: data,
  }),
}),

getOrderID: builder.mutation({
  query: (data) => ({
    url: `${ORDERS_URL}/getorderID`,
    method: 'POST',
    body: data,
  }),
}),


  }),
});

export const {
    useCreateOrderMutation,
    useUpdateOrderMutation,
    useCreateOrderItemMutation,
    useCreatePaidOrderMutation,
    useGetUserOrdersMutation,
    useGetOrderItemsMutation,
    useGetOrderDetailsMutation,
    useCreateStatusLogMutation,
    useUpdateStatusLogMutation,
    useSendOrderEmailMutation,
    useGetPaidOrderDetailsMutation,
    useSendAdminOrderEmailMutation,
    useGetTransactionStatusMutation,
    useGetOrderIDMutation

} = orderApiSlice;