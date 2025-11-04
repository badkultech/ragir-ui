"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Sidebar } from "@/components/superadmin/sidebar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ArrowLeft } from "lucide-react";
import {
  useGetNextOrganizatioNumberQuery,
  useCreateOrganizationMutation,
} from "@/lib/services/superadmin/add-organizer";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth";
import { showError, showSuccess } from "@/lib/utils/toastHelpers";
import {
  BusinessType,
  RegisterOrganizerRequest,
} from "@/lib/services/superadmin/add-organizer/type";
import LoadingOverlay from "@/components/common/LoadingOverlay";
import { AppHeader } from "@/components/app-header";

type FormFields = {
  organizerId: string;
  name: string;
  email: string;
  phone: string;
  businessType: BusinessType["code"];
};

export default function RegisterOrganizer() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState<FormFields>({
    organizerId: "",
    name: "",
    email: "",
    phone: "",
    businessType: "OTHER",
  });

  const router = useRouter();
  const { userData } = useSelector(selectAuthState);
  const organizationId = userData?.organizationPublicId;

  const [errors, setErrors] = useState<
    Partial<Record<keyof FormFields, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);

  const { data } = useGetNextOrganizatioNumberQuery(organizationId);
  const [createOrganization] = useCreateOrganizationMutation();

  // ✅ Validation
  const validate = () => {
    const next: typeof errors = {};
    if (!formData.name.trim()) next.name = "Organizer name is required";
    if (
      !formData.email.trim() ||
      !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)
    )
      next.email = "Enter a valid email";
    const digits = formData.phone.replace(/\D/g, "");
    if (!digits || digits.length < 7 || digits.length > 12)
      next.phone = "Enter a valid phone";
    if (!formData.businessType) next.businessType = "Select business type";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // ✅ Handle input changes
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((f) => ({ ...f, [id]: value }));
  };

  // ✅ Submito
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload: RegisterOrganizerRequest = {
        entityName: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        businessType: formData.businessType, // ✅ no array
        organizationNumber: data ?? "", // ✅ corrected field name
        primaryPhone: formData.phone.trim(),
      };

      await createOrganization({ payload }).unwrap();
      router.push("/superadmin/organizer");
      showSuccess("Organizer registered successfully!");
    } catch (error) {
      console.error("Error registering organizer:", error);
      showError("Failed to register organizer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
            {/* Main Content */}
            <div className="flex-1">
              <AppHeader
                title="Register New Organizer"
                onMenuClick={() => setSidebarOpen(true)} // 👈 pass toggle
              />

        <main className="flex-1 p-6 sm:p-8">
          <div className="max-w-5xl mx-auto">
            <form
              onSubmit={onSubmit}
              className="bg-white rounded-lg shadow-sm border p-6 sm:p-8"
            >
              <div className="space-y-6 max-w-2xl">
                {/* Back + Title */}
                <div className="flex items-center mb-6">
                  <h1 className="text-2xl font-semibold text-gray-900">
                    Register New Organizer
                  </h1>
                </div>
                {/* Organizer ID */}
                <div>
                  <Label
                    htmlFor="organizerId"
                    className="text-sm font-medium text-gray-900 mb-2 block"
                  >
                    Organizer ID
                  </Label>
                  <Input
                    id="organizerId"
                    value={data ?? ""}
                    readOnly
                    disabled
                    className="bg-gray-100 text-gray-500 cursor-not-allowed h-10 px-3 text-sm"
                  />
                </div>

                {/* Organizer Name */}
                <div>
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-900 mb-2 block"
                  >
                    Organizer Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter organizer name"
                    value={formData.name}
                    onChange={onChange}
                    className={`h-10 px-3 text-sm placeholder:text-gray-400 ${
                      errors.name ? "border-red-500 focus:border-red-500" : ""
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
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
                    value={formData.email}
                    onChange={onChange}
                    className={`h-10 px-3 text-sm placeholder:text-gray-400 ${
                      errors.email ? "border-red-500 focus:border-red-500" : ""
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <Label
                    htmlFor="phone"
                    className="text-sm font-medium text-gray-900 mb-2 block"
                  >
                    Phone No.
                  </Label>
                  <div className="flex">
                    <span className="inline-flex items-center justify-center px-3 h-10 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-gray-600 text-sm">
                      +91
                    </span>
                    <Input
                      id="phone"
                      inputMode="numeric"
                      value={formData.phone}
                      onChange={(e) => {
                        // keep only digits
                        let digits = e.target.value.replace(/\D/g, "");

                        // trim leading zeros
                        digits = digits.replace(/^0+/, "");

                        // limit to 10 digits
                        if (digits.length > 10) {
                          digits = digits.slice(0, 10);
                        }

                        setFormData((f) => ({ ...f, phone: digits }));
                      }}
                      className={`h-10 px-3 text-sm rounded-l-none ${
                        errors.phone
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Business Type */}
                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-2 block">
                    Business Type
                  </Label>
                  <Select
                    value={formData.businessType}
                    onValueChange={(v) =>
                      setFormData((f) => ({
                        ...f,
                        businessType: v as BusinessType["code"],
                      }))
                    }
                  >
                    <SelectTrigger
                      className={`h-10 text-sm ${
                        errors.businessType ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TOUR_OPERATOR">
                        Tour Operator
                      </SelectItem>
                      <SelectItem value="TRAVEL_AGENCY">
                        Travel Agency
                      </SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.businessType && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.businessType}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-11 text-sm font-medium text-white rounded-full shadow-lg hover:shadow-xl transition-shadow disabled:opacity-60"
                    style={{
                      background:
                        "linear-gradient(135deg, #FEA901 0%, #FD6E34 25%, #FE336A 75%, #FD401A 100%)",
                    }}
                  >
                    <LoadingOverlay
                      isLoading={submitting}
                      message="Registering..."
                    />
                    Register Organizer
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
