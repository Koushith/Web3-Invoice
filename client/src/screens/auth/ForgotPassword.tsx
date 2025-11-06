import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password reset logic here
    console.log('Reset password for:', email);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#635bff] to-[#5045e5] mb-4 shadow-lg shadow-[#635bff]/20">
              <span className="text-2xl font-bold text-white">D</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Check your email</h1>
            <p className="text-sm text-gray-500 mt-2">We've sent you a password reset link</p>
          </div>

          {/* Success Card */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-8 shadow-xl text-center">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <p className="text-sm text-gray-600 mb-6">
              If an account exists for <strong>{email}</strong>, you will receive an email with instructions to reset your password.
            </p>

            <p className="text-xs text-gray-500 mb-6">
              Didn't receive the email? Check your spam folder or try again.
            </p>

            <div className="space-y-3">
              <Button
                onClick={() => setSubmitted(false)}
                variant="outline"
                className="w-full h-11 border-gray-300 rounded-lg"
              >
                Try another email
              </Button>
              <Link to="/login">
                <Button className="w-full h-11 bg-gradient-to-r from-[#635bff] to-[#5045e5] hover:from-[#5045e5] hover:to-[#3d38d1] text-white rounded-lg font-semibold shadow-lg shadow-[#635bff]/20">
                  Back to Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#635bff] to-[#5045e5] mb-4 shadow-lg shadow-[#635bff]/20">
            <span className="text-2xl font-bold text-white">D</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Reset your password</h1>
          <p className="text-sm text-gray-500 mt-2">Enter your email to receive a reset link</p>
        </div>

        {/* Reset Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700 mb-2 block">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 pl-10 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] transition-all"
                  required
                />
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs text-blue-700">
                We'll send you an email with instructions to reset your password. The link will expire in 24 hours.
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-[#635bff] to-[#5045e5] hover:from-[#5045e5] hover:to-[#3d38d1] text-white rounded-lg font-semibold shadow-lg shadow-[#635bff]/20 hover:shadow-xl transition-all"
            >
              Send Reset Link
            </Button>
          </form>
        </div>

        {/* Back to Login */}
        <div className="text-center mt-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};
