"use client";

import { X, Globe, Instagram, Youtube } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function OrganizerProfileModal({
    organizer,
    onClose,
}: {
    organizer: any;
    onClose: () => void;
}) {
    if (!organizer) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto no-scrollbar">

                {/* HEADER */}
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between">
                    <h3 className="font-bold">
                        Organizer Profile
                    </h3>

                    <button onClick={onClose}>
                        <X />
                    </button>
                </div>

                <div className="p-6 space-y-4">

                    {/* AVATAR */}
                    <div className="flex flex-col items-center text-center">
                        <Avatar className="w-20 h-20 mb-3">
                            <AvatarFallback className="bg-green-500 text-white text-2xl">
                                {organizer.organizerName?.[0]}
                            </AvatarFallback>
                        </Avatar>

                        <h4 className="text-lg font-bold">
                            {organizer.organizerName}
                        </h4>

                        {organizer.tagline && (
                            <p className="text-sm text-gray-500 mt-1">
                                {organizer.tagline}
                            </p>
                        )}
                    </div>

                    {/* DESCRIPTION */}
                    {organizer.description && (
                        <p className="text-sm text-gray-700 text-center">
                            {organizer.description}
                        </p>
                    )}

                    {/* SOCIAL LINKS */}
                    {(organizer.websiteUrl ||
                        organizer.instagramHandle ||
                        organizer.youtubeChannel) && (
                            <div className="flex justify-center gap-4 pt-3">
                                {organizer.websiteUrl && (
                                    <a
                                        href={organizer.websiteUrl}
                                        target="_blank"
                                        className="text-gray-600 hover:text-black"
                                    >
                                        <Globe />
                                    </a>
                                )}

                                {organizer.instagramHandle && (
                                    <a
                                        href={organizer.instagramHandle}
                                        target="_blank"
                                        className="text-gray-600 hover:text-black"
                                    >
                                        <Instagram />
                                    </a>
                                )}

                                {organizer.youtubeChannel && (
                                    <a
                                        href={organizer.youtubeChannel}
                                        target="_blank"
                                        className="text-gray-600 hover:text-black"
                                    >
                                        <Youtube />
                                    </a>
                                )}
                            </div>
                        )}

                    {/* CERTIFICATIONS */}
                    {Array.isArray(organizer.certifications) &&
                        organizer.certifications.length > 0 && (
                            <div className="border-t pt-4">
                                <p className="font-semibold mb-2">
                                    Certifications
                                </p>

                                <div className="grid grid-cols-2 gap-2">
                                    {organizer.certifications.map((c: any, i: number) => (
                                        <div
                                            key={i}
                                            className="h-20 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-500"
                                        >
                                            Certificate {i + 1}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
}
