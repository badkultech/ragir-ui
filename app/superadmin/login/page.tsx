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
    <div className="min-h-screen flex flex-col overflow-hidden !font-poppins">
      <AppHeader showAvatar={false} showLogo={true} />

      <main className="relative flex-1">
        {/* Background image */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/bg.jpg"
            alt="Background"
            fill
            priority
            style={{ objectFit: "cover" }}
            sizes="100vw"
          />
          {/* Light overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[rgba(255,255,255,0.06)] to-transparent" />
        </div>

        {/* Centered card */}
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
          <div className="w-full max-w-sm sm:max-w-md bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 border border-orange-100">
            <h1 className="text-xl sm:text-2xl font-bold mb-5 text-gray-900 text-center">
              Admin Login
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border-0 bg-blue-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                {email.length > 0 && !emailValid && (
                  <p className="text-[#FD6E34] text-xs mt-2">
                    Enter a valid email address
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full rounded-xl border-0 bg-blue-50 px-4 py-3 pr-10 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
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

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 appearance-none rounded-full border border-gray-300 bg-gray-100 checked:bg-gradient-to-r checked:from-[#FEA901] checked:via-[#FD6E34] checked:to-[#FD401A] checked:border-transparent cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-400"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-3 text-sm text-gray-700 select-none cursor-pointer"
                >
                  Remember Me
                </label>
              </div>

              {/* Submit */}
              <div>
                <button
                  type="submit"
                  disabled={!isFormValid || isLoading}
                  className="w-full font-semibold text-sm sm:text-base py-3 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-[linear-gradient(90deg,#FEA901_0%,#FD6E34_33%,#FE336A_66%,#FD401A_100%)] text-white hover:opacity-90 hover:shadow-lg"
                >
                  <span className="relative">Login to Dashboard</span>
                </button>
              </div>

              {/* Forgot Password */}
              <div className="text-center">
                <Link
                  href="/superadmin/forgot-password"
                  className="text-[#FD6E34] text-sm hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
