"use client";

import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { AppHeader } from "@/components/app-header";
import { GradientButton } from "@/components/gradient-button";

export default function JoinAsPartner() {
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [name, setName] = useState("");

    // --- Handle phone input with validation ---
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        // Remove all non-digit characters
        value = value.replace(/[^0-9]/g, "");

        // Remove leading zeros
        value = value.replace(/^0+/, "");

        // Limit to 10 digits
        if (value.length > 10) value = value.slice(0, 10);

        setPhone(value);
    };

    // --- Handle email validation ---
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);

        // Simple email regex pattern
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!value) {
            setEmailError("");
        } else if (!emailRegex.test(value)) {
            setEmailError("Please enter a valid email address");
        } else {
            setEmailError("");
        }
    };

    // --- On submit validation ---
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (emailError) {
            alert("Please fix the email address before submitting.");
            return;
        }

        if (phone.length !== 10) {
            alert("Please enter a valid 10-digit phone number.");
            return;
        }

        if (!email) {
            alert("Please enter your email address.");
            return;
        }

        console.log("Form submitted:", { phone, email });
        // TODO: submit form logic
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
                style={{ backgroundImage: "url('/images/join-partner-bg.png')" }}
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
                                maxLength={50} // ✅ limits input to 50 chars
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
                            className="mt-4 w-full rounded-full text-white py-2 font-medium hover:opacity-90 transition"
                        >
                            Join as Partner
                        </GradientButton>
                    </form>
                </div>
            </main>
        </div>
    );
}
