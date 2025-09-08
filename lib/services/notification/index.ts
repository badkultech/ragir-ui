// services/notification.ts
import { baseAPI } from "..";
import { ApiResponse } from "@/lib/services/common-types";
import { ENDPOINTS } from "@/lib/utils";
import { NotificationStatus } from "./types";

export const notificationAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getUserNotifications: builder.query<
      { unreadCount: number; notifications: any[] },
      { organizationId: string; userId: string }
    >({
      query: ({ organizationId, userId }) =>
        ENDPOINTS.USER_NOTIFICATIONS(organizationId, userId),
      transformResponse: (response: any) => {
        const notifications = response?.data || [];
        const unreadCount = notifications.filter((n: any) => !n.isSeen).length;

        return {
          unreadCount,
          notifications: notifications.map((n: any) => ({
            id: n.id,
            title: n.notification?.title,
            message: n.notification?.message,
            sentAt: n.sentAt,
            isSeen: n.isSeen,
          })),
        };
      },
      providesTags: ["notifications"],
    }),

    markNotificationAsSeen: builder.mutation<
      NotificationStatus, // you may adjust return type to match DTO
      { organizationId: string; userId: string; id: number }
    >({
      query: ({ organizationId, userId, id }) => ({
        url: ENDPOINTS.MARK_NOTIFICATION_SEEN(organizationId, userId, id),
        method: "PUT",
      }),
      invalidatesTags: ["notifications"],
    }),
  }),
});

export const {
  useGetUserNotificationsQuery,
  useMarkNotificationAsSeenMutation,
} = notificationAPI;
