"use client";

import api from "@/api/api";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  updatedAt: string;
}

export default function BlogPostDetailsPage() {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/post/${id}`);
        setPost(res.data);
        console.log(res);
      } catch (err) {
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <p className="text-gray-500 text-sm">Loading post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <p className="text-red-500 text-sm">{error || "Post not found"}</p>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 pb-24">
      {/* Header */}
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-gray-500">
          <span>By {post.author}</span>
          <span className="hidden sm:inline">•</span>
          <span className="capitalize">{post.category}</span>
          <span className="hidden sm:inline">•</span>
          <span>{post.updatedAt.slice(0, 10)}</span>
        </div>
      </header>

      {/* Content */}
      <section className="prose prose-sm sm:prose-base max-w-none">
        <p className="whitespace-pre-line leading-relaxed">{post.content}</p>
      </section>
    </article>
  );
}
