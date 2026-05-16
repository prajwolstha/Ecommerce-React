import React, { createContext, useContext, useState } from "react";

// Create Context
const AuthContext = createContext();

// Custom hook
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // LOGIN (fake demo login)
  const login = (email, password) => {
    // In real app → call backend API
    if (email && password) {
      const fakeUser = {
        id: Date.now(),
        name: "Demo User",
        email,
      };

      setUser(fakeUser);
      return true;
    }

    return false;
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};