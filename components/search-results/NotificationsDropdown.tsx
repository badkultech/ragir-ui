"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Bell } from "lucide-react";

interface NotificationItem {
    id: number;
    type: string;
    title: string;
    description: string;
    time: string;
    read: boolean;
}

export function NotificationsDropdown({
    notifications,
    onUpdateNotifications,
}: {
    notifications: NotificationItem[];
    onUpdateNotifications: (list: NotificationItem[]) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const markAllAsRead = () => {
        const updated = notifications.map((n) => ({ ...n, read: true }));
        onUpdateNotifications(updated);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={ref}>
            {/* Notification bell */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-white/80 hover:text-white transition-colors relative"
            >
                <Bell className="w-5 h-5" />

                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-[360px] bg-white rounded-2xl shadow-xl border border-[#f1f1f1] overflow-hidden z-50">

                    {/* Header */}
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">Notifications</h3>
                            <p className="text-sm text-gray-500">{unreadCount} unread notifications</p>
                        </div>

                        <button
                            onClick={markAllAsRead}
                            className="text-sm text-[#ff7a30] hover:text-[#ff5a00] font-medium flex items-center gap-1"
                        >
                            <span className="flex items-center">
                                <svg width="21" height="12" viewBox="0 0 21 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.900391 6.90039L4.65039 10.6504M9.90039 4.65039L13.6504 0.900391M6.90039 6.90039L10.6504 10.6504L19.6504 0.900391"
                                        stroke="#FF804C"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </span>
                            Mark all as read
                        </button>
                    </div>

                   {/* NOTIFICATION LIST  */}
                    <div className="max-h-[420px] overflow-y-auto">
                        {notifications.map((n) => (
                            <div
                                key={n.id}
                                onClick={() => {
                                    const updated = notifications.map((item) =>
                                        item.id === n.id ? { ...item, read: true } : item
                                    );
                                    onUpdateNotifications(updated);
                                }}
                                className={`relative px-5 py-4 border-b border-gray-100 flex items-start gap-4 cursor-pointer transition-all 
                                        ${!n.read ? "bg-[#fff4ef]" : "bg-white"}
                                    `}
                            >
                                {/* SAME ICON */}
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center">
                                    <Bell className="w-5 h-5 text-[#4b4b4b]" />
                                </div>

                                {/* CONTENT */}
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-900">{n.title}</p>
                                    <p className="text-sm text-gray-600 mt-0.5">{n.description}</p>
                                    <p className="text-xs text-gray-400 mt-2">{n.time}</p>
                                </div>

                                {/* UNREAD DOT */}
                                {!n.read && (
                                    <span className="absolute right-4 top-6 w-3 h-3 bg-[#ff6a33] rounded-full"></span>
                                )}
                            </div>
                        ))}
                    </div>


                    {/* Footer */}
                    <div className="px-5 py-3 border-t border-gray-100">
                        <button className="w-full text-center text-sm text-[#ff7a30] hover:text-[#ff5a00] font-medium">
                            Show More
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
