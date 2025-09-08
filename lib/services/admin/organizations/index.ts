import { baseAPI, publicBaseAPI } from "../..";
import { ENDPOINTS } from "@/lib/utils";
import { ApiResponse } from "../../common-types";
import { TAGS } from "../../tags";
import {
  OrganizationStatsResponse,
  UsersListResponse,
  UsersQueryParams,
  UserStats,
} from "./types";

export const orgStatsAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getOrganizationStats: builder.query<
      ApiResponse<OrganizationStatsResponse>,
      void
    >({
      query: () => ({
        url: ENDPOINTS.TENANT_ORG_STATS, // "/api/tenant/dashboard/org-stats"
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<OrganizationStatsResponse>) =>
        response,
      providesTags: [TAGS.organizations],
    }),
    getActiveCustomersCount: builder.query<UserStats, void>({
      query: () => ({
        url: ENDPOINTS.CUSTOMERS_COUNTS, // "/api/tenant/dashboard/customers/active/count"
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<UserStats>) => response.data,
      providesTags: [TAGS.users],
    }),
    getOpenTicketsCount: builder.query<number, void>({
      query: () => ({
        url: ENDPOINTS.OPEN_TICKET_COUNT,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<number>) => response.data,
    }),
    getUsers: builder.query<ApiResponse<UsersListResponse>, UsersQueryParams>({
      query: (params = {}) => ({
        url: `${ENDPOINTS.TENANT_USERS}${params.name?'/search':''}`, // "/api/tenant/users"
        method: "GET",
        params: params,
      }),
      transformResponse: (response: ApiResponse<UsersListResponse>) => response,
      providesTags: [TAGS.users],
    }),
    activateUser: builder.mutation<void, string>({
      query: (publicId) => ({
        url: ENDPOINTS.TENANT_USER_ACTIVATE(publicId),
        method: "PUT",
      }),
      invalidatesTags: [TAGS.users],
    }),
     suspendUser: builder.mutation<void, string>({
      query: (publicId) => ({
        url: ENDPOINTS.TENANT_USER_SUSPEND(publicId),
        method: "PUT",
      }),
      invalidatesTags: [TAGS.users],
    }),
 }),
});

export const {
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useGetOrganizationStatsQuery,
  useGetActiveCustomersCountQuery,
  useGetOpenTicketsCountQuery,
  useActivateUserMutation,
  useSuspendUserMutation
} = orgStatsAPI;
