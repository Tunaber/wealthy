import React, { createContext, useContext, useEffect, useState } from 'react';
import { getStoredUser, getToken, validateToken, logout as apiLogout } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    validateToken(getToken())
      .then((validUser) => {
        if (validUser) setUser(validUser);
      })
      .finally(() => setReady(true));
  }, []);

  const signIn = (nextUser) => setUser(nextUser);

  const signOut = async () => {
    await apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, ready, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}