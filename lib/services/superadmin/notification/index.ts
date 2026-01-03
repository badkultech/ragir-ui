import { baseAPI } from "../..";
import { ENDPOINTS } from "@/lib/utils";
import { UserNotificationsResponse } from "./types";

export const notificationAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({

    // ==========================
    // USER INBOX
    // ==========================
    getUserNotifications: builder.query<
      UserNotificationsResponse,
      { organizationId: string; userId: string }
    >({
      query: ({ organizationId, userId }) =>
        ENDPOINTS.USER_NOTIFICATIONS(organizationId, userId),

      transformResponse: (response: any): UserNotificationsResponse => {
        const recipients = response?.data ?? [];

        const notifications = recipients.map((r: any) => ({
          id: r.id, // recipientId (important)
          title: r.notification?.title,
          message: r.notification?.message,
          categoryCode: r.notification?.categoryCode,
          sentAt: r.createdDate,
          isSeen: r.isSeen,
        }));

        return {
          unreadCount: notifications.filter((n: any) => !n.isSeen).length,
          notifications,
        };
      },

      providesTags: ["notifications"],
    }),

    // ==========================
    // MARK AS SEEN
    // ==========================
    markNotificationAsSeen: builder.mutation<
      void,
      { organizationId: string; userId: string; recipientId: number }
    >({
      query: ({ organizationId, userId, recipientId }) => ({
        url: ENDPOINTS.MARK_NOTIFICATION_SEEN(
          organizationId,
          userId,
          recipientId
        ),
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
