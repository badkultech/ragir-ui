"use client";

import { useState } from "react";
import { CheckCircle2, Eye, EyeOff, XCircle } from "lucide-react";

export default function AdminRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const rules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$]/.test(password),
  };

  const strength = Object.values(rules).filter(Boolean).length;

  const strengthColors = [
    "bg-gray-300", // 0
    "bg-red-500", // 1
    "bg-orange-400", // 2
    "bg-yellow-400", // 3
    "bg-green-500", // 4
  ];

  // Email validation regex
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
  // Form validation
  const isFormValid = emailValid && 
    Object.values(rules).every(Boolean) && 
    password === confirmPassword && 
    confirmPassword.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid) return;
    
    setIsLoading(true);
    try {
      // Add your registration logic here
      console.log('Registering admin:', { email, password });
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-poppins">
      {/* Header */}
      <header className="w-full bg-white shadow-sm flex items-center justify-between px-6 py-3">
        <div className="flex items-center">
          <img src="/logo.png" alt="Ragir" className="h-8 mr-2" />
        </div>
        <div className="flex items-center space-x-4">
          <img
            src="/notification-icon.png"
            alt="Notifications"
            className="h-8 w-8 rounded-full border"
          />
          <img
            src="/user-avatar.png"
            alt="User"
            className="h-8 w-8 rounded-full border"
          />
        </div>
      </header>

      {/* Background */}
      <div
        className="flex-1 flex items-center justify-center bg-cover bg-center pt-10"
        style={{ backgroundImage: "url('/OrgRegisterBg.jpg')" }}
      >
        {/* Card */}
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-poppins font-bold mb-6 text-gray-900">
            Admin Register
          </h1>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
              Enter Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 font-poppins"
            />
            {email.length > 0 && !emailValid && (
              <p className="text-[#FF804C] text-sm mt-1 font-poppins">
                Enter valid email address
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
              Create Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 font-poppins"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Password Requirements - Always Show */}
            <div className="mt-4">
              <p className="text-[#FF804C] text-sm mb-2 font-poppins">
                For a strong password, includes:
              </p>
              <div className="space-y-1">
                <div className="flex items-center text-sm">
                  {rules.length ? (
                    <CheckCircle2 className="text-[#FF804C] mr-2" size={16} />
                  ) : (
                    <XCircle className="text-gray-400 mr-2" size={16} />
                  )}
                  <span className="text-gray-600 font-poppins">8+ characters</span>
                </div>
                <div className="flex items-center text-sm">
                  {rules.uppercase ? (
                    <CheckCircle2 className="text-[#FF804C] mr-2" size={16} />
                  ) : (
                    <XCircle className="text-gray-400 mr-2" size={16} />
                  )}
                  <span className="text-gray-600 font-poppins">1 uppercase letter</span>
                </div>
                <div className="flex items-center text-sm">
                  {rules.number ? (
                    <CheckCircle2 className="text-[#FF804C] mr-2" size={16} />
                  ) : (
                    <XCircle className="text-gray-400 mr-2" size={16} />
                  )}
                  <span className="text-gray-600 font-poppins">1 number</span>
                </div>
                <div className="flex items-center text-sm">
                  {rules.special ? (
                    <CheckCircle2 className="text-[#FF804C] mr-2" size={16} />
                  ) : (
                    <XCircle className="text-gray-400 mr-2" size={16} />
                  )}
                  <span className="text-gray-600 font-poppins">1 special symbol (!@#$)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 font-poppins"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {confirmPassword && confirmPassword !== password && (
              <p className="text-[#FF804C] text-sm mt-1 font-poppins">
                Password didn't match
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full font-poppins font-semibold py-3 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-[#FEA901] via-[#FD6E34] to-[#FD401A] text-white hover:opacity-90"
          >
            {isLoading ? 'Creating Account...' : 'Create Admin Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
