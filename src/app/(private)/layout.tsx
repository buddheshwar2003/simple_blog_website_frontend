"use client";
import api from "@/api/api";
import Loader from "@/Components/Loader";
import MobileNav from "@/Components/MobileNav";
import PrivateNavbar from "@/Components/PrivateNavbar";
import { useAppSelector } from "@/TypeTs/reduxHooks";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { isAuthenticated ,isLoading} = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      redirect("/unauthenticated");
    }
  }, [isAuthenticated]);

   if (isLoading) {
    return <Loader />; // blocking render
  }
  return (
    <div>
      <ToastContainer />
      <PrivateNavbar />
      {children} <MobileNav />
    </div>
  );
};

export default layout;
