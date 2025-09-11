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
import {
  useCreateSuperAdminMutation,
  useGetNextAdminIdQuery,
} from "@/lib/services/superadmin/add-admin";
import { selectAuthState } from "@/lib/slices/auth";
import { useSelector } from "react-redux";
import { GradientButton } from "@/components/gradient-button";
import {
  CreateSuperAdminRequest,
  UserDTO,
} from "@/lib/services/superadmin/add-admin/types";
import { toast } from "@/hooks/use-toast";
import { showApiError, showSuccess } from "@/lib/utils/toastHelpers";
import LoadingOverlay from "@/components/common/LoadingOverlay";
import { useRouter } from "next/navigation";

export default function AddAdmin() {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: "SYSTEM_ADMIN",
    employeeNumber: "",
  });
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userData } = useSelector(selectAuthState);
  const organizationId = userData?.organizationPublicId;
  const { data: data } = useGetNextAdminIdQuery(organizationId);
  const router = useRouter();
  const [createSuperAdmin, { isLoading: isLoading }] =
    useCreateSuperAdminMutation();

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

    try {
      const payload: CreateSuperAdminRequest = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        roles: [formData.role], // or from f
        employeeNumber: data ?? "",
      };

      const result = await createSuperAdmin({
        organizationId: organizationId,
        payload,
      }).unwrap(); // throws on error, returns UserDTO on success [4][1]
      console.log("Admin created successfully:", result);
      showSuccess("Admin invitation sent successfully!");
      router.push("/superadmin/admins");
    } catch (err) {
      showApiError(err as any);
      console.error("Failed to create admin:", err);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">
        <Header title="Add Admin" />

        {/* Main Content Area */}
        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            {/* Back Button and Title */}
            <div className="flex items-center mb-8">
              <Link
                href="/superadmin/admins"
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
                    <SelectItem value="SYSTEM_ADMIN">
                      Super Admin (Full Platform Control)
                    </SelectItem>
                    <SelectItem value="ORGANIZATION_ADMIN">
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
              <GradientButton
                type="submit"
                disabled={isSubmitting || !!emailError}
              >
                <LoadingOverlay
                  isLoading={isSubmitting}
                  message="Sending Invitation..."
                />
                Send Admin Invitation
              </GradientButton>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
