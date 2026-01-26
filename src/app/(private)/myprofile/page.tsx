"use client";

import api from "@/api/api";
import PostModal, { BlogPost } from "@/Components/CreatePostModal";
import { useAppSelector } from "@/TypeTs/reduxHooks";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa";

export default function ProfilePage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [page, setPage] = useState(0);
  const [isLastPage, SetIsLastPage] = useState(false);
  //User Data
  const useremail = useAppSelector((state) => state.auth?.user?.email);
  const username = useAppSelector((state) => state.auth?.user?.name);

  const fetchPosts = async () => {
    const res = await api.get(`/post/myposts?page=${page}&size=10`);
    setPosts(res.data.postList);
    SetIsLastPage(res.data.last || false);
  };
  useEffect(() => {
    fetchPosts();
  }, [page]);

  const handleSuccess = () => {
    fetchPosts();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Profile Card */}
        <section className="bg-white border rounded-2xl p-4 sm:p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <FaRegUser className="h-10 w-10 sm:h-12 sm:w-12" />

            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold">{username}</h1>
              <p className="text-gray-500 text-sm sm:text-base">{useremail}</p>
            </div>

            <button
              onClick={() => {
                setMode("create");
                setSelectedPost(null);
                setOpen(true);
              }}
              className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-blue-600 text-white rounded-xl"
            >
              Create New
            </button>
          </div>
        </section>

        {/* Posts */}
        <section className="max-w-6xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">My Posts</h2>

          {/* MOBILE VIEW */}
          <div className="space-y-4 sm:hidden">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white border rounded-2xl p-4 space-y-2"
              >
                <h3 className="font-semibold text-base">{post.title}</h3>

                <p className="text-sm text-gray-600 line-clamp-2">
                  {post.content}
                </p>

                <p className="text-xs text-gray-400">
                  Updated: {post.updatedAt.slice(0, 10)}
                </p>

                <div className="flex justify-between pt-2">
                  <Link
                    href={`/blog/${post.id}`}
                    className="text-blue-600 text-sm font-medium"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => {
                      setMode("edit");
                      setSelectedPost(post);
                      setOpen(true);
                    }}
                    className="text-blue-600 text-sm font-medium"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP TABLE */}
          <div className="hidden sm:block">
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
          </div>

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

        <PostModal
          open={open}
          setOpen={setOpen}
          mode={mode}
          post={selectedPost}
          onSuccess={handleSuccess}
        />
      </main>
    </div>
  );
}
