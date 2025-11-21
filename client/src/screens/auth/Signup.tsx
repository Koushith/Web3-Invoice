import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export const SignupScreen = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      toast.success('Welcome to DefInvoice!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Google signup error:', error);
      toast.error(error.message || 'Failed to sign up with Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#635bff]/5 to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Features */}
        <div className="space-y-8">
          <div>
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#635bff] rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-white">D</span>
              </div>
              <span className="text-2xl font-semibold text-gray-900">DefInvoice</span>
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Start managing invoices in seconds
            </h1>
            <p className="text-lg text-gray-600">
              Join thousands of businesses using DefInvoice to streamline their invoicing process.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#635bff]/10 flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-[#635bff]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Lightning fast setup</h3>
                <p className="text-gray-600">Get started in under 60 seconds with Google sign-in</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#635bff]/10 flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-[#635bff]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Bank-level security</h3>
                <p className="text-gray-600">Your data is encrypted and protected with passkey authentication</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#635bff]/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-[#635bff]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Beautiful invoices</h3>
                <p className="text-gray-600">Professional templates that make you look great</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Sign Up Card */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h2>
            <p className="text-gray-600">Sign up with your Google account</p>
          </div>

          <Button
            type="button"
            disabled={loading}
            onClick={handleGoogleSignup}
            className="w-full h-14 bg-[#635bff] hover:bg-[#5045e5] text-white rounded-lg text-base font-semibold shadow-lg shadow-[#635bff]/20 hover:shadow-xl transition-all disabled:opacity-50"
          >
            {loading ? (
              'Creating account...'
            ) : (
              <>
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </Button>

          <p className="text-center text-xs text-gray-500 mt-6">
            By signing up, you agree to our{' '}
            <Link to="/terms" className="text-[#635bff] hover:text-[#5045e5] font-medium">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-[#635bff] hover:text-[#5045e5] font-medium">
              Privacy Policy
            </Link>
          </p>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-[#635bff] hover:text-[#5045e5] font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
