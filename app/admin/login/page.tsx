"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useLoginMutation } from "@/lib/services/login";
import { selectAuthState, setCredentials } from "@/lib/slices/auth";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { getDashboardPath } from "@/lib/utils";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import Link from "next/link";
import { showApiError, showSuccess } from "@/lib/utils/toastHelpers";
import { AppHeader } from "@/components/app-header"; // ✅ import your shared header
import LoadingOverlay from "@/components/common/LoadingOverlay";
import { AuthTokenPayload } from "@/hooks/useDecodedToken";
import { jwtDecode } from "jwt-decode";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Email validation regex
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const dispatch = useDispatch();
  const router = useRouter();
  const { userData } = useSelector(selectAuthState);

  // Form validation
  const isFormValid = emailValid && password.length > 0;

  const [login] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) return;

    setIsLoading(true);
    try {
      const result = await login({ email, password }).unwrap();
      if (result.accessToken && result.refreshToken) {
        localStorage.setItem("accessToken", result.accessToken);
        localStorage.setItem("refreshToken", result.refreshToken);

        // decode immediately instead of waiting for Redux
        const decodedData = jwtDecode<AuthTokenPayload>(result.accessToken);

        dispatch(
          setCredentials({
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
          })
        );

        // redirect based on role
        const dashboardPath = getDashboardPath(decodedData?.userType);
        showSuccess("Login successful!");
        router.replace(dashboardPath);
      }
    } catch (error) {
      console.error("Login error:", error);
      const fetchError = error as FetchBaseQueryError;
      showApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col !font-poppins">
      {/* ✅ Shared AppHeader */}
      <AppHeader showAvatar={false} showLogo={true}  />

      {/* Background with form */}
      <div
        className="flex-1 flex items-center justify-center bg-cover bg-center p-4 min-h-screen"
        style={{ backgroundImage: "url('/OrgRegisterBg.jpg')" }}
      >
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-lg p-8">
          <h1 className="text-4xl !font-poppins font-bold mb-8 text-gray-900">
            Admin Login
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-lg !font-poppins font-medium text-gray-700">
                Enter Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="w-full rounded-2xl border-0 bg-blue-50 px-5 py-4 text-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400 !font-poppins"
              />
              {email.length > 0 && !emailValid && (
                <p className="text-[#FF804C] text-sm !font-poppins">
                  Enter valid email address
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-lg !font-poppins font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border-0 bg-blue-50 px-5 py-4 pr-12 text-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400 !font-poppins"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center pt-2">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-orange-500 bg-gray-100 border-gray-300 rounded focus:ring-orange-400 focus:ring-2"
              />
              <label
                htmlFor="remember-me"
                className="ml-3 text-base text-gray-700 !font-poppins"
              >
                Remember Me
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className="w-full !font-poppins font-semibold text-xl py-4 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-[#FEA901] via-[#FD6E34] to-[#FD401A] text-white hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] shadow-md"
              >
                <LoadingOverlay isLoading={isLoading} message="Logging in..." />
                Login to Dashboard
              </button>
            </div>

            {/* Forgot Password */}
            <div className="text-center pt-2">
              <Link
                href="/admin/forgot-password"
                className="text-[#FF804C] text-base !font-poppins hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
