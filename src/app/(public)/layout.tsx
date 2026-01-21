import MobileNav from "@/Components/MobileNav";
import Navbar from "@/Components/Navbar";
import React from "react";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default layout;
