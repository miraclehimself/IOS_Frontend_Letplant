import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { formatError } from "./errorHandle";
import { MMKV } from 'react-native-mmkv'
import { logout } from "./authenticationSlice";

export const storage = new MMKV()
const baseQuery = fetchBaseQuery({
  baseUrl: "https://letsplant-e2f1ec719b84.herokuapp.com/",
  prepareHeaders: async (headers, { getState }) => {
    const token = storage.getString("token");
    // console.log(token)
    if (token) {
      // console.log(token, 'valid token')
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});


const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  if (result.error && result.error.status === 401) {
    // Token expired or unauthorized
    api.dispatch(logout());
  }
  
  return result;
};

// Define a service using a base URL and expected endpoints
export const Api = createApi({
  reducerPath: "Api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["user", "image"],
  endpoints: (builder) => ({
    registerAccount: builder.mutation({
      query(data) {
        return {
          url: "/api/register",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["user"],
      transformErrorResponse: (response, meta, arg) => ({
        message: formatError(response),
        error: formatError(response),
      }),
    }),

    resetPasswordInitiate: builder.mutation({
      query(data) {
        return {
          url: "/api/forgot-password",
          method: "POST",
          body: {
            email: data,
          },
        };
      },
      transformErrorResponse: (response, meta, arg) => ({
        message: formatError(response),
        error: formatError(response),
      }),
    }),
    resetPasswordFinalized: builder.mutation({
      query(data) {
        return {
          url: "/api/reset-password",
          method: "POST",
          body: data,
        };
      },
      transformErrorResponse: (response, meta, arg) => ({
        message: formatError(response),
        error: formatError(response),
      }),
    }),
    changePassword: builder.mutation({
      query(data) {
        return {
          url: "/api/change-password",
          method: "POST",
          body: data,
        };
      },
      transformErrorResponse: (response, meta, arg) => ({
        message: formatError(response),
        error: formatError(response),
      }),
    }),
    loginAccount: builder.mutation({
      query(data) {
        return {
          url: `/api/login`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["user"],
      transformErrorResponse: (response, meta, arg) => ({
        message: formatError(response),
        error: formatError(response),
      }),
    }),

    makePayment: builder.mutation({
      query() {
        return {
          url: `/pay/payment`,
          method: "POST",
        };
      },
      invalidatesTags: ["user"],
      transformErrorResponse: (response, meta, arg) => ({
        message: formatError(response),
        error: formatError(response),
      }),
    }),

    freePlan: builder.mutation({
      query(data) {
        return {
          url: `/api/plan`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["user"],
      transformErrorResponse: (response, meta, arg) => ({
        message: formatError(response),
        error: formatError(response),
      }),
    }),
    deleteAccount: builder.mutation({
      query() {
        return {
          url: `/api/delete-user`,
          method: "POST",
        };
      },
      transformErrorResponse: (response, meta, arg) => ({
        message: formatError(response),
        error: formatError(response),
      }),
    }),
    verifyAccount: builder.mutation({
      query(data) {
        return {
          url: `/api/verify-email`,
          method: "POST",
          body:data,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
      },
      invalidatesTags: ["user"],
      transformErrorResponse: (response, meta, arg) => ({
        message: formatError(response),
        error: formatError(response),
      }),
    }),
    uploadDocument: builder.mutation({
      query(data) {
        return {
          url: `/app/processplant`,
          method: "POST",
          body: data,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
      },
      invalidatesTags: ["image"],
      transformErrorResponse: (response, meta, arg) => ({
        message: formatError(response),
        error: formatError(response),
      }),
    }),
    getUser: builder.query({
      query: () => `/api/user`,
      providesTags: ["user"],
    }),
    uploadUserDocument: builder.mutation({
      query(data) {
        return {
          url: `/api/edit-user`,
          method: "PUT",
          body: data,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
      },
      transformErrorResponse: (response, meta, arg) => ({
        message: formatError(response),
        error: formatError(response),
      }),
      invalidatesTags: ["user"],
    }),

    getAllProcessPlant: builder.query({
      query: () => `/app/getprocessplant`,
      providesTags: ["image"],
      transformErrorResponse: (response, meta, arg) => ({
        message: formatError(response),
        error: formatError(response),
      }),
    }),
    recommendImage: builder.mutation({
      query(data) {
        return {
          url: `/app/recommend`,
          method: "POST",
          body: data,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
      },
      invalidatesTags: ["image"],
      transformErrorResponse: (response, meta, arg) => ({
        message: formatError(response),
        error: formatError(response),
      }),
    }),
    getPaymentHistory: builder.query({
      query: () => `/pay/get-payments`,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useRegisterAccountMutation,
  useLoginAccountMutation,
  useGetUserQuery,
  useUploadDocumentMutation,
  useGetAllProcessPlantQuery,
  useResetPasswordInitiateMutation,
  useResetPasswordFinalizedMutation,
  useChangePasswordMutation,
  useUploadUserDocumentMutation,
  useRecommendImageMutation,
  useDeleteAccountMutation,
  useMakePaymentMutation,
  useFreePlanMutation,
  useGetPaymentHistoryQuery,
  useVerifyAccountMutation
} = Api;
