import Link from "next/link";
import { useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import CreatePostModal from "./CreatePostModal";
import { logoutApi } from "@/api/apilist";
import { useAppDispatch } from "@/TypeTs/reduxHooks";
import { clearAuth } from "@/store/authSlice";
import { VscBell, VscBellDot } from "react-icons/vsc";
import api from "@/api/api";
import { connectNotificationSocket } from "@/lib/websocket";
interface Notification {
  senderId: string;
  notificationId: string;
  senderName: string;
  notificationType: string;
  message: string;
  read: boolean;
  lastUpdate: string;
}
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [openPost, setOpenPost] = useState(false);
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const dispatch = useAppDispatch();
  //For Notification
  const [openNotification, setOpenNotification] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationCount, setNotificationCount] = useState<number>(0);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications/getAll?page=0&size=10");
      setNotifications(res.data?.results);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await api.get("/notifications/count");
        setNotificationCount(res.data?.unreadCount);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCount();
  }, []);
  const handleLogout = async () => {
    try {
      await logoutApi();
      dispatch(clearAuth());
    } catch (error) {
      console.error(error);
    }
  };

  //Accept and Reject Request
  const acceptFriendRequest = async (reqId: string) => {
    try {
      await api.put(`/friend/accept/${reqId}`);
    } catch (error) {
      console.error(error);
    }
  };

  const declineFriendRequest = async (reqId: string) => {
    try {
      await api.delete(`/friend/decline/${reqId}`);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const client = connectNotificationSocket((data) => {
      console.log(data);
      setNotificationCount(data.unreadCount);
    });

    return () => {
      client.deactivate();
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">
          MyBlog
        </Link>

        <div className="max-md:hidden flex items-center justify-center gap-4">
          {/* Create Dropdown */}
          <div className="relative">
            <button
              className="p-2 rounded-full hover:bg-gray-100 font-medium text-whiterounded-lg "
              onClick={() => {
                setOpenNotification(!openNotification);
                fetchNotifications();
                setOpen(false);
              }}
            >
              <VscBell size={20} />
              {notificationCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                  {notificationCount}
                </span>
              )}
            </button>
            {openNotification && (
              <div className="absolute right-0 mt-2 w-96 bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-gray-500">No notifications</div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.notificationId} className="border-b p-3">
                      <p className="text-sm">{n.message}</p>

                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(n.lastUpdate).toLocaleString()}
                      </p>

                      {/* Friend Request Actions */}
                      {n.notificationType === "FRIEND_REQUEST" && (
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => acceptFriendRequest(n.senderId)}
                            className="px-3 py-1 bg-blue-600 text-white rounded"
                          >
                            Accept
                          </button>

                          <button
                            onClick={() => declineFriendRequest(n.senderId)}
                            className="px-3 py-1 border rounded"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <div className="relative">
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              onClick={() => {
                setOpenPost(!openPost);
                setOpen(false);
              }}
            >
              Create
            </button>
            {openPost && (
              <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg">
                <button
                  onClick={() => {
                    setOpenCreatePost(!openCreatePost);
                    setOpenPost(!openPost);
                  }}
                  className="block px-4 py-2 text-sm hover:bg-gray-50"
                >
                  New Post
                </button>
                {/* <Link
                  href="/drafts"
                  className="block px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Drafts
                </Link> */}
              </div>
            )}
          </div>

          {/* Avatar Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setOpen(!open);
                setOpenPost(false);
              }}
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
                  onClick={() => setOpen(false)}
                >
                  Profile
                </Link>
                {/* <Link
                  href="/settings"
                  className="block px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Settings
                </Link> */}
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      {openCreatePost && (
        <CreatePostModal
          setOpen={setOpenCreatePost}
          open={openCreatePost}
          onSuccess={() => window.location.reload()}
        />
      )}
    </header>
  );
}
