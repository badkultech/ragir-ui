import { baseAPI } from '../..';
import { ENDPOINTS } from '@/lib/utils';
import { CreateUserRequest, GetByIdRequest, GetUserAPIResponse } from './type';
import { TAGS } from '../../tags';

export const getUserAPI = baseAPI.injectEndpoints({
  endpoints: (b) => ({
    getUsers: b.query<GetUserAPIResponse, GetByIdRequest>({
      query: ({ id }) => ({
        url: `org/${id}/user/all`,
      }),
      providesTags: [TAGS.users], // ✅ Correct location
    }),

    deleteUser: b.mutation<GetUserAPIResponse, GetByIdRequest>({
      query: ({ orgId, userId }) => ({
        method: 'DELETE',
        url: `org/${orgId}/user/${userId}`,
      }),
      invalidatesTags: [TAGS.users],
    }),

    createUser: b.mutation<GetUserAPIResponse, CreateUserRequest>({
      query: ({ orgId, payload }) => ({
        method: 'POST',
        url: `org/${orgId}/user`,
        body: payload,
      }),
      invalidatesTags: [TAGS.users],
    }),
  }),
});

export const { useGetUsersQuery, useDeleteUserMutation, useCreateUserMutation } = getUserAPI;
