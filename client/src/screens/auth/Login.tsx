import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Shield, Fingerprint } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { startAuthentication, type PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/browser';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAppDispatch } from '@/store/store';
import { setToken, setUser } from '@/store/slices/auth.slice';
import { apiService } from '@/services/api.service';
import { getApiBaseUrl } from '@/lib/config';

export const LoginScreen = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loginWithGoogle } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      toast.success('Welcome back!');
      navigate('/reports');
    } catch (error: any) {
      console.error('Google login error:', error);
      toast.error(error.message || 'Failed to sign in with Google.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasskeyLogin = async () => {
    try {
      setLoading(true);

      // Use discoverable credentials (resident keys) - no email needed
      // Get authentication options from backend (without email)
      const optionsResponse = await fetch(`${getApiBaseUrl()}/passkeys/auth-options`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}), // No email = usernameless
      });

      if (!optionsResponse.ok) {
        const error = await optionsResponse.json();
        throw new Error(error.message || 'Failed to get authentication options');
      }

      const { data: options } = await optionsResponse.json() as { data: PublicKeyCredentialRequestOptionsJSON };

      // Start WebAuthn authentication
      const authResponse = await startAuthentication({ optionsJSON: options });

      // Verify authentication with backend (without email)
      const verifyResponse = await fetch(`${getApiBaseUrl()}/passkeys/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          response: authResponse,
          // No email for usernameless authentication
        }),
      });

      if (!verifyResponse.ok) {
        throw new Error('Passkey not found. Please sign in with Google first to register a passkey.');
      }

      const { data } = await verifyResponse.json() as { data: { customToken: string; user: any } };

      // Sign in with Firebase using custom token
      const userCredential = await signInWithCustomToken(auth, data.customToken);
      const firebaseUser = userCredential.user;

      // Get ID token and sync with backend
      const token = await firebaseUser.getIdToken();
      dispatch(setToken(token));

      // Sync user with backend
      const syncResult = await dispatch(
        apiService.endpoints.syncUser.initiate({})
      );

      if (!('data' in syncResult) || !syncResult.data) {
        throw new Error('Failed to sync user with backend');
      }

      // Update Redux state with the user data
      dispatch(setUser(syncResult.data));

      toast.success('Welcome back!');
      navigate('/reports');
    } catch (error: any) {
      console.error('Passkey login error:', error);
      if (error.name === 'NotAllowedError') {
        toast.error('Passkey authentication was cancelled');
      } else {
        toast.error(error.message || 'Passkey authentication failed. Please sign in with Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#635BFF] p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full"></div>
        <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-white/5 rounded-full"></div>

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-[#635BFF] text-xl font-bold">D</span>
            </div>
            <span className="text-xl font-semibold text-white">DefInvoice</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
              Get paid faster with<br />beautiful invoices
            </h1>
            <p className="text-lg text-white/80 leading-relaxed max-w-md">
              Professional invoicing made simple. Create, send, and track in minutes.
            </p>
          </div>

          <div className="grid gap-6 max-w-md">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Create invoices in seconds</h3>
                <p className="text-sm text-white/70">Beautiful templates that make you look professional</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Secure and compliant</h3>
                <p className="text-sm text-white/70">Bank-level security with passkey authentication</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Smart reminders</h3>
                <p className="text-sm text-white/70">Never chase payments manually again</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-white/60 text-sm">
          <span>© 2024 DefInvoice</span>
          <span>Trusted by 10,000+ businesses</span>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-10 h-10 bg-[#635BFF] rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">D</span>
              </div>
              <span className="text-2xl font-semibold text-[#0A2540]">DefInvoice</span>
            </Link>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-[#0A2540] mb-2">Welcome to DefInvoice</h2>
            <p className="text-[#425466]">Sign in with your Google account to continue</p>
          </div>

          <div className="space-y-4">
            {/* Google Sign In */}
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={handleGoogleLogin}
              className="w-full h-14 border-2 border-[#E3E8EF] hover:bg-[#F6F9FC] rounded-lg text-base font-medium"
            >
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
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E3E8EF]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-[#425466] font-medium">Or</span>
              </div>
            </div>

            {/* Passkey Sign In */}
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={handlePasskeyLogin}
              className="w-full h-14 border-2 border-[#E3E8EF] hover:bg-[#F6F9FC] rounded-lg text-base font-medium"
            >
              <Fingerprint className="w-5 h-5 mr-3" />
              Sign in with Passkey
            </Button>

            <p className="text-center text-xs text-[#425466] pt-4">
              By signing in, you agree to our{' '}
              <Link to="/terms" className="text-[#635BFF] hover:text-[#0A2540] font-medium">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-[#635BFF] hover:text-[#0A2540] font-medium">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
