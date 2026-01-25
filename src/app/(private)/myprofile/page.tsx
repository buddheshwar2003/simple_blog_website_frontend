"use client";

import api from "@/api/api";
import PostModal, { BlogPost } from "@/Components/CreatePostModal";
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
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await api.get(`/post/myposts?page=${page}&size=10`);
      setPosts(res.data.postList);
      SetIsLastPage(res.data.last || false);
    };
    fetchPosts();
  }, [page]);

  const handleSuccess = (post: BlogPost, mode: "create" | "edit") => {
    if (mode === "create") {
      setPosts((prev) => [post, ...prev]);
    } else {
      setPosts((prev) => prev.map((p) => (p.id === post.id ? post : p)));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-6 py-10">
        <section>
          <section className="bg-white border rounded-2xl p-6 mb-10">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <FaRegUser className="h-24 w-24" />

              <div className="flex-1">
                <h1 className="text-2xl font-bold">{"Dummy"}</h1>
                <p className="text-gray-500">{"user.username"}</p>
                <p className="text-gray-600 mt-2 max-w-2xl">{"user.bio"}</p>
              </div>

              <Link
                href="/settings"
                className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-50"
              >
                Edit Profile
              </Link>
            </div>
          </section>
          <div className="max-w-6xl mx-auto py-10">
            <div className="flex justify-between mb-6">
              <h1 className="text-2xl font-bold">My Posts</h1>
              <button
                onClick={() => {
                  setMode("create");
                  setSelectedPost(null);
                  setOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Create New
              </button>
            </div>

            <table className="w-full border">
              <thead>
                <tr className="border-b">
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Updated</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b">
                    <td className="p-3">{post.title}</td>
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
                <div className="flex justify-between py-5">
            <button
              onClick={() => setPage(page-1)}
              disabled={page<=0}
              className="
              px-4 py-2 rounded-lg border
              text-sm font-medium
              transition
              disabled:opacity-40 disabled:cursor-not-allowed
              hover:bg-gray-100
            "
            >
              ← Prev
            </button>

            <button
              onClick={() => setPage(page+1)}
              disabled={isLastPage}
              className="
              px-4 py-2 rounded-lg border
              text-sm font-medium
              transition
              disabled:opacity-40 disabled:cursor-not-allowed
              hover:bg-gray-100
            "
            >
              Next →
            </button>
          </div>
            <PostModal
              open={open}
              setOpen={setOpen}
              mode={mode}
              post={selectedPost}
              onSuccess={handleSuccess}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
