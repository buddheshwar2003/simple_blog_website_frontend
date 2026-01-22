"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/TypeTs/reduxHooks";
import { setCredentials, clearAuth } from "@/store/authSlice";
import api from "@/api/api";
import Loader from "@/Components/Loader";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const restoreAuth = async () => {
      try {
        const res = await api.post("/auth/refresh");
        dispatch(
          setCredentials({ user: res.data.user, accessToken: res.data.token })
        );
      } catch {
        dispatch(clearAuth());
      }
    };

    restoreAuth();
  }, []);

  if (isLoading) {
    return <Loader />; // blocking render
  }

  return <>{children}</>;
}
