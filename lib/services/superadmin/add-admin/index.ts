import { ENDPOINTS } from "@/lib/utils";
import { baseAPI } from "../..";
import { ApiResponse, PageResponse } from "../../common-types";
import { TAGS } from "../../tags";

export const numberSeriesAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getNextAdminId: builder.query<string, string>({
      query: (organizationId) => ({
        url: ENDPOINTS.GET_NEXT_NUMBER(organizationId),
        method: "GET",
        params: {
          seriesName: "ADMIN_SERIES",
        },
      }),
      transformResponse: (response: ApiResponse<string>) => response.data,
      providesTags: [TAGS.admins],
    }),
  }),
});

export const { useGetNextAdminIdQuery } = numberSeriesAPI;
