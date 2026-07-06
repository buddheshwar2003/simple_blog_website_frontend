import api from "@/api/api";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
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
  updatedAt: string;
  username: string;
  likeCount: number;
  commentCount: number;
  likedByCurrentUser: boolean;
  imageUrl?: string;
}

type Props = {
  post: BlogPost;
};

const PostComponent = ({ post }: Props) => {
  const [openComment, setOpenComment] = useState<String | null>(null);
  const [comment, setComment] = useState("");
  const [commentData, setCommentData] = useState<CommentData[] | []>([]);
  const [commentPage, setCommentPage] = useState(0);
  const [isCommentLastPage, SetIsCommentLastPage] = useState(true);
  const [loader, setLoader] = useState(false);
  const [commentPostLoader, setCommentPostLoader] = useState(false);

  //Post Status
  const [liked, setLiked] = useState(post.likedByCurrentUser);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [commentCount, setCommentCount] = useState(post.commentCount);

  useEffect(() => {
    const getComments = async () => {
      if (openComment == null) {
        return;
      }
      setLoader(true);
      try {
        const res = await api.get(
          `/post/comments/${openComment}?page=${commentPage}&size=10`,
        );
        if (res?.status == 200 && commentPage != 0) {
          setCommentData((prev) => [...prev, ...res.data.results]);
          SetIsCommentLastPage(res.data.last || false);
        } else if (res?.status == 200 && commentPage == 0) {
          //Double Check the page number
          setCommentData(res.data.results);
        } else {
          throw new Error("Something Went Wrong");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoader(false);
      }
    };
    getComments();
  }, [openComment, commentPage]);

  const handleNewComment = async () => {
    setCommentPostLoader(true);
    try {
      const res = await api.post(`/post/comment`, {
        comment,
        postId: openComment,
      });
      if (res.status == 200) {
        setCommentData((prev) => [...prev, res.data]);
        console.log(res);
        setComment("");
        setCommentCount((pre) => pre + 1);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCommentPostLoader(false);
    }
  };

  const handleLike = async (id: string) => {
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

  return (
    <article
      key={post.id}
      className="flex flex-col gap-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm ring-1 ring-black/[0.02] transition-all duration-300 hover:shadow-xl"
    >
      {/* TOP */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <a
            className="mt-3 flex items-center gap-3"
            href={`/user/${post.userId}`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50">
              <FaRegUser className="text-teal-600" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                {post.author}
              </p>
              <p className="truncate text-xs text-slate-500">
                @{post.username}
              </p>
            </div>
          </a>
        </div>
        <span className="shrink-0 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-700">
          {post.category || "Blog"}
        </span>
      </div>

      {/* CONTENT */}
      <div>
        {" "}
        <h2 className="leading-7 text-slate-600 font-semibold">{post.title}</h2>
        <Link
          href={`/blog/${post.id}`}
          className="mt-3 inline-flex items-center gap-1 font-medium text-teal-600 hover:text-teal-700 hover:underline"
        >
          Read full article <span aria-hidden>→</span>
        </Link>
      </div>
      {/* COVER IMAGE */}
      {post.imageUrl && (
        <Link
          href={`/blog/${post.id}`}
          className="block overflow-hidden rounded-2xl"
        >
          <Image
            src={post.imageUrl}
            width={900}
            height={500}
            alt={post.title}
            className="h-56 w-full object-cover transition duration-300 hover:scale-[1.02] sm:h-72"
          />
        </Link>
      )}

      {/* ACTIONS */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex items-center gap-5">
          {/* LIKE BUTTON */}
          <button
            className="flex items-center gap-2 text-slate-500 transition hover:text-rose-500"
            onClick={() => handleLike(post.id)}
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
            onClick={() =>
              setOpenComment(openComment === post.id ? null : post.id)
            }
            className="flex items-center gap-2 text-slate-500 transition hover:text-teal-600"
          >
            <VscComment size={22} />
            <span className="text-sm font-medium">{commentCount || 0}</span>
          </button>
        </div>

        {/* SHARE BUTTON */}
        <button className="text-sm font-medium text-slate-400 transition hover:text-slate-800">
          Share
        </button>
      </div>

      {/* COMMENT SECTION */}
      {openComment === post.id && (
        <div className="flex flex-col gap-4 border-t border-slate-100 pt-5">
          {/* EXISTING COMMENTS */}
          <div className="flex max-h-52 flex-col gap-3 overflow-y-auto">
            {commentData?.map((comment, index) => (
              <div key={index} className="rounded-2xl bg-slate-50 p-3">
                <p className="text-sm font-semibold text-slate-800">
                  {comment.user}
                </p>

                <p className="mt-1 text-sm text-slate-600">{comment.text}</p>
              </div>
            ))}
          </div>

          {loader && (
            <div className="flex items-center justify-center py-2">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-500 border-t-transparent"></div>
            </div>
          )}

          {!isCommentLastPage && (
            <button
              className="self-center text-sm font-medium text-teal-600 hover:text-teal-700"
              onClick={() => setCommentPage(commentPage + 1)}
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
};

export default PostComponent;
