export interface NotificationStatus {
  unreadCount: number;
  notifications: {
    id:  number;
    title: string;
    message: string;
    type: string;   // e.g. info/success/warning
    isSeen: boolean;
    sentAt?: string;
  }[];
}
