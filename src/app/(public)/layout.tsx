'use client'
import Loader from "@/Components/Loader";
import MobileNav from "@/Components/MobileNav";
import Navbar from "@/Components/Navbar";
import { useAppSelector } from "@/TypeTs/reduxHooks";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { isAuthenticated , isLoading} = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      redirect("/home");
    }
  }, [isAuthenticated]);

   if (isLoading) {
    return <Loader />; // blocking render
  }

  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default layout;
