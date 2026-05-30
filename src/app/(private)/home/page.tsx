"use client";

import api from "@/api/api";
import Loader from "@/Components/Loader";
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
  updatedAt: string;
  username: string;
}
interface CommentData {
  user: string;
  text: string;
  userId: string;
}

export default function Home() {
  const [posts, setPosts] = useState<BlogPost[] | []>([]);
  const [loader, setLoader] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastPage, SetIsLastPage] = useState(false);
  const [openComment, setOpenComment] = useState<String | null>(null);
  const [comment, setComment] = useState("");
  const [commentData, setCommentData] = useState<CommentData[] | []>([]);
  const [commentPage, setCommentPage] = useState(0);
  const [isCommentLastPage, SetIsCommentLastPage] = useState(false);
  useEffect(() => {
    const getPosts = async () => {
      setLoader(true);
      try {
        const res = await api.get(`/post/allposts?page=${page}&size=10`);
        if (res?.status === 200) {
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

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await api.get(
          `/post/comments/${openComment}?page=${commentPage}&size=10`
        );
        if (res?.status == 200) {
          setCommentData((prev) => [...prev, ...res.data.postList]);
          SetIsCommentLastPage(res.data.last || false);
        } else {
          throw new Error("Something Went Wrong");
        }
      } catch (error) {}
    };
    getComments();
  }, [openComment, commentPage]);
  const handleNewComment = async () => {
    try {
      const res = await api.post(`/post/comment`, {
        comment,
        postId: openComment,
      });
    } catch (error) {
      console.error(error);
    }
  };

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
                className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col gap-5"
              >
                {/* TOP */}
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 leading-snug">
                      {post.title}
                    </h2>

                    <div className="flex items-center gap-3 mt-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <FaRegUser className="text-blue-600" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {post.author}
                        </p>
                        <p className="text-xs text-gray-500">
                          @{post.username}
                        </p>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                    Blog
                  </span>
                </div>

                {/* CONTENT */}
                <div>
                  <p className="text-gray-600 leading-7">
                    {post.content.slice(0, 200)}...
                  </p>

                  <Link
                    href={`/blog/${post.id}`}
                    className="inline-block mt-3 text-blue-600 font-medium hover:underline"
                  >
                    Read Full Article →
                  </Link>
                </div>

                {/* ACTIONS */}
                <div className="flex items-center justify-between border-t pt-4">
                  <div className="flex items-center gap-5">
                    {/* LIKE BUTTON */}
                    <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition">
                      <VscHeart size={24} />
                      <span className="text-sm font-medium">
                        {post.likes || 0}
                      </span>
                    </button>

                    {/* COMMENT BUTTON */}
                    <button
                      onClick={() =>
                        setOpenComment(openComment === post.id ? null : post.id)
                      }
                      className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
                    >
                      <VscComment size={24} />
                      <span className="text-sm font-medium">
                        {post.comments?.length || 0}
                      </span>
                    </button>
                  </div>

                  {/* SHARE BUTTON */}
                  <button className="text-sm text-gray-500 hover:text-black transition">
                    Share
                  </button>
                </div>

                {/* COMMENT SECTION */}
                {openComment === post.id && (
                  <div className="border-t pt-5 flex flex-col gap-4">
                    {/* EXISTING COMMENTS */}
                    <div className="flex flex-col gap-3 max-h-52 overflow-y-auto">
                      {commentData?.map((comment, index) => (
                        <div key={index} className="bg-gray-50 rounded-2xl p-3">
                          <p className="text-sm font-semibold text-gray-800">
                            {comment.user}
                          </p>

                          <p className="text-sm text-gray-600 mt-1">
                            {comment.text}
                          </p>
                        </div>
                      ))}
                    </div>
                    {!isCommentLastPage && (
                      <div className="flex flex-col gap-3 max-h-52 overflow-y-auto">
                        <button
                          className="text-blue-600"
                          onClick={() => setCommentPage(commentPage + 1)}
                        >
                          More ↓
                        </button>
                      </div>
                    )}

                    {/* ADD COMMENT */}
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                      />

                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium transition"
                        disabled={comment.length == 0}
                        onClick={handleNewComment}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                )}
              </article>
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
