import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Sparkles, Zap, Shield, Fingerprint } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { startAuthentication, type PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/browser';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAppDispatch } from '@/store/store';
import { setToken } from '@/store/slices/auth.slice';
import { apiService } from '@/services/api.service';

export const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { login, loginWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      toast.success('Welcome back!');
      navigate('/');
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

      // If no email provided, try discoverable credentials (resident keys)
      if (!email) {
        try {
          // Get authentication options from backend (without email)
          const optionsResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/passkeys/auth-options`, {
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
          const verifyResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/passkeys/auth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              response: authResponse,
              // No email for usernameless authentication
            }),
          });

          if (!verifyResponse.ok) {
            throw new Error('Passkey not found. Please enter your email or register a passkey first.');
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

          toast.success('Welcome back!');
          navigate('/');
          return;
        } catch (error: any) {
          // If discoverable credential fails, show actual error
          console.error('Usernameless passkey login error:', error);
          if (error.name === 'NotAllowedError') {
            toast.error('Passkey authentication was cancelled');
          } else {
            toast.error(error.message || 'Passkey authentication failed');
          }
          return;
        }
      }

      // Email provided - use traditional flow
      // Get authentication options from backend
      const optionsResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/passkeys/auth-options`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!optionsResponse.ok) {
        const error = await optionsResponse.json();
        throw new Error(error.message || 'Failed to get authentication options');
      }

      const { data: options } = await optionsResponse.json() as { data: PublicKeyCredentialRequestOptionsJSON };

      // Start WebAuthn authentication
      const authResponse = await startAuthentication({ optionsJSON: options });

      // Verify authentication with backend
      const verifyResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/passkeys/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          response: authResponse,
          email,
        }),
      });

      if (!verifyResponse.ok) {
        throw new Error('Failed to verify passkey authentication');
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

      toast.success('Welcome back!');
      navigate('/');
    } catch (error: any) {
      console.error('Passkey login error:', error);
      if (error.name === 'NotAllowedError') {
        toast.error('Passkey authentication was cancelled');
      } else {
        toast.error(error.message || 'Failed to sign in with passkey');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0A2540] p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-[#635BFF]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#00D924]/5 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 text-white hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-[#0A2540] text-xl font-bold">D</span>
            </div>
            <span className="text-2xl font-semibold">DefInvoice</span>
          </Link>
        </div>

        <div className="relative z-10">
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            Modern invoicing,<br />simplified.
          </h1>
          <p className="text-white/70 text-lg mb-12 max-w-md leading-relaxed">
            Create, send, and track invoices in minutes. Get paid faster with flexible payment options.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#635BFF] flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1 text-base">Lightning Fast</h3>
                <p className="text-white/60 text-sm leading-relaxed">Create invoices in seconds, not hours</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#00D924] flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1 text-base">Secure & Transparent</h3>
                <p className="text-white/60 text-sm leading-relaxed">Bank-grade security for your data</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FFC043] flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1 text-base">Smart Automation</h3>
                <p className="text-white/60 text-sm leading-relaxed">Automated reminders and tracking</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-white/50 text-sm">
          © 2024 DefInvoice. All rights reserved.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
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
            <h2 className="text-3xl font-bold text-[#0A2540] mb-2">Welcome back</h2>
            <p className="text-[#425466]">Sign in to your account to continue</p>
          </div>

          {/* Google Sign In */}
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={handleGoogleLogin}
            className="w-full h-12 border-2 border-[#E3E8EF] hover:bg-[#F6F9FC] rounded-lg text-base font-medium mb-3"
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

          {/* Passkey Sign In - Always visible */}
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={handlePasskeyLogin}
            className="w-full h-12 border-2 border-[#E3E8EF] hover:bg-[#F6F9FC] rounded-lg text-base font-medium mb-6"
          >
            <Fingerprint className="w-5 h-5 mr-3" />
            Sign in with Passkey
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E3E8EF]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-[#425466] font-medium">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#0A2540] mb-2">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 border-2 border-[#E3E8EF] rounded-lg focus:ring-2 focus:ring-[#635BFF] focus:border-[#635BFF] text-base"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-[#0A2540]">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm text-[#635BFF] hover:text-[#0A2540] font-medium">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pr-12 border-2 border-[#E3E8EF] rounded-lg focus:ring-2 focus:ring-[#635BFF] focus:border-[#635BFF] text-base"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#425466] hover:text-[#0A2540]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#635BFF] hover:bg-[#0A2540] text-white rounded-lg text-base font-semibold transition-all"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <p className="text-center text-sm text-[#425466] mt-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#635BFF] hover:text-[#0A2540] font-semibold">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
