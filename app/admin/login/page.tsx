"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Email validation regex
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
  // Form validation
  const isFormValid = emailValid && password.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid) return;
    
    setIsLoading(true);
    try {
      console.log('Logging in admin:', { email, password, rememberMe });
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col !font-poppins">
      {/* Header */}
      <header className="w-full bg-white shadow-sm flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <img src="/logo.png" alt="Ragir" className="h-8 mr-2" />
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-3.405-3.405A2.032 2.032 0 0118 12.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v1.159c0 .538-.214 1.055-.595 1.436L2 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-gray-300 overflow-hidden">
            <img 
              src="/user-avatar.png" 
              alt="User Avatar" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNGM0Y0RjYiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIxNiIgcj0iNiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMzIgMzJDMzIgMjYuNDc3MSAyNy41MjI5IDIyIDIyIDIySDhDMTIuNDc3MSAyMiA4IDI2LjQ3NzEgOCAzMlYzMkgzMloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+Cg==";
              }}
            />
          </div>
        </div>
      </header>

      {/* Background with form */}
      <div
        className="flex-1 flex items-center justify-center bg-cover bg-center p-4 min-h-screen"
        style={{ backgroundImage: "url('/OrgRegisterBg.jpg')" }}
      >
        {/* Card Container - Same minimal design as register */}
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

            {/* Remember Me Checkbox */}
            <div className="flex items-center pt-2">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-orange-500 bg-gray-100 border-gray-300 rounded focus:ring-orange-400 focus:ring-2"
              />
              <label htmlFor="remember-me" className="ml-3 text-base text-gray-700 !font-poppins">
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
                {isLoading ? 'Logging in...' : 'Login to Dashboard'}
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="text-center pt-2">
              <button
                type="button"
                className="text-[#FF804C] text-base !font-poppins hover:underline focus:outline-none"
                onClick={() => {
                  console.log('Forgot password clicked');
                }}
              >
                Forgot password?
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
