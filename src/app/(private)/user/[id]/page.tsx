"use client";
import api from "@/api/api";
import Loader from "@/Components/Loader";
import PostComponent from "@/Components/PostComponent";
import { useAppSelector } from "@/TypeTs/reduxHooks";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa";
interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  userId:string;
  updatedAt: string;
  username: string;
  likeCount: number;
  commentCount: number;
  likedByCurrentUser: boolean;
}
interface ProfileData {
  id: string;
  name: string;
  email: string;
}
const Page = () => {
  const { id } = useParams();
  const [posts, setPosts] = useState<BlogPost[] | []>([]);
  const [loader, setLoader] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const userId = useAppSelector((state) => state.auth.user?.id);
  const router = useRouter();
  const [user, setUser] = useState<ProfileData | null>(null);
  const [postCount, setPostCount] = useState<number>(0);
  const [friendStatus, setFriendStatus] = useState<
    "NONE" | "PENDING_SENT" | "PENDING_RECEIVED" | "FRIENDS"
  >("NONE");
  const [reqId, setReqId] = useState<string>("");
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/user/${id}`);
        setUser(res.data);
        console.log(res);
      } catch (err) {
        console.error("Failed to load post");
      }
    };

    fetchPost();
  }, [id]);
  useEffect(() => {
    if (userId && userId === id) {
      router.replace("/myprofile");
    }
  }, [userId, id, router]);
  useEffect(() => {
    const getPosts = async () => {
      setLoader(true);
      try {
        const res = await api.get(`/post/user/${id}?page=${page}&size=10`);
        if (res?.status === 200) {
          setPosts(res.data.results);
          setIsLastPage(res.data.last || false);
          setPostCount(res.data.totalItems | 0);
        } else {
          throw new Error("Something Went Wrong");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoader(false);
      }
    };
    getPosts();
  }, [page, id]);

  // if (!user) return <Loader />;

  //Friend Request
  const sendFriendRequest = async () => {
    try {
      await api.post(`/friend/request/${id}`);
      setFriendStatus("PENDING_SENT");
    } catch (error) {
      console.error(error);
    }
  };

  const acceptFriendRequest = async () => {
    try {
      await api.put(`/friend/accept/${reqId}`);
      setFriendStatus("FRIENDS");
    } catch (error) {
      console.error(error);
    }
  };

  const declineFriendRequest = async () => {
    try {
      await api.delete(`/friend/decline/${reqId}`);
      setFriendStatus("NONE");
    } catch (error) {
      console.error(error);
    }
  };

  const cancelFriendRequest = async () => {
    try {
      await api.delete(`/friend/cancel/${reqId}`);
      setFriendStatus("NONE");
    } catch (error) {
      console.error(error);
    }
  };

  //Check Friend Status
  useEffect(() => {
    const loadFriendStatus = async () => {
      try {
        const res = await api.get(`/friend/status/${id}`);
        setFriendStatus(res?.data?.status);
        setReqId(res?.data?.requestId);
      } catch (err) {
        console.error(err);
      }
    };

    if (id) {
      loadFriendStatus();
    }
  }, [id]);

  const renderFriendActions = () => {
    switch (friendStatus) {
      case "NONE":
        return (
          <button
            onClick={sendFriendRequest}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition"
          >
            Add Friend
          </button>
        );

      case "PENDING_SENT":
        return (
          <div className="flex gap-2">
            <button
              disabled
              className="px-5 py-2 bg-gray-200 text-gray-600 rounded-xl"
            >
              Request Sent
            </button>

            <button
              onClick={cancelFriendRequest}
              className="px-5 py-2 border rounded-xl hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        );

      case "PENDING_RECEIVED":
        return (
          <div className="flex gap-2">
            <button
              onClick={acceptFriendRequest}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl"
            >
              Accept
            </button>

            <button
              onClick={declineFriendRequest}
              className="px-5 py-2 border rounded-xl hover:bg-gray-100"
            >
              Decline
            </button>
          </div>
        );

      case "FRIENDS":
        return (
          <div className="flex gap-2">
            <button className="px-5 py-2 border rounded-xl">Friends ✓</button>

            <button
              onClick={() => router.push(`/chat/${user?.id}`)}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl"
            >
              Message
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Profile Card */}
        <section className="bg-white rounded-3xl shadow-sm border overflow-hidden mb-8">
          {/* Profile Content */}
          <div className="p-6">
            <div className="flex flex-col items-center md:flex-row md:items-end gap-5">
              {/* Avatar */}
              <div className="h-24 w-24 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center shadow">
                <FaRegUser className="h-12 w-12 text-gray-600" />
              </div>

              {/* User Info */}
              <div className="flex-1 max-md:justify-center max-md:flex max-md:flex-col">
                <h1 className="text-3xl font-bold max-md:text-center">
                  {user?.name}
                </h1>

                <p className="text-gray-500 max-md:text-center">
                  {user?.email}
                </p>

                <div className="flex flex-wrap gap-4 mt-3 max-md:justify-center text-sm text-gray-600">
                  <span>
                    <strong>128</strong> Friends
                  </span>

                  <span>
                    <strong>{postCount}</strong> Posts
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                {renderFriendActions()}
              </div>
            </div>
          </div>
        </section>

        {/* Posts */}
        <section className="max-w-6xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">
            {user?.name} Posts
          </h2>

          {/* MOBILE VIEW */}
          <div className="space-y-4 ">
            {posts?.map((post) => (
              <PostComponent post={post} key={post.id} />
            ))}
          </div>

          {/* DESKTOP TABLE */}
          {/* <div className="hidden sm:block">
            <table className="w-full bg-white border rounded-xl overflow-hidden">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Content</th>
                  <th className="p-3 text-left">Updated</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b">
                    <td className="p-3">{post.title.slice(0, 30)}...</td>
                    <td className="p-3">{post.content.slice(0, 50)}...</td>
                    <td className="p-3">{post.updatedAt.slice(0, 10)}</td>
                    <td className="p-3 text-right space-x-3">
                      <Link
                        href={`/blog/${post.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => {
                          setMode("edit");
                          setSelectedPost(post);
                          setOpen(true);
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div> */}

          {/* Pagination */}
          <div className="flex justify-between py-6">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page <= 0}
              className="px-4 py-2 rounded-xl border text-sm disabled:opacity-40"
            >
              ← Prev
            </button>

            <button
              onClick={() => setPage(page + 1)}
              disabled={isLastPage}
              className="px-4 py-2 rounded-xl border text-sm disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Page;
