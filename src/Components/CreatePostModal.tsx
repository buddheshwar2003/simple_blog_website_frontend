"use client";

import api from "@/api/api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: string;
  updatedAt: string;
}

interface PostModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  mode: "create" | "edit";
  post?: BlogPost | null;
  onSuccess: (post: BlogPost, mode: "create" | "edit") => void;
}

const PostModal = ({
  open,
  setOpen,
  mode,
  post,
  onSuccess,
}: PostModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Prefill when editing
  useEffect(() => {
    if (mode === "edit" && post) {
      setFormData({
        title: post.title,
        content: post.content,
        category: post.category,
      });
    }
  }, [mode, post]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    if (loading) return;
    setOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.category) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let res;

      if (mode === "create") {
        res = await api.post("/post/create", formData);
        toast.success("Post created successfully");
      } else {
        res = await api.put(`/post/update/${post?.id}`, formData);
        toast.success("Post updated successfully");
      }

      onSuccess(res.data.post, mode);
      setOpen(false);
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-lg rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {mode === "create" ? "Create Post" : "Edit Post"}
          </h3>
          <button onClick={handleClose} className="text-gray-500">
            ✕
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Post title"
            className="w-full border px-3 py-2 rounded-lg"
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
          >
            <option value="">Select category</option>
            <option value="technology">Technology</option>
            <option value="programming">Programming</option>
            <option value="design">Design</option>
          </select>

          <textarea
            name="content"
            rows={5}
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your post..."
            className="w-full border px-3 py-2 rounded-lg"
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              {loading
                ? mode === "create"
                  ? "Creating..."
                  : "Updating..."
                : mode === "create"
                ? "Create"
                : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostModal;
