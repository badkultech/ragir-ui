"use client";

import { X, Send } from "lucide-react";
import { useState } from "react";

interface InviteFriendsModalProps {
    onClose: () => void;
    onNext: (email: string) => void;
}

export default function InviteFriendsModal({
    onClose,
    onNext,
}: InviteFriendsModalProps) {
    const [email, setEmail] = useState("");

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden">

                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h3 className="font-semibold text-lg">Invite Friends</h3>
                    <button onClick={onClose}>
                        <X />
                    </button>
                </div>

                {/* BODY */}
                <div className="p-6 space-y-4">
                    <p className="text-sm text-gray-600">
                        Share this amazing trip with your friends and travel together!
                    </p>

                    <input
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />

                    <button
                        onClick={() => onNext(email)}
                        disabled={!email}
                        className="ml-auto flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg disabled:opacity-50"
                    >
                        <Send className="w-4 h-4" />
                        Send Invite
                    </button>
                </div>
            </div>
        </div>
    );
}
