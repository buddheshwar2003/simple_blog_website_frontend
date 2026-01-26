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
  mode?: "create" | "edit";
  post?: BlogPost | null;
  onSuccess: () => void;
}

const PostModal = ({
  open,
  setOpen,
  mode = "create",
  post = null,
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
    if (mode === "create") {
      setFormData({
        title: "",
        content: "",
        category: "",
      });
    }

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
        if (res.status === 201) {
          toast.success("Post created successfully");
        } else {
          throw new Error("Something went Wrong");
        }
      } else {
        res = await api.put(`/post/update/${post?.id}`, formData);
        if (res.status === 201) {
          toast.success("Post updated successfully");
        } else {
          throw new Error("Something went Wrong");
        }
      }

      onSuccess();
      setOpen(false);
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
      <div
        className="
        bg-white w-full sm:max-w-lg
        h-[95vh] sm:h-auto
        rounded-t-2xl sm:rounded-2xl
        flex flex-col
      "
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-base sm:text-lg font-semibold">
            {mode === "create" ? "Create Post" : "Edit Post"}
          </h3>
          <button onClick={handleClose} className="text-gray-500 text-xl px-2">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Post title"
              className="w-full border px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select category</option>
              <option value="technology">Technology</option>
              <option value="programming">Programming</option>
              <option value="design">Design</option>
            </select>

            <textarea
              name="content"
              rows={6}
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your post..."
              className="w-full border px-4 py-3 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </form>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t px-4 py-3 flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 py-3 border rounded-xl text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm disabled:opacity-60"
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
      </div>
    </div>
  );
};

export default PostModal;
