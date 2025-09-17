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
import { AppHeader } from "@/components/app-header";
import LoadingOverlay from "@/components/common/LoadingOverlay";
import { AuthTokenPayload } from "@/hooks/useDecodedToken";
import { jwtDecode } from "jwt-decode";

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
        localStorage.setItem("accessToken", result.accessToken);
        localStorage.setItem("refreshToken", result.refreshToken);

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
      const fetchError = error as FetchBaseQueryError;
      console.error("Login error:", error);
      showApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Lock scroll on the page
    <div className="h-screen overflow-hidden flex flex-col !font-poppins">
      <AppHeader showAvatar={false} showLogo={true} />

      {/* Fill remaining height without extra scroll */}
      <div
        className="flex-1 overflow-hidden"
        style={{ backgroundImage: "url('/bg.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        {/* Center the card; prevent internal scroll by letting form wrap */}
        <div className="h-full w-full flex items-center justify-center p-3 md:p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-gray-900">
              Admin Login
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label className="block text-base md:text-lg font-medium text-gray-700">
                  Enter Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  className="w-full rounded-2xl border-0 bg-blue-50 px-5 py-3.5 md:py-4 text-base md:text-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                {email.length > 0 && !emailValid && (
                  <p className="text-[#FF804C] text-sm">
                    Enter valid email address
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-base md:text-lg font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border-0 bg-blue-50 px-5 py-3.5 md:py-4 pr-12 text-base md:text-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center pt-1">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-orange-500 bg-gray-100 border-gray-300 rounded focus:ring-orange-400 focus:ring-2"
                />
                <label htmlFor="remember-me" className="ml-3 text-base text-gray-700">
                  Remember Me
                </label>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!isFormValid || isLoading}
                  className="w-full font-semibold text-lg md:text-xl py-3.5 md:py-4 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-[#FEA901] via-[#FD6E34] to-[#FD401A] text-white hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] shadow-md relative"
                >
                  <LoadingOverlay isLoading={isLoading} message="Logging in..." />
                  Login to Dashboard
                </button>
              </div>

              {/* Forgot Password */}
              <div className="text-center pt-1">
                <Link
                  href="/admin/forgot-password"
                  className="text-[#FF804C] text-base hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
