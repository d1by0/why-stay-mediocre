/**
 * Session hook for Supabase and OAuth flow simulations
 * Persists JWT and Refresh tokens securely inside SecureStore (KeyChain)
 */
import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const JWT_KEY = 'ambient_gym_jwt_token';
const REFRESH_KEY = 'ambient_gym_refresh_token';

export interface UserSession {
  userId: string;
  fullName: string;
  email: string;
  provider: 'apple' | 'google' | 'mock';
  jwt: string;
}

export function useSession() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved session on startup
  useEffect(() => {
    async function loadSavedSession() {
      try {
        if (Platform.OS === 'web') {
          // Web fallback
          const savedJwt = localStorage.getItem(JWT_KEY);
          if (savedJwt) {
            setSession({
              userId: 'user-1',
              fullName: 'Alex Carter',
              email: 'alex.carter@example.com',
              provider: 'mock',
              jwt: savedJwt,
            });
          }
        } else {
          // Hardware keychain
          const savedJwt = await SecureStore.getItemAsync(JWT_KEY);
          if (savedJwt) {
            setSession({
              userId: 'user-1',
              fullName: 'Alex Carter',
              email: 'alex.carter@example.com',
              provider: 'mock',
              jwt: savedJwt,
            });
          }
        }
      } catch (err) {
        console.error('Failed to load secure session:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadSavedSession();
  }, []);

  const loginWithOAuth = async (provider: 'apple' | 'google') => {
    setIsLoading(true);
    try {
      // Simulate OAuth redirect or native pop-up credentials verification
      await new Promise(resolve => setTimeout(resolve, 1200));

      const mockJwt = 'jwt_' + Math.random().toString(36).substring(2);
      const mockRefresh = 'refresh_' + Math.random().toString(36).substring(2);

      const userSession: UserSession = {
        userId: 'user-1',
        fullName: provider === 'apple' ? 'Alex Carter' : 'Alex Carter (Google)',
        email: provider === 'apple' ? 'alex.carter@icloud.com' : 'alex.carter@gmail.com',
        provider,
        jwt: mockJwt,
      };

      if (Platform.OS === 'web') {
        localStorage.setItem(JWT_KEY, mockJwt);
        localStorage.setItem(REFRESH_KEY, mockRefresh);
      } else {
        await SecureStore.setItemAsync(JWT_KEY, mockJwt);
        await SecureStore.setItemAsync(REFRESH_KEY, mockRefresh);
      }

      setSession(userSession);
    } catch (err) {
      console.error('OAuth sign in failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(JWT_KEY);
        localStorage.removeItem(REFRESH_KEY);
      } else {
        await SecureStore.deleteItemAsync(JWT_KEY);
        await SecureStore.deleteItemAsync(REFRESH_KEY);
      }
      setSession(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    session,
    isLoading,
    loginWithOAuth,
    logout,
  };
}
