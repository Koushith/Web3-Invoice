/**
 * useAuth Hook
 * Redux-based authentication hook that replaces the old Context API implementation
 */

import { useAppDispatch, useAppSelector } from '@/store/store';
import {
  login as loginAction,
  signup as signupAction,
  logout as logoutAction,
  resetPassword as resetPasswordAction,
  loginWithGoogle as loginWithGoogleAction,
  selectUser,
  selectIsLoading,
  selectIsAuthenticated,
  selectAuthError,
} from '@/store/slices/auth.slice';
import type { User as FirebaseUser } from 'firebase/auth';
import type { User, LoginCredentials, SignupCredentials } from '@/types/models';

interface AuthHookReturn {
  // User data (MongoDB user from backend)
  user: User | null;
  // Firebase user (for compatibility)
  firebaseUser: FirebaseUser | null;
  // Loading state
  loading: boolean;
  // Authentication status
  isAuthenticated: boolean;
  // Error state
  error: string | null;
  // Auth methods
  signup: (email: string, password: string, displayName?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

/**
 * Custom hook for authentication
 * Provides backward-compatible API with the old AuthContext
 * NOTE: Auth initialization happens in App.tsx, not here
 */
export function useAuth(): AuthHookReturn {
  const dispatch = useAppDispatch();

  // Redux selectors
  const user = useAppSelector(selectUser);
  const loading = useAppSelector(selectIsLoading);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const error = useAppSelector(selectAuthError);

  // Auth methods
  const signup = async (email: string, password: string, displayName?: string) => {
    const credentials: SignupCredentials = {
      email,
      password,
      displayName: displayName || '',
      confirmPassword: password, // Not used in the thunk, but required by type
    };

    const result = await dispatch(signupAction(credentials));
    if (signupAction.rejected.match(result)) {
      throw new Error(result.payload as string);
    }
  };

  const login = async (email: string, password: string) => {
    const credentials: LoginCredentials = {
      email,
      password,
    };

    const result = await dispatch(loginAction(credentials));
    if (loginAction.rejected.match(result)) {
      throw new Error(result.payload as string);
    }
  };

  const logout = async () => {
    const result = await dispatch(logoutAction());
    if (logoutAction.rejected.match(result)) {
      throw new Error(result.payload as string);
    }
  };

  const resetPassword = async (email: string) => {
    const result = await dispatch(resetPasswordAction(email));
    if (resetPasswordAction.rejected.match(result)) {
      throw new Error(result.payload as string);
    }
  };

  const loginWithGoogle = async () => {
    const result = await dispatch(loginWithGoogleAction());
    if (loginWithGoogleAction.rejected.match(result)) {
      throw new Error(result.payload as string);
    }
  };

  return {
    user,
    firebaseUser: null, // We no longer expose Firebase user directly
    loading,
    isAuthenticated,
    error,
    signup,
    login,
    logout,
    resetPassword,
    loginWithGoogle,
  };
}
