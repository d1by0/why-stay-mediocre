/**
 * Session hook with global reactive state synchronization
 * Syncs auth updates instantly across screens (onboarding & index).
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

// Global state list for listeners
type Listener = (session: UserSession | null) => void;
const listeners = new Set<Listener>();
let globalSession: UserSession | null = null;
let globalLoading = true;
let isInitialized = false;

// Initialize session state once on startup
async function initializeSession() {
  if (isInitialized) return;
  try {
    const savedJwt = Platform.OS === 'web'
      ? localStorage.getItem(JWT_KEY)
      : await SecureStore.getItemAsync(JWT_KEY);

    if (savedJwt) {
      globalSession = {
        userId: 'user-1',
        fullName: 'Alex Carter',
        email: 'alex.carter@example.com',
        provider: 'mock',
        jwt: savedJwt,
      };
    }
  } catch (err) {
    console.error('Failed to initialize session:', err);
  } finally {
    globalLoading = false;
    isInitialized = true;
    notifyListeners();
  }
}

function notifyListeners() {
  listeners.forEach((listener) => listener(globalSession));
}

export function useSession() {
  const [session, setSession] = useState<UserSession | null>(globalSession);
  const [isLoading, setIsLoading] = useState(globalLoading);

  useEffect(() => {
    // Add listener
    const listener: Listener = (newSession) => {
      setSession(newSession);
      setIsLoading(false);
    };
    listeners.add(listener);

    // Run initialization
    initializeSession().then(() => {
      setIsLoading(globalLoading);
      setSession(globalSession);
    });

    return () => {
      listeners.delete(listener);
    };
  }, []);

  const loginWithOAuth = async (provider: 'apple' | 'google') => {
    setIsLoading(true);
    try {
      // Replicate native OAuth delays
      await new Promise(resolve => setTimeout(resolve, 1000));

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

      globalSession = userSession;
      notifyListeners();
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
      globalSession = null;
      notifyListeners();
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
