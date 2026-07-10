"use client";

import api from "@/api/api";
import Loader from "@/Components/Loader";
import PostComponent from "@/Components/PostComponent";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { VscComment, VscHeart } from "react-icons/vsc";

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
  imageUrl?: string;
}

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
        if (res?.status === 200) {
          setPosts(res.data?.results);
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

        {posts?.length > 0 ? (
          <div className="grid items-start grid-cols-1 gap-8">
            {posts?.map((post) => (
              <PostComponent post={post} key={post.id} />
            ))}
          </div>
        ) : (
          <div>No Post Found</div>
        )}
        <div className="flex justify-between py-5">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page <= 0}
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
            onClick={() => setPage(page + 1)}
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
