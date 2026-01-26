import React, { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { FaHome } from "react-icons/fa";
import { IoMdAddCircle, IoMdLogOut} from "react-icons/io";
import CreatePostModal from "./CreatePostModal";
import Link from "next/link";
import { logoutApi } from "@/api/apilist";
import { clearAuth } from "@/store/authSlice";
import { useAppDispatch } from "@/TypeTs/reduxHooks";

const MobileNav = () => {
  const [openCreatePost, setOpenCreatePost] = useState(false);
    const dispatch = useAppDispatch();
  
    const handleLogout = async () => {
      try {
        await logoutApi();
        dispatch(clearAuth());
      } catch (error) {
        console.error(error);
      }
    };
  
  return (
    <div className="max-md:flex hidden justify-around items-center py-3 fixed bottom-0 w-full bg-white border-t">
      <Link href={"/home"}>
        <FaHome size={25} />
      </Link>
      <button onClick={() => setOpenCreatePost(!openCreatePost)}>
        <IoMdAddCircle size={25} />
      </button>
      <Link href={'/myprofile'}>
        <CgProfile size={25} />
      </Link>
      <button onClick={handleLogout}>
        <IoMdLogOut size={25} />
      </button>
      {openCreatePost && (
        <CreatePostModal
          setOpen={setOpenCreatePost}
          open={openCreatePost}
          onSuccess={() => window.location.reload()}
        />
      )}
    </div>
  );
};

export default MobileNav;
