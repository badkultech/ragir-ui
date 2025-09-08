import { baseAPI } from "../..";
import { ENDPOINTS } from "@/lib/utils";
import { ApiResponse } from "../../common-types";
import { CreateUserRequest, UserResponse } from "./types";
import { TAGS } from "../../tags";


export const usersAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    createUserByAdmin: builder.mutation<ApiResponse<UserResponse>, {userData : CreateUserRequest, organizationId : string }>({
      query: ({organizationId, userData}) => ({
        url: ENDPOINTS.ADMIN_CREATE_USER(organizationId), // You'll need to add this to your ENDPOINTS
        method: "POST",
        body: userData,
      }),
      // Optional: Transform the response if needed
      transformResponse: (response: ApiResponse<UserResponse>) => response,
      // Optional: Handle errors
      transformErrorResponse: (
        response: { status: string | number; data: any },
        meta,
        arg
      ) => response.data || response.status,
      // Optional: Invalidate related cache tags to refresh user lists
      invalidatesTags: [TAGS.users], // Add this tag type to your baseAPI if using cache tags
    }),
  }),
});

export const { 
  useCreateUserByAdminMutation,
} = usersAPI;
