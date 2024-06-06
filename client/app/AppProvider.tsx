"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { clearToken, getNewToken, setToken } from "./utils/auth/token";

interface AppContextProps {
  accessToken: string;
  refreshToken: string;
  updateTokens: (refreshToken: string) => void;
  login: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string>("");

  const login = async () => {
    const { access_token, refresh_token } = await getNewToken();
    return { access_token, refresh_token };
  };

  const updateTokens = async (refreshToken: string) => {
    const { access_token, refresh_token } = await getNewToken(refreshToken);
    setAccessToken(access_token);
    setRefreshToken(refresh_token);
    localStorage.setItem("accessToken", access_token);
    localStorage.setItem("refreshToken", refresh_token);
  };

  return (
    <AppContext.Provider
      value={{ accessToken, refreshToken, updateTokens, login }}
    >
      {children}
    </AppContext.Provider>
  );
};

// const checkTokenExpiration = async () => {
//   // not use jwt to decode access token anymore. split the payload and just get exp
//   const accessToken = localStorage.getItem("accessToken");
//   if (accessToken) {
//     const [, payloadBase64] = accessToken.split(".");
//     const payload = JSON.parse(atob(payloadBase64));
//     const expiryTime = payload.exp * 1000;
//     const currentTime = new Date().getTime();

//     if (expiryTime - currentTime < 60 * 1000) {
//       try {
//         const storedRefreshToken = localStorage.getItem("refreshToken");
//         const { access_token, refresh_token } = await getNewToken(
//           storedRefreshToken
//         );
//         localStorage.setItem("accessToken", access_token);
//         localStorage.setItem("refreshToken", refresh_token);
//         setAccessToken(access_token);
//         setRefreshToken(refresh_token);
//       } catch (error) {
//         console.error("Error refreshing access token:", error);
//       }
//     }
//   }
// };

// useEffect(() => {
//   checkTokenExpiration();
//   const interval = setInterval(() => {
//     checkTokenExpiration();
//   }, 60 * 1000);

//   return () => clearInterval(interval);
// }, []);
