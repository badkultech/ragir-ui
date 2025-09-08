'use client';
export const dynamic = 'force-dynamic';

import type React from 'react';
import {
  useGenerateOtpMutation,
  useValidateOtpMutation,
} from '@/lib/services/otp';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plane, Building, User, Smartphone, Mail } from 'lucide-react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/lib/slices/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [userType, setUserType] = useState<string>('user');
  const [loginMethod, setLoginMethod] = useState<'EMAIL' | 'MOBILE'>('MOBILE');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [generateOtp] = useGenerateOtpMutation();
  const [validateOtp, { isLoading: isValidating }] = useValidateOtpMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const identifier = loginMethod === 'MOBILE' ? mobile : email;

      const result = await validateOtp({
        identifier,
        otp,
        type: loginMethod, // "MOBILE" or "EMAIL"
        organization: userType === 'org-admin',
      }).unwrap();

      console.log('✅ OTP validated, login success:', result);

      // store tokens (if backend returns them)
      if (result.accessToken && result.refreshToken) {
        localStorage.setItem('accessToken', result.accessToken);
        localStorage.setItem('refreshToken', result.refreshToken);
        router.replace('/');
      }
      dispatch(
        setCredentials({
          accessToken: result.accessToken || null,
          refreshToken: result.refreshToken || null,
        }),
      );
    } catch (err: any) {
      console.error('❌ OTP validation failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  const [otpError, setOtpError] = useState<string | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const handleSendOtp = async () => {
    const target = loginMethod === 'MOBILE' ? mobile : email;
    if (!target) return;

    setIsSendingOtp(true);
    setOtpError(null); // reset previous error

    try {
      const result = await generateOtp({
        identifier: target,
        type: loginMethod,
        organization: userType === 'org-admin',
      }).unwrap();

      if (result.success) {
        setOtpSent(true);
        console.log('OTP sent to:', target);
      } else {
        setOtpError('Unable to send OTP. Please try again.');
        console.error('Failed to send OTP:', result.message);
      }
    } catch (error) {
      setOtpError('Unable to send OTP. Please try again.');
      console.error('Error sending OTP:', error);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const getUserTypeIcon = (type: string) => {
    switch (type) {
      case 'org-admin':
        return <Building className='h-4 w-4' />;
      case 'user':
        return <User className='h-4 w-4' />;
      default:
        return null;
    }
  };

  const getUserTypeDescription = (type: string) => {
    switch (type) {
      case 'org-admin':
        return 'Manage organization settings and user permissions';
      case 'user':
        return 'Book trips and manage personal travel preferences';
      default:
        return 'Please select your user type to continue';
    }
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;

    // Allow "+" in the input for user experience
    // but extract digits only for storage
    let digits = raw.replace(/\D/g, '');

    // Normalize Indian numbers
    if (digits.startsWith('91') && digits.length > 10) {
      digits = digits.slice(2);
    }

    if (digits.length > 10) {
      digits = digits.slice(-10);
    }

    setMobile(digits); // store only 10-digit number
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='flex items-center justify-center mb-4'>
            <div className='bg-blue-600 p-3 rounded-full'>
              <Plane className='h-8 w-8 text-white' />
            </div>
          </div>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            TravelPortal
          </h1>
          <p className='text-gray-600'>
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </p>
        </div>

        <Card className='shadow-lg'>
          <CardHeader className='space-y-1'>
            <CardTitle className='text-2xl font-semibold'>
              {isSignUp ? 'Get Started' : 'Welcome back'}
            </CardTitle>
            <CardDescription>
              {isSignUp
                ? 'Choose your role and create your account'
                : 'Choose your role and authentication method to access the portal'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className='space-y-4'>
              {/* User Type Selection */}
              <div className='space-y-2'>
                <Label htmlFor='user-type'>User Type</Label>
                <Select value={userType} onValueChange={setUserType}>
                  <SelectTrigger id='user-type'>
                    <SelectValue placeholder='Select your role' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='org-admin'>
                      <div className='flex items-center gap-2'>
                        <Building className='h-4 w-4' /> Organization
                        Administrator
                      </div>
                    </SelectItem>
                    <SelectItem value='user'>
                      <div className='flex items-center gap-2'>
                        <User className='h-4 w-4' /> User
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {userType && (
                  <div className='flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-md'>
                    {getUserTypeIcon(userType)}
                    <span>{getUserTypeDescription(userType)}</span>
                  </div>
                )}
              </div>

              {/* Login Method Toggle */}
              <div className='space-y-2'>
                <Label>Authentication Method</Label>
                <div className='flex gap-2'>
                  <Button
                    type='button'
                    variant={loginMethod === 'MOBILE' ? 'default' : 'outline'}
                    className='flex-1'
                    onClick={() => {
                      setLoginMethod('MOBILE');
                      setOtpSent(false);
                      setOtp('');
                      setOtpError(null);
                    }}
                  >
                    <Smartphone className='h-4 w-4 mr-2' /> Mobile OTP
                  </Button>
                  <Button
                    type='button'
                    variant={loginMethod === 'EMAIL' ? 'default' : 'outline'}
                    className='flex-1'
                    onClick={() => {
                      setLoginMethod('EMAIL');
                      setOtpSent(false);
                      setOtp('');
                      setOtpError(null);
                    }}
                  >
                    <Mail className='h-4 w-4 mr-2' /> Email OTP
                  </Button>
                </div>
              </div>

              {/* Identifier Input & OTP */}
              <div className='space-y-2'>
                <Label htmlFor='identifier'>
                  {loginMethod === 'MOBILE' ? 'Mobile Number' : 'Email'}
                </Label>
                <div className='flex gap-2'>
                  <Input
                    id='identifier'
                    type={loginMethod === 'MOBILE' ? 'tel' : 'email'}
                    placeholder={
                      loginMethod === 'MOBILE'
                        ? '919876543210 or 9873827497'
                        : 'Enter your email'
                    }
                    value={loginMethod === 'MOBILE' ? mobile : email}
                    onChange={
                      loginMethod === 'MOBILE'
                        ? handleMobileChange
                        : (e) => setEmail(e.target.value)
                    }
                    required
                    disabled={otpSent || isSendingOtp}
                    className='flex-1'
                    maxLength={loginMethod === 'MOBILE' ? 12 : undefined}
                  />
                  {!otpSent && (
                    <Button
                      type='button'
                      variant='outline'
                      onClick={handleSendOtp}
                      disabled={
                        (loginMethod === 'MOBILE' && !mobile) ||
                        (loginMethod === 'EMAIL' && !email) ||
                        isSendingOtp
                      }
                    >
                      {isSendingOtp ? 'Sending...' : 'Send OTP'}
                    </Button>
                  )}
                </div>
                {otpError && (
                  <p className='text-red-500 text-sm mt-1'>{otpError}</p>
                )}
              </div>

              {/* OTP Input */}
              {otpSent && (
                <div className='space-y-2'>
                  <Label htmlFor='otp'>Enter OTP</Label>
                  <Input
                    id='otp'
                    type='text'
                    placeholder='Enter 6-digit OTP'
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                    }
                    maxLength={6}
                    required
                  />
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-green-600'>
                      OTP sent to {loginMethod === 'MOBILE' ? mobile : email}
                    </span>
                    <button
                      type='button'
                      className='text-blue-600 hover:underline'
                      onClick={() => {
                        setOtpSent(false);
                        setOtp('');
                        setOtpError(null);
                      }}
                    >
                      Change {loginMethod === 'MOBILE' ? 'number' : 'email'}
                    </button>
                  </div>
                </div>
              )}

              {/* Password fields if SignUp & Email */}
              {isSignUp && loginMethod === 'EMAIL' && (
                <>
                  <div className='space-y-2'>
                    <Label htmlFor='password'>Password</Label>
                    <Input
                      id='password'
                      type='password'
                      placeholder='Create a password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='confirm-password'>Confirm Password</Label>
                    <Input
                      id='confirm-password'
                      type='password'
                      placeholder='Confirm your password'
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              {/* Login / Sign Up Button */}
              <Button
                type='submit'
                className='w-full bg-blue-600 hover:bg-blue-700'
                disabled={
                  !userType ||
                  isLoading ||
                  !otpSent ||
                  !otp ||
                  (isSignUp &&
                    loginMethod === 'EMAIL' &&
                    (!password ||
                      !confirmPassword ||
                      password !== confirmPassword))
                }
              >
                {isLoading
                  ? isSignUp
                    ? 'Creating Account...'
                    : 'Signing in...'
                  : isSignUp
                  ? 'Create Account'
                  : 'Sign In'}
              </Button>
            </form>

            {/* Toggle Sign Up / Sign In */}
            <div className='mt-6 space-y-4'>
              <div className='text-center'>
                <button
                  type='button'
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setOtpSent(false);
                    setOtp('');
                    setPassword('');
                    setConfirmPassword('');
                    setOtpError(null);
                  }}
                  className='text-sm text-blue-600 hover:underline'
                >
                  {isSignUp
                    ? 'Already have an account? Sign in'
                    : "Don't have an account? Create one"}
                </button>
              </div>

              <div className='text-center'>
                <Link
                  href='/login/admin'
                  className='text-sm text-gray-600 hover:text-blue-600 hover:underline'
                >
                  System Administrator Login →
                </Link>
              </div>

              <div className='text-center text-sm text-gray-600'>
                Need help? Contact{' '}
                <a href='#' className='text-blue-600 hover:underline'>
                  support
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className='mt-8 text-center text-sm text-gray-500'>
          <p>© 2025 TravelPortal. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
