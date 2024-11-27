/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { getCookies, setCookies, tokenCookiesName, userCookiesName } from "../utils/cookies";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [tokenCtx, setTokenCtx] = useState(getCookies(tokenCookiesName) || null);
  const [user, setUser] = useState(null);

  const decodeToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      setUser(decoded.data);
      setCookies(userCookiesName, JSON.stringify(decoded.data));
    } catch (error) {
      console.error("Invalid token:", error);
      setUser(null);
      setTokenCtx(null);
    }
  };

  useEffect(() => {
    if (tokenCtx) {
      decodeToken(tokenCtx);
    } else {
      setUser(null);
    }
  }, [tokenCtx]);

  return (
    <AuthContext.Provider value={{ tokenCtx, user, setTokenCtx, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
