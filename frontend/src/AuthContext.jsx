import { createContext, useContext, useMemo, useState } from "react";
import { api } from "./api";

const AuthContext = createContext(null);

function readStored(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("rentease-token"));
  const [user, setUser] = useState(() => readStored("rentease-user"));

  function persist(nextToken, nextUser) {
    setToken(nextToken);
    setUser(nextUser);
    if (nextToken) {
      localStorage.setItem("rentease-token", nextToken);
      localStorage.setItem("rentease-user", JSON.stringify(nextUser));
    } else {
      localStorage.removeItem("rentease-token");
      localStorage.removeItem("rentease-user");
    }
  }

  async function register(values) {
    return api("/api/register", { method: "POST", body: values });
  }

  async function login(values) {
    const data = await api("/api/login", { method: "POST", body: values });
    persist(data.token, data.user);
    return data.user;
  }

  function logout() {
    persist(null, null);
  }

  const value = useMemo(
    () => ({ token, user, register, login, logout }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
