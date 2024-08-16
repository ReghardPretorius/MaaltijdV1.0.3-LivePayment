import { apiSlice } from './apiSlice';
const USERS_URL = '/api/users';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
    findEmail: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/findEmail`,
        method: 'POST',
        body: data,
      }),
    }),
    emailExists: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/emailExists`,
        method: 'POST',
        body: data,
      }),
    }),
    cellnumberExists: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/cellnumberExists`,
        method: 'POST',
        body: data,
      }),
    }),
    registerAddress: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/address`,
        method: 'POST',
        body: data,
      }),
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: data,
      }),
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/updateprofile`,
        method: 'PUT',
        body: data,
      }),
    }),
    updateAddress: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/updateaddress`,
        method: 'PUT',
        body: data,
      }),
    }),
    CellnumberExistsForOtherUsers: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/cellnumberExistsForOtherUser`,
        method: 'POST',
        body: data,
      }),
    }),
    updatePassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/updatepassword`,
        method: 'PUT',
        body: data,
      }),
    }),


    createWalletLog: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/createwalletlog`,
        method: 'POST',
        body: data,
      }),
    }),

    
    getWalletAmount: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/getwalletamount`,
        method: 'POST',
        body: data,
      }),
    }),

    createTempWalletLog: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/createtempwalletlog`,
        method: 'POST',
        body: data,
      }),
    }),

    getTempWalletLog: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/gettempwalletlog`,
        method: 'POST',
        body: data,
      }),
    }),

  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useFindEmailMutation,
  useRegisterAddressMutation,
  useUpdateUserMutation,
  useUpdatePasswordMutation,
  useEmailExistsMutation,
  useCellnumberExistsMutation,
  useUpdateProfileMutation,
  useCellnumberExistsForOtherUsersMutation ,
  useUpdateAddressMutation,
  useCreateWalletLogMutation,
   useGetWalletAmountMutation,
   useCreateTempWalletLogMutation,
   useGetTempWalletLogMutation
} = userApiSlice;
