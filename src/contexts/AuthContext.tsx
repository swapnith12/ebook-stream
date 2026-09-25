import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import {
  login as apiLogin,
  logout as apiLogout,
  getMe,
  googleLoginUrl,
  AuthUser,
} from "@/lib/api";

export type User = AuthUser;

interface AuthContextType {
  user: User | null;
  /** Dummy email/password login. Throws ApiError with a message on failure. */
  login: (email: string, password: string) => Promise<User>;
  /** Redirects the browser to the Google OAuth flow. */
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
  /** Re-read the session from the server. */
  refresh: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  /** True while the initial /auth/me check is in flight. */
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const { user } = await getMe();
      setUser(user);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refresh().finally(() => setIsLoading(false));
  }, [refresh]);

  const login = async (email: string, password: string): Promise<User> => {
    const { user } = await apiLogin(email, password);
    setUser(user);
    return user;
  };

  const loginWithGoogle = () => {
    window.location.assign(googleLoginUrl);
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error("Logout error:", error);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithGoogle,
        logout,
        refresh,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin ?? false,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
