"use client";

import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { AppHeader } from "@/components/app-header";
import { GradientButton } from "@/components/gradient-button";
// ✅ import mutation
import { useJoinAsPartnerMutation } from "@/lib/services/prelaunch/partners";
import { showApiError, showSuccess } from "@/lib/utils/toastHelpers";

export default function JoinAsPartner() {
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [name, setName] = useState("");

    const [joinAsPartner, { isLoading }] = useJoinAsPartnerMutation();

    // --- Handle phone input with validation ---
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/[^0-9]/g, "").replace(/^0+/, "");
        if (value.length > 10) value = value.slice(0, 10);
        setPhone(value);
    };

    // --- Handle email validation ---
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) setEmailError("");
        else if (!emailRegex.test(value))
            setEmailError("Please enter a valid email address");
        else setEmailError("");
    };

    // --- On submit validation ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            showApiError("Please enter your name.");
            return;
        }

        if (name.length > 50) {
            showApiError("Name cannot exceed 50 characters.");
            return;
        }

        if (emailError || !email) {
            showApiError("Please enter a valid email address.");
            return;
        }

        if (phone.length !== 10) {
            showApiError("Please enter a valid 10-digit phone number.");
            return;
        }

        try {
            const result = await joinAsPartner({
                organizerName: name.trim(),
                email,
                phone,
            }).unwrap();

            showSuccess("🎉 Successfully registered as a partner!");
            console.log("Partner registered:", result);

            // Reset form
            setName("");
            setEmail("");
            setPhone("");
        } catch (error: any) {
            console.error("Error submitting form:", error);
            showApiError(error?.data || "Something went wrong. Please try again.");
        }
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-orange-200 via-pink-200 to-red-200"
            style={{
                backgroundImage: "url(/bg.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundBlendMode: "overlay",
            }}
        >
            <AppHeader showLogo={true} showAvatar={false} />

            <main
                className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] bg-cover bg-center px-4 sm:px-6 lg:px-8 overflow-y-auto"
            >
                <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 sm:p-8">
                    <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
                        Join as Partner
                    </h1>
                    <p className="text-gray-600 text-sm mb-6">
                        Expand your reach and connect with travelers worldwide
                    </p>

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        {/* Organizer Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Organizer Name
                            </label>
                            <Input
                                type="text"
                                placeholder="Enter name"
                                className="rounded-lg"
                                maxLength={50}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <p className="text-xs text-right text-gray-400 mt-1">
                                {name.length}/50 Characters
                            </p>
                        </div>

                        {/* Email Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <Input
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                placeholder="Enter email address"
                                className="rounded-lg"
                            />
                            {emailError && (
                                <p className="text-xs text-red-500 mt-1">{emailError}</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone no.
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    type="text"
                                    value="+91"
                                    className="w-16 text-center rounded-lg"
                                    readOnly
                                />
                                <Input
                                    type="text"
                                    inputMode="numeric"
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    placeholder="Enter 10-digit number"
                                    className="flex-1 rounded-lg"
                                />
                            </div>
                            {phone && phone.length !== 10 && (
                                <p className="text-xs text-red-500 mt-1">
                                    Phone number must be 10 digits
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <GradientButton
                            type="submit"
                            disabled={isLoading}
                            className={`mt-4 w-full rounded-full text-white py-2 font-medium transition ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
                                }`}
                        >
                            {isLoading ? "Submitting..." : "Join as Partner"}
                        </GradientButton>
                    </form>
                </div>
            </main>
        </div>
    );
}
