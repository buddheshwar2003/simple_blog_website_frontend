import Link from "next/link";
import { useState } from "react";
import { FaRegUser } from "react-icons/fa";
import CreatePostModal from "./CreatePostModal";
import { logoutApi } from "@/api/apilist";
import { useAppDispatch } from "@/TypeTs/reduxHooks";
import { clearAuth } from "@/store/authSlice";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [openPost, setOpenPost] = useState(false);
  const [openCreatePost , setOpenCreatePost]=useState(false);
  const dispatch = useAppDispatch();

  const handleLogout =async()=>{
    try {
      await logoutApi();
      dispatch(clearAuth());
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          MyBlog
        </Link>

        <div className="max-md:hidden flex items-center justify-center gap-4">
          {/* Create Dropdown */}
          <div className="relative">
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              onClick={() => setOpenPost(!openPost)}
            >
              Create
            </button>
            {openPost && (
              <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg">
                <button
                  onClick={()=>setOpenCreatePost(!openCreatePost)}
                  className="block px-4 py-2 text-sm hover:bg-gray-50"
                >
                  New Post
                </button>
                <Link
                  href="/drafts"
                  className="block px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Drafts
                </Link>
              </div>
            )}
          </div>

          {/* Avatar Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className={`border-2 h-10 w-10 flex ${
                open ? "bg-gray-200" : ""
              } justify-center items-center rounded-full`}
            >
              <FaRegUser />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                <Link
                  href="/myprofile"
                  className="block px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Profile
                </Link>
                <Link
                  href="/my-posts"
                  className="block px-4 py-2 text-sm hover:bg-gray-50"
                >
                  My Posts
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Settings
                </Link>
                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      {openCreatePost && <CreatePostModal setOpen={setOpenCreatePost} />}
    </header>
  );
}
