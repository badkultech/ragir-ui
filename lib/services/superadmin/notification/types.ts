export interface NotificationItem {
  id: number;                  // recipientId
  title: string;
  message: string;
  categoryCode: string;
  isSeen: boolean;
  sentAt?: string;
}

export interface UserNotificationsResponse {
  unreadCount: number;
  notifications: NotificationItem[];
}
