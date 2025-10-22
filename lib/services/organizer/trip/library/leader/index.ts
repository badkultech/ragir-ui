// lib/services/organizer/trip/library/leader/index.ts
import { ENDPOINTS } from "@/lib/utils";
import { GroupLeaderRequest, GroupLeaderResponse } from "./types";
import { baseAPI } from "@/lib/services";
import { LibraryApiResponse } from "../types";
import { TAGS } from "@/lib/services/tags";

export const groupLeaderAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all group leaders
    getGroupLeaders: builder.query<GroupLeaderResponse[], string>({
      query: (orgId) => ({
        url: ENDPOINTS.GET_ALL_GROUP_LEADERS(orgId),
        method: "GET",
      }),
      transformResponse: (
        response: LibraryApiResponse<GroupLeaderResponse[]>
      ) => response.data,
      providesTags: [{ type: TAGS.tripLibraryGroupLeader }],
    }),

    // lib/services/organizer/trip/library/leader/index.ts
    getGroupLeaderById: builder.query<
      GroupLeaderResponse,
      { organizationId: string; leaderId: string | number }
    >({
      query: ({ organizationId, leaderId }) => ({
        url: `${ENDPOINTS.SAVE_GROUP_LEADER(organizationId)}/${leaderId}`,
        method: "GET",
      }),
      transformResponse: (res: LibraryApiResponse<GroupLeaderResponse>) =>
        res.data,
      providesTags: [{ type: TAGS.tripLibraryGroupLeader }],
    }),


    // ✅ Save (multipart/form-data, just like DayDescription)
    saveGroupLeader: builder.mutation<
      GroupLeaderResponse,
      { organizationId: string; data: FormData }
    >({
      query: ({ organizationId, data }) => ({
        url: ENDPOINTS.SAVE_GROUP_LEADER(organizationId),
        method: "POST",
        body: data, // 🔥 Send FormData directly — do NOT rebuild here
        // ⚠️ Don't set Content-Type; browser handles boundary
      }),
      transformResponse: (res: LibraryApiResponse<GroupLeaderResponse>) =>
        res.data,
      invalidatesTags: [{ type: TAGS.tripLibraryGroupLeader }],
    }),
  }),
});

export const { useGetGroupLeadersQuery, useSaveGroupLeaderMutation, useGetGroupLeaderByIdQuery, } =
  groupLeaderAPI;
