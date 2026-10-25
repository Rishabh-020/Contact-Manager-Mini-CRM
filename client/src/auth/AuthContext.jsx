import React, { createContext, useContext, useEffect, useState } from "react";
import * as authApi from "../api/authApi.js";

const AuthContext = createContext(null);

// Keeps the logged-in user available to every page.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(authApi.getSavedUser());
  const [checking, setChecking] = useState(true);

  // When the app opens, check that the saved login is still valid.
  useEffect(() => {
    authApi
      .checkLogin()
      .then(setUser)
      .finally(() => setChecking(false));
  }, []);

  const login = async (email, password) => {
    setUser(await authApi.login(email, password));
  };

  const register = async (name, email, password) => {
    setUser(await authApi.register(name, email, password));
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-slate-500">
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
