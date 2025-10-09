"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useLoginMutation } from "@/lib/services/login";
import { selectAuthState, setCredentials } from "@/lib/slices/auth";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { getDashboardPath } from "@/lib/utils";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { showApiError, showSuccess } from "@/lib/utils/toastHelpers";
import LoadingOverlay from "@/components/common/LoadingOverlay";
import { AppHeader } from "@/components/app-header";
import { jwtDecode } from "jwt-decode";
import type { AuthTokenPayload } from "@/hooks/useDecodedToken";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const dispatch = useDispatch();
  const router = useRouter();
  const { userData } = useSelector(selectAuthState);

  const isFormValid = emailValid && password.length > 0;
  const [login] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    try {
      const result = await login({ email, password }).unwrap();
      if (result.accessToken && result.refreshToken) {
        if (rememberMe) {
          localStorage.setItem("accessToken", result.accessToken);
          localStorage.setItem("refreshToken", result.refreshToken);
        } else {
          // still store tokens (adjust according to your auth flow)
          localStorage.setItem("accessToken", result.accessToken);
          localStorage.setItem("refreshToken", result.refreshToken);
        }

        const decodedData = jwtDecode<AuthTokenPayload>(result.accessToken);

        dispatch(
          setCredentials({
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
          })
        );

        const dashboardPath = getDashboardPath(decodedData?.userType);
        showSuccess("Login successful!");
        router.replace(dashboardPath);
      }
    } catch (error) {
      console.error("Login error:", error);
      showApiError(error as FetchBaseQueryError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col !font-poppins">
      <AppHeader showAvatar={false} showLogo={true} />

      <main className="relative flex-1">
        {/* Background image placed in an absolute container so it always covers the viewport */}
        <div className="absolute inset-0 -z-10">
          {/* IMPORTANT: file is pulled from /public/bg.jpg (case-sensitive) */}
          <Image
            src="/bg.jpg"
            alt="Background"
            fill
            priority
            style={{ objectFit: "cover" }}
            sizes="100vw"
          />
          {/* optional subtle overlay to keep form readable */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[rgba(255,255,255,0.06)] to-transparent" />
        </div>

        <div className="relative z-10 flex items-center justify-center h-full p-6">
         <div className="w-full max-w-md sm:max-w-lg bg-white rounded-2xl shadow-xl p-8 sm:p-10">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 !font-poppins">Admin Login</h1>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">Enter Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border-0 bg-blue-50 px-4 py-3 text-sm sm:text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                {email.length > 0 && !emailValid && (
                  <p className="text-[#FF804C] text-sm mt-2">Enter valid email address</p>
                )}
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full rounded-2xl border-0 bg-blue-50 px-4 py-3 pr-12 text-sm sm:text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-orange-500 bg-gray-100 border-gray-300 rounded focus:ring-orange-400 focus:ring-2"
                />
                <label htmlFor="remember-me" className="ml-3 text-sm sm:text-base text-gray-700">Remember Me</label>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={!isFormValid || isLoading}
                  className="w-full font-semibold text-base sm:text-lg py-3 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-[#FEA901] via-[#FD6E34] to-[#FD401A] text-white hover:shadow-lg"
                >
                  <LoadingOverlay isLoading={isLoading} message="Logging in..." />
                  <span className="relative">Login to Dashboard</span>
                </button>
              </div>

              <div className="text-center">
                <Link href="/admin/forgot-password" className="text-[#FF804C] text-sm sm:text-base hover:underline font-medium">Forgot password?</Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
