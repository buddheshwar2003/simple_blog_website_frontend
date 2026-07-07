"use client";

import api from "@/api/api";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { FaRegUser } from "react-icons/fa";
import { VscHeart, VscComment, VscHeartFilled } from "react-icons/vsc";

interface CommentData {
  user: string;
  text: string;
  userId: string;
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  userId: string;
  username: string;
  updatedAt: string;
  image: string;
  likeCount: number;
  commentCount: number;
  likedByCurrentUser: boolean;
}

export default function BlogPostDetailsPage() {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Comments
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [commentData, setCommentData] = useState<CommentData[]>([]);
  const [commentPage, setCommentPage] = useState(0);
  const [isCommentLastPage, setIsCommentLastPage] = useState(true);
  const [commentLoader, setCommentLoader] = useState(false);
  const [commentPostLoader, setCommentPostLoader] = useState(false);

  // Post status
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/post/${id}`);
        setPost(res.data);
        setLiked(res.data.likedByCurrentUser);
        setLikeCount(res.data.likeCount);
        setCommentCount(res.data.commentCount);
        console.log(res);
      } catch (err) {
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // Fetch comments (paginated)
  useEffect(() => {
    const getComments = async () => {
      if (!showComments || !id) return;
      setCommentLoader(true);
      try {
        const res = await api.get(
          `/post/comments/${id}?page=${commentPage}&size=10`,
        );
        if (res?.status == 200 && commentPage != 0) {
          setCommentData((prev) => [...prev, ...res.data.results]);
          setIsCommentLastPage(res.data.last || false);
        } else if (res?.status == 200 && commentPage == 0) {
          setCommentData(res.data.results);
          setIsCommentLastPage(res.data.last || false);
        } else {
          throw new Error("Something Went Wrong");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setCommentLoader(false);
      }
    };
    getComments();
  }, [showComments, commentPage, id]);

  const handleNewComment = async () => {
    if (!id) return;
    setCommentPostLoader(true);
    try {
      const res = await api.post(`/post/comment`, {
        comment,
        postId: id,
      });
      if (res.status == 200) {
        setCommentData((prev) => [...prev, res.data]);
        setComment("");
        setCommentCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCommentPostLoader(false);
    }
  };

  const handleLike = async () => {
    if (!id) return;
    try {
      await api.post(`/post/likes/${id}`);

      if (liked) {
        setLiked(false);
        setLikeCount((prev) => prev - 1);
      } else {
        setLiked(true);
        setLikeCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: post?.title, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch (error) {
      console.error(error);
    }
  };

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

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-gray-500 mb-3">
          <span>By {post.author}</span>
          <span className="hidden sm:inline">•</span>
          <span className="capitalize">{post.category}</span>
          <span className="hidden sm:inline">•</span>
          <span>{post.updatedAt.slice(0, 10)}</span>
        </div>

        <a
          className="flex items-center gap-3"
          href={`/user/${post.userId}`}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50">
            <FaRegUser className="text-teal-600" />
          </div>
          <p className="truncate text-xs text-slate-500">
            @{post.username}
          </p>
        </a>
      </header>

      {/* Image */}
      {post.image && (
        <div className="relative w-full aspect-video mb-8 rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Content */}
      <section className="prose prose-sm sm:prose-base max-w-none">
        <p className="whitespace-pre-line leading-relaxed">{post.content}</p>
      </section>

      {/* ACTIONS */}
      <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex items-center gap-5">
          {/* LIKE BUTTON */}
          <button
            className="flex items-center gap-2 text-slate-500 transition hover:text-rose-500"
            onClick={handleLike}
          >
            {liked ? (
              <VscHeartFilled size={22} className="text-rose-500" />
            ) : (
              <VscHeart size={22} />
            )}
            <span className="text-sm font-medium">{likeCount || 0}</span>
          </button>

          {/* COMMENT BUTTON */}
          <button
            onClick={() => setShowComments((prev) => !prev)}
            className="flex items-center gap-2 text-slate-500 transition hover:text-teal-600"
          >
            <VscComment size={22} />
            <span className="text-sm font-medium">{commentCount || 0}</span>
          </button>
        </div>

        {/* SHARE BUTTON */}
        <button
          onClick={handleShare}
          className="text-sm font-medium text-slate-400 transition hover:text-slate-800"
        >
          Share
        </button>
      </div>

      {/* COMMENT SECTION */}
      {showComments && (
        <div className="flex flex-col gap-4 border-t border-slate-100 pt-5 mt-2">
          {/* EXISTING COMMENTS */}
          <div className="flex max-h-72 flex-col gap-3 overflow-y-auto">
            {commentData?.map((c, index) => (
              <div key={index} className="rounded-2xl bg-slate-50 p-3">
                <p className="text-sm font-semibold text-slate-800">
                  {c.user}
                </p>
                <p className="mt-1 text-sm text-slate-600">{c.text}</p>
              </div>
            ))}
          </div>

          {commentLoader && (
            <div className="flex items-center justify-center py-2">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-500 border-t-transparent"></div>
            </div>
          )}

          {!isCommentLastPage && (
            <button
              className="self-center text-sm font-medium text-teal-600 hover:text-teal-700"
              onClick={() => setCommentPage((prev) => prev + 1)}
            >
              Show more ↓
            </button>
          )}

          {/* ADD COMMENT */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
            />

            <button
              className="flex items-center justify-center rounded-xl bg-teal-600 px-5 py-3 font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={comment.length == 0}
              onClick={handleNewComment}
            >
              {commentPostLoader ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                "Post"
              )}
            </button>
          </div>
        </div>
      )}
    </article>
  );
}