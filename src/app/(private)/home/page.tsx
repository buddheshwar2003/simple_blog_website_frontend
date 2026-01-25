"use client";

import api from "@/api/api";
import Loader from "@/Components/Loader";
import PrivateNavbar from "@/Components/PrivateNavbar";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa";

// // ================== Types ==================
// interface Author {
//   id: number;
//   name: string;
//   role: string;
//   avatar: string;
// }

interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  updatedAt: string;
  username: string;
}

// // ================== Mock Data ==================
// const posts: BlogPost[] = [
//   {
//     id: 1,
//     title: "Building Scalable Apps with Next.js & TypeScript",
//     excerpt:
//       "A practical guide to structuring, typing, and scaling modern Next.js applications.",
//     date: "Jan 10, 2026",
//     readTime: "6 min read",
//     author: {
//       id: 1,
//       name: "John Doe",
//       role: "Senior Frontend Engineer",
//       avatar: "/avatar1.png",
//     },
//   },
//   {
//     id: 2,
//     title: "Advanced React Performance Patterns",
//     excerpt:
//       "Learn proven patterns to optimize rendering, state management, and data fetching.",
//     date: "Jan 14, 2026",
//     readTime: "8 min read",
//     author: {
//       id: 2,
//       name: "Jane Smith",
//       role: "UI Architect",
//       avatar: "/avatar2.png",
//     },
//   },
// ];

// ================== Page ==================
export default function Home() {
  const [posts, setPosts] = useState<BlogPost[] | []>([]);
  const [loader, setLoader] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastPage, SetIsLastPage] = useState(false);
  useEffect(() => {
    const getPosts = async () => {
      setLoader(true);
      try {
        const res = await api.get(`/post/allposts?page=${page}&size=10`);
        if (res.status === 200) {
          setPosts(res.data.postList);
          SetIsLastPage(res.data.last || false);
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
  }, [page]);

  if (loader) return <Loader />;

  return (
    <div className="min-h-[90vh] bg-gray-50">
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">Latest Articles</h1>
          <p className="text-gray-600 mt-2">
            Insights, tutorials, and best practices from our authors
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl flex flex-col justify-between border p-6 hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-6">
                  {post.content.slice(0, 200)}...
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaRegUser />
                    <div>
                      <p className="text-sm font-medium">{post.author}</p>
                      <p className="text-xs text-gray-500">{post.username}</p>
                    </div>
                  </div>
                  <Link
                    href={`/blog/${post.id}`}
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    Read →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div>No Post Found</div>
        )}
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
      </main>
    </div>
  );
}
