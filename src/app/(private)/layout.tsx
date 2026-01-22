"use client";
import api from "@/api/api";
import Loader from "@/Components/Loader";
import MobileNav from "@/Components/MobileNav";
import PrivateNavbar from "@/Components/PrivateNavbar";
import { useAppSelector } from "@/TypeTs/reduxHooks";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { isAuthenticated ,isLoading} = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      redirect("/login");
    }
  }, [isAuthenticated]);

   if (isLoading) {
    return <Loader />; // blocking render
  }
  return (
    <div>
      <PrivateNavbar />
      {children} <MobileNav />
    </div>
  );
};

export default layout;
