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
        console.log(res)
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
      <div className="max-w-4xl mx-auto py-16">
        <p className="text-gray-500">Loading post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto py-16">
        <p className="text-red-500">{error || "Post not found"}</p>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-6 py-16">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>

        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <span>By {post.author}</span>
          <span>•</span>
          <span className="capitalize">{post.category}</span>
          <span>•</span>
          <span>{post.updatedAt.slice(0, 10)}</span>
        </div>
      </header>

      {/* Content */}
      <section className="prose max-w-none mb-8">
        <p className="whitespace-pre-line">{post.content}</p>
      </section>
    </article>
  );
}
