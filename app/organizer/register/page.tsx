"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Eye, EyeOff, X } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { useRouter, useSearchParams } from "next/navigation";
import { useSetupOrganizerPasswordMutation } from "@/lib/services/setup-organizer-password";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/lib/slices/auth";
import { jwtDecode } from "jwt-decode";
import { AuthTokenPayload } from "@/hooks/useDecodedToken";
import { getDashboardPath } from "@/lib/utils";
import { showApiError } from "@/lib/utils/toastHelpers";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamically import your privacy page so it doesn’t load until needed
const PrivacyPolicyPage = dynamic(
  () => import("@/app/organizer/privacy-policy/page"),
  {
    ssr: false,
  }
);

export default function OrganizerRegisterPage() {
  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const searchParams = useSearchParams();
  const emailFromParams = searchParams.get("email") || "";
  const orgNameFromParams = searchParams.get("orgName") || "";
  const tokenFromParams = searchParams.get("token") || "";
  const [showPolicy, setShowPolicy] = useState(false);
  const [setupOrganizerPassword] = useSetupOrganizerPasswordMutation();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const [form, setForm] = useState({
    orgName: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    emailFromParams || form.email
  );
  const handle = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));
  const isValid =
    emailValid &&
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.password.length >= 8 &&
    form.password === form.confirmPassword &&
    form.agree;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    try {
      setIsLoading(true);
      const result = await setupOrganizerPassword({
        token: tokenFromParams,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        orgName: orgNameFromParams || form.orgName,
      }).unwrap();
      console.log("raw mutation result:", result);

      // save tokens in localStorage & redux
      if (result.accessToken && result.refreshToken) {
        localStorage.setItem("accessToken", result.accessToken);
        localStorage.setItem("refreshToken", result.refreshToken);

        dispatch(
          setCredentials({
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
          })
        );
        // decode immediately instead of waiting for Redux
        const decodedData = jwtDecode<AuthTokenPayload>(result.accessToken);

        router.replace("/organizer/profile/empty");
      }
    } catch (err) {
      console.error("mutation failed:", err);
      // Use your custom toast for backend error messages
      showApiError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col !font-poppins bg-white">
      <AppHeader showLogo={true} showAvatar={false} />

      {/* Background section */}
      <div className="flex-1">
        <div
          className="min-h-[calc(100vh-64px)] flex items-start md:items-center justify-center px-3 md:px-6 py-6 md:py-10"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,189,189,0.35) 0%, rgba(255,145,125,0.35) 35%, rgba(253,112,97,0.35) 60%, rgba(255,182,120,0.35) 100%)",
            backgroundImage: "url('/bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Card */}
          <div className="w-full max-w-[500px] bg-white rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-gray-100">
            <form onSubmit={onSubmit} className="p-5 md:p-8 lg:p-10">
              <h1 className="text-2xl md:text-[26px] font-semibold text-gray-900 mb-6">
                Complete Your Registration
              </h1>

              <div className="space-y-5 md:space-y-6">
                {/* Organizer Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Organizer Name
                  </label>
                  <input
                    value={orgNameFromParams || form.orgName}
                    onChange={(e) => handle("orgName", e.target.value)}
                    placeholder="Enter organizer name"
                    className="w-full rounded-xl bg-gray-100/70 border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={emailFromParams || form.email}
                    onChange={(e) => handle("email", e.target.value)}
                    placeholder="contact@email.com"
                    className="w-full rounded-xl bg-gray-100/70 border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  />
                </div>

                {/* First / Last name */}
                <div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                      First Name
                    </label>
                    <input
                      value={form.firstName}
                      onChange={(e) => handle("firstName", e.target.value)}
                      placeholder="Enter first name"
                      className="w-full rounded-xl bg-white border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                      Last Name
                    </label>
                    <input
                      value={form.lastName}
                      onChange={(e) => handle("lastName", e.target.value)}
                      placeholder="Enter last name"
                      className="w-full rounded-xl bg-white border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    />
                  </div>
                </div>
                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Create Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPwd ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => handle("password", e.target.value)}
                      placeholder="Enter a strong password"
                      className="w-full rounded-xl bg-white border border-gray-200 px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      aria-label="Toggle password"
                    >
                      {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPwd2 ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={(e) =>
                        handle("confirmPassword", e.target.value)
                      }
                      placeholder="Confirm your password"
                      className="w-full rounded-xl bg-white border border-gray-200 px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd2((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      aria-label="Toggle confirm password"
                    >
                      {showPwd2 ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Terms */}
                <label className="flex items-start gap-3 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.agree}
                    onChange={(e) => handle("agree", e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                  />
                  <span className="text-sm text-gray-700">
                    I agree to all the{" "}
                    <span className="font-semibold hover:underline">Terms</span>{" "}
                    and{" "}
                    <button
                      type="button"
                      onClick={() => setShowPolicy(true)}
                      className="font-semibold hover:underline"
                    >
                      Privacy Policy
                    </button>
                  </span>
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!isValid}
                  className="w-full mt-2 rounded-full text-white font-medium py-3.5 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-[#FEA901] via-[#FD6E34] to-[#FD401A] shadow-sm hover:shadow-md transition"
                >
                  Complete Registration
                </button>

                {/* Modal */}
                {showPolicy && (
                  <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                    onClick={() => setShowPolicy(false)} // closes on outside click
                  >
                    <div
                      className="bg-white rounded-2xl shadow-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto relative p-6"
                      onClick={(e) => e.stopPropagation()} // prevents closing when clicking inside
                    >
                      {/* Top right corner controls */}
                      <div className="absolute top-4 right-4 flex gap-3 items-center">
                        {/* Open in new tab */}
                        <a
                          href="/organizer/privacy-policy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gray-600"
                          title="Open in new tab"
                        >
                          <ArrowUpRight className="w-5 h-5" />
                        </a>
                        {/* Close */}
                        <button
                          onClick={() => setShowPolicy(false)}
                          className="text-gray-400 hover:text-gray-600"
                          title="Close"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="pr-4 mt-2">
                        <PrivacyPolicyPage />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
