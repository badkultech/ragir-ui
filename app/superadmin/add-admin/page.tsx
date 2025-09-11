"use client";

import type React from "react";

import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Sidebar } from "@/components/superadmin/sidebar";
import { Header } from "@/components/superadmin/header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetNextAdminIdQuery } from "@/lib/services/superadmin/add-admin";
import { selectAuthState } from "@/lib/slices/auth";
import { useSelector } from "react-redux";

export default function AddAdmin() {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: "super-admin",
  });
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userData } = useSelector(selectAuthState);
  const organizationId = userData?.organizationPublicId;
  const { data: data } = useGetNextAdminIdQuery(organizationId);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "Email address is required";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setFormData((prev) => ({ ...prev, email }));
    setEmailError(validateEmail(email));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailValidationError = validateEmail(formData.email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      return;
    }

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    try {
      console.log("[v0] Submitting admin invitation:", formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Admin invitation sent successfully!");
      // Reset form or redirect
    } catch (error) {
      console.error("[v0] Error sending invitation:", error);
      alert("Failed to send invitation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">
        <Header title="Add Admin" />

        {/* Main Content Area */}
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Back Button and Title */}
            <div className="flex items-center mb-8">
              <Link
                href="/superadmin"
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <h1 className="text-2xl font-semibold text-gray-900">
                Add New Admin
              </h1>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg shadow-sm border p-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Admin ID */}
                <div>
                  <Label
                    htmlFor="adminId"
                    className="text-sm font-medium text-gray-900 mb-2 block"
                  >
                    Admin ID
                  </Label>
                  <Input
                    id="adminId"
                    value={data ?? ""}
                    readOnly
                    disabled
                    className="bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-900 mb-2 block"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    className={`placeholder:text-gray-400 ${
                      emailError ? "border-red-500 focus:border-red-500" : ""
                    }`}
                    value={formData.email}
                    onChange={handleEmailChange}
                    required
                  />
                  {emailError && (
                    <p className="text-red-500 text-sm mt-1">{emailError}</p>
                  )}
                </div>

                {/* First Name */}
                <div>
                  <Label
                    htmlFor="firstName"
                    className="text-sm font-medium text-gray-900 mb-2 block"
                  >
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="Enter first name"
                    className="placeholder:text-gray-400"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                {/* Last Name */}
                <div>
                  <Label
                    htmlFor="lastName"
                    className="text-sm font-medium text-gray-900 mb-2 block"
                  >
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Enter last name"
                    className="placeholder:text-gray-400"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>

              {/* Role Level */}
              <div className="mb-8">
                <Label className="text-sm font-medium text-gray-900 mb-2 block">
                  Select Role Level
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, role: value }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super-admin">
                      Super Admin (Full Platform Control)
                    </SelectItem>
                    <SelectItem value="admin">
                      Admin (Limited Access)
                    </SelectItem>
                    <SelectItem value="moderator">
                      Moderator (Content Management)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Information Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      <span className="font-medium">Important:</span> The new
                      admin will receive an email invitation with their
                      pre-filled email address and instructions to complete
                      their registration and set up their password.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !!emailError}
                className="w-full py-4 rounded-full font-medium text-white shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background:
                    "linear-gradient(135deg, #FEA901 0%, #FD6E34 25%, #FE336A 75%, #FD401A 100%)",
                }}
              >
                {isSubmitting
                  ? "Sending Invitation..."
                  : "Send Admin Invitation"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
