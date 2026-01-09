"use client";

import { X, Send } from "lucide-react";

interface SendInvitationModalProps {
    onClose: () => void;
    email: string;
    trip: {
        name: string;
        price: string;
        duration: string;
        dates: string;
    };
}

export default function SendInvitationModal({
    onClose,
    email,
    trip,
}: SendInvitationModalProps) {
    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden">

                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h3 className="font-semibold text-lg">Send Invitation</h3>
                    <button onClick={onClose}>
                        <X />
                    </button>
                </div>

                {/* BODY */}
                <div className="p-6 space-y-6">
                    <p className="text-sm text-gray-600">
                        You are about to send a trip invitation to{" "}
                        <span className="font-medium text-black">{email}</span>
                    </p>

                    {/* TRIP DETAILS */}
                    <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2">
                        <p className="font-semibold mb-2">Trip Details</p>

                        <div className="flex justify-between">
                            <span className="text-gray-500">Trip Name:</span>
                            <span className="font-medium">{trip.name}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">Price:</span>
                            <span className="font-medium">{trip.price}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">Duration:</span>
                            <span className="font-medium">{trip.duration}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">Dates:</span>
                            <span className="font-medium">{trip.dates}</span>
                        </div>
                    </div>

                    {/* ACTION */}
                    <button
                        className="ml-auto flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg"
                    >
                        <Send className="w-4 h-4" />
                        Send Invite
                    </button>
                </div>
            </div>
        </div>
    );
}
