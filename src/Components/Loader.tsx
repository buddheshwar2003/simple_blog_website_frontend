import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-[99999]">
      <div className="border-8 border-b-transparent animate-spin rounded-full h-24 w-24 border-blue-500"></div>
    </div>
  );
};

export default Loader;
