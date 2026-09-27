import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getCurrentUser, login, logout } from "../services/auth";
import { tokenStorage } from "../lib/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const sessionVersion = useRef(0);

  useEffect(() => {
    let active = true;
    const version = sessionVersion.current;
    async function restoreSession() {
      try {
        if (!tokenStorage.getAccess() && !tokenStorage.getRefresh()) return;
        const currentUser = await getCurrentUser();
        if (active && version === sessionVersion.current) setUser(currentUser);
      } catch (error) {
        if (active && version === sessionVersion.current && error.status === 401) logout();
      } finally {
        if (active) setIsLoading(false);
      }
    }
    restoreSession();
    return () => { active = false; };
  }, []);

  async function loginUser(email, password) {
    sessionVersion.current += 1;
    await login(email, password);
    try {
      setUser(await getCurrentUser());
    } catch (error) {
      logout();
      setUser(null);
      throw error;
    }
  }

  function logoutUser() {
    sessionVersion.current += 1;
    logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isLoggedIn: Boolean(user),
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// This hook intentionally shares the context module with its provider.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
