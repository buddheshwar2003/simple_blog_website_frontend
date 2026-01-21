'use client';

import CreatePostModal from "@/Components/CreatePostModal";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// ================== Types ==================
interface Post {
  id: number;
  title: string;
  status: 'Published' | 'Draft';
  date: string;
}

interface UserProfile {
  name: string;
  username: string;
  email: string;
  bio: string;
  avatar: string;
}

// ================== Mock Data ==================
const user: UserProfile = {
  name: 'John Doe',
  username: '@johndoe',
  email: 'john@example.com',
  bio: 'Senior Frontend Engineer passionate about Next.js, TypeScript, and scalable UI systems.',
  avatar: '/avatar1.png',
};

const myPosts: Post[] = [
  {
    id: 1,
    title: 'Building Scalable Apps with Next.js & TypeScript',
    status: 'Published',
    date: 'Jan 10, 2026',
  },
  {
    id: 2,
    title: 'Advanced React Performance Patterns',
    status: 'Draft',
    date: 'Jan 18, 2026',
  },
];

// ================== Page ==================
export default function ProfilePage() {
  const [open, setOpen] = useState(false)
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Profile Header */}
        <section className="bg-white border rounded-2xl p-6 mb-10">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <Image
              src={user.avatar}
              alt={user.name}
              width={96}
              height={96}
              className="rounded-full border"
            />

            <div className="flex-1">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-gray-500">{user.username}</p>
              <p className="text-gray-600 mt-2 max-w-2xl">{user.bio}</p>
            </div>

            <Link
              href="/settings"
              className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-50"
            >
              Edit Profile
            </Link>
          </div>
        </section>

        {/* My Posts */}
        <section className="bg-white border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">My Posts</h2>
            <button
              onClick={() => setOpen(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Create New
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-3 font-medium">Title</th>
                  <th className="py-3 font-medium">Status</th>
                  <th className="py-3 font-medium">Date</th>
                  <th className="py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myPosts.map((post) => (
                  <tr key={post.id} className="border-b last:border-0">
                    <td className="py-3">{post.title}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          post.status === 'Published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500">{post.date}</td>
                    <td className="py-3 text-right space-x-3">
                      <Link
                        href={`/blog/${post.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </Link>
                      <Link
                        href={`/edit-post/${post.id}`}
                        className="text-gray-600 hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Create Post Modal */}
        {open && (
          <CreatePostModal setOpen={setOpen} />
        )}
      </main>
    </div>
  );
}
