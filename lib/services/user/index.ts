// services/user.ts
import { ApiResponse } from "../common-types";
import { ENDPOINTS } from "@/lib/utils";
import { baseAPI } from "..";
import { UserDetails } from "./types";
import { Tags } from "lucide-react";
import { TAGS } from "../tags";

export const userAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getUserDetails: builder.query<
      UserDetails,
      { organizationId: string; publicId: string }
    >({
      query: ({ organizationId, publicId }) => ({
        url: `ENDPOINTS.USER_PROFILE(organizationId, publicId)`, // e.g. /users/:publicId
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<UserDetails>) => response.data,
      providesTags: [TAGS.user],
    }),

    getSelfProfile: builder.query<UserDetails, void>({
      query: () => ({
        url: `${ENDPOINTS.USER_PROFILE}`, // e.g. /profile (logged-in user)
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<UserDetails>) => response.data,
      providesTags: [TAGS.user],
    }),

    updateUserProfile: builder.mutation<UserDetails, Partial<UserDetails>>({
      query: (body) => ({
        url: `${ENDPOINTS.USER_PROFILE}`, // PATCH/PUT to /profile
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiResponse<UserDetails>) => response.data,
      invalidatesTags: [TAGS.user],
    }),
  }),
});

export const {
  useGetUserDetailsQuery,
  useGetSelfProfileQuery,
  useUpdateUserProfileMutation,
} = userAPI;
