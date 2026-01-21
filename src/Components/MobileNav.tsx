import React, { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { FaHome } from "react-icons/fa";
import { IoMdAddCircle, IoMdSettings } from "react-icons/io";
import CreatePostModal from "./CreatePostModal";

const MobileNav = () => {
  const [openCreatePost, setOpenCreatePost] = useState(false);
  return (
    <div className="max-md:flex hidden justify-around items-center py-3 fixed bottom-0 w-full bg-white border-t">
      <button>
        <FaHome size={25} />
      </button>
      <button onClick={() => setOpenCreatePost(!openCreatePost)}>
        <IoMdAddCircle size={25} />
      </button>
      <button>
        <CgProfile size={25} />
      </button>
      <button>
        <IoMdSettings size={25} />
      </button>
      {openCreatePost && <CreatePostModal setOpen={setOpenCreatePost} />}
    </div>
  );
};

export default MobileNav;
