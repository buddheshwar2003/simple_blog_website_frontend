"use client";
import api from "@/api/api";
import MobileNav from "@/Components/MobileNav";
import PrivateNavbar from "@/Components/PrivateNavbar";
import { clearAuth, setCredentials } from "@/store/authSlice";
import { useAppDispatch } from "@/TypeTs/reduxHooks";
import React, { useEffect } from "react";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const initAuth = async () => {
      try {
        // 1️⃣ Restore access token
        const refreshRes = await api.post(
          "/auth/refresh",
        );
        console.log("Usevalue",refreshRes);
        
        dispatch(
          setCredentials({ accessToken: refreshRes.data.token, user: refreshRes.data.user })
        );
      } catch {
        dispatch(clearAuth());
        window.location.href = "/login";
      }
    };

    initAuth();
  }, []);

  return (
    <div>
      <PrivateNavbar />
      {children} <MobileNav />
    </div>
  );
};

export default layout;
