import api from "@/api/api";
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
  userId:string;
  updatedAt: string;
  username: string;
  likeCount: number;
  commentCount: number;
  likedByCurrentUser: boolean;
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
          `/post/comments/${openComment}?page=${commentPage}&size=10`
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
      className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col gap-5"
    >
      {/* TOP */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 leading-snug">
            {post.title}
          </h2>

          <a className="flex items-center gap-3 mt-3" href={`/user/${post.userId}`}>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <FaRegUser className="text-blue-600" />
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-800">
                {post.author}
              </p>
              <p className="text-xs text-gray-500">@{post.username}</p>
            </div>
          </a>
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
          <button
            className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition"
            onClick={() => handleLike(post.id)}
          >
            {liked ? (
              <VscHeartFilled size={24} className="text-red-500" />
            ) : (
              <VscHeart size={24} />
            )}

            <span className="text-sm font-medium">{likeCount || 0}</span>
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
              {commentCount || 0}
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

                <p className="text-sm text-gray-600 mt-1">{comment.text}</p>
              </div>
            ))}
          </div>
          {loader && (
            <div className="flex justify-center items-center">
              <div className="h-16 w-16 border-blue-500 border-4 animate-spin border-t-transparent rounded-full"></div>
            </div>
          )}
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
              {commentPostLoader ? (
                <div className="h-4 w-4 border-white border-2 animate-spin border-t-transparent rounded-full"></div>
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
