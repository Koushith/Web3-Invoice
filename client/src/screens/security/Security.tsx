import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PasskeyManagement } from '@/components/passkey/PasskeyManagement';

export const SecurityScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FEFFFE]">
      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Back button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/settings')}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[28px] font-semibold text-gray-900">Security</h1>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-sm text-gray-600">Authentication and account security</span>
          </div>
        </div>

        {/* Passkeys Section */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-900">Passkeys</h2>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Sign in securely with your biometrics, device PIN or hardware security key.
          </p>
          <p className="text-sm text-gray-600 mb-6">
            Passkeys are easy to set up and can also be used for two-step authentication.
          </p>
          <PasskeyManagement />
        </div>

        {/* Google Account Section */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-900">Google account</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">Sign in to Stripe using your Google account.</p>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 text-sm border-gray-300 rounded-md"
          >
            <span className="mr-2">G</span>
            Connect Google account
          </Button>
        </div>

        {/* Two-step authentication Section */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-900">Two-step authentication</h2>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Increase your account's security by using multiple authentication methods to verify your identity.
          </p>
          <p className="text-sm text-gray-600 mb-4">
            You can add a hardware security key, authenticator app or phone number. If you want to add Touch ID or
            Windows Hello, you must add another method first.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 text-sm border-gray-300 rounded-md"
          >
            ⊕ Add authentication method
          </Button>
        </div>
      </div>
    </div>
  );
};
