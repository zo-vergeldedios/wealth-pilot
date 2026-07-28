import { createContext, useContext, useEffect, useState } from "react";
import {
  setToken,
  clearToken,
  signupRequest,
  loginRequest,
  fetchCurrentUser,
} from "../services/auth.js";

// AuthContext holds the currently logged-in user and the actions that change
// it. Any component can read the session with the useAuth() hook below, so the
// auth logic lives in one place instead of being scattered across pages.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // `loading` is true only while we check for an existing session on first
  // load, so protected routes can wait instead of flashing the login page.
  const [loading, setLoading] = useState(true);

  // On first load, try to restore a session from a token saved in localStorage.
  useEffect(() => {
    fetchCurrentUser()
      .then((u) => setUser(u))
      .finally(() => setLoading(false));
  }, []);

  // Signup: create the account, store the returned token, and mark the user as
  // logged in — all in one step, so the user lands on the dashboard right away.
  async function signup(username) {
    const u = await signupRequest(username);
    setToken(u.user_token);
    setUser({ id: u.id, username: u.username });
  }

  // Login: look the user up by username, store their token, log them in.
  async function login(username) {
    const u = await loginRequest(username);
    setToken(u.user_token);
    setUser({ id: u.id, username: u.username });
  }

  // Logout: drop the token from the browser and clear the in-memory session.
  function logout() {
    clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Convenience hook so components can just call useAuth().
export function useAuth() {
  return useContext(AuthContext);
}
