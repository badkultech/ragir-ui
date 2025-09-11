import { ENDPOINTS } from "@/lib/utils";
import { baseAPI } from "..";
import { ApiResponse, PageResponse } from "../common-types";
import { TAGS } from "../tags";
import { Admin, GetAdminsRequest } from "./types";

export const adminAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAdmins: builder.query<
      PageResponse<Admin>,
      GetAdminsRequest & { organizationId: string }
    >({
      query: ({ page = 0, size = 10, organizationId }) => ({
        url: ENDPOINTS.GET_ALL_ADMINS(organizationId),
        method: "GET",
        params: {
          page,
          size,
        },
      }),
      transformResponse: (response: ApiResponse<PageResponse<Admin>>) =>
        response.data,
      providesTags: [TAGS.admins],
    }),
     activateSuperAdmin: builder.mutation<void, string>({
      query: (publicId) => ({
        url: ENDPOINTS.SUPER_ADMIN_ACTIVATE(publicId),
        method: "PUT",
      }),
      invalidatesTags: [TAGS.admins],
    }),
     suspendSuperAdmin: builder.mutation<void, string>({
      query: (publicId) => ({
        url: ENDPOINTS.SUPER_ADMIN_SUSPEND(publicId),
        method: "PUT",
      }),
      invalidatesTags: [TAGS.admins],
    }),
  }),
});

export const { useGetAdminsQuery, useActivateSuperAdminMutation, useSuspendSuperAdminMutation } = adminAPI;
