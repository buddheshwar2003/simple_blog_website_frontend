'use client';

import PrivateNavbar from "@/Components/PrivateNavbar";
import Image from "next/image";
import Link from "next/link";
import { FaRegUser } from "react-icons/fa";

// ================== Types ==================
interface Author {
  id: number;
  name: string;
  role: string;
  avatar: string;
}

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: Author;
  date: string;
  readTime: string;
}

// ================== Mock Data ==================
const posts: BlogPost[] = [
  {
    id: 1,
    title: "Building Scalable Apps with Next.js & TypeScript",
    excerpt:
      "A practical guide to structuring, typing, and scaling modern Next.js applications.",
    date: "Jan 10, 2026",
    readTime: "6 min read",
    author: {
      id: 1,
      name: "John Doe",
      role: "Senior Frontend Engineer",
      avatar: "/avatar1.png",
    },
  },
  {
    id: 2,
    title: "Advanced React Performance Patterns",
    excerpt:
      "Learn proven patterns to optimize rendering, state management, and data fetching.",
    date: "Jan 14, 2026",
    readTime: "8 min read",
    author: {
      id: 2,
      name: "Jane Smith",
      role: "UI Architect",
      avatar: "/avatar2.png",
    },
  },
];



// ================== Page ==================
export default function Home() {
  return (
    <div className="min-h-[90vh] bg-gray-50">

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">Latest Articles</h1>
          <p className="text-gray-600 mt-2">
            Insights, tutorials, and best practices from our authors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl border p-6 hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-6">{post.excerpt}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaRegUser />
                  <div>
                    <p className="text-sm font-medium">{post.author.name}</p>
                    <p className="text-xs text-gray-500">{post.author.role}</p>
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
      </main>
    </div>
  );
}
