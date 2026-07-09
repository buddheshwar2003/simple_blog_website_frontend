"use client";

import api from "@/api/api";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: string;
  updatedAt: string;
  imageUrl?: string;
}

interface PostModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  mode?: "create" | "edit";
  post?: BlogPost | null;
  onSuccess: () => void;
}

const CONTENT_LIMIT = 5000;
const RING_RADIUS = 16;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export default function PostModal({
  open,
  setOpen,
  mode = "create",
  post = null,
  onSuccess,
}: PostModalProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === "create") {
      setFormData({
        title: "",
        content: "",
        category: "",
      });
      setImage(null);
      setPreview("");
    }

    if (mode === "edit" && post) {
      setFormData({
        title: post.title,
        content: post.content,
        category: post.category,
      });

      setPreview(post.imageUrl || "");
      setImage(null);
    }
  }, [mode, post]);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    
     if (file.size > 1024 * 1024) {
        alert("Maximum image size is 1 MB");
        return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setPreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.category) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append("content", formData.content);
      data.append("category", formData.category);

      if (image) {
        data.append("image", image);
      }

      if (mode === "create") {
        await api.post("/post/create", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        toast.success("Post created");
      } else {
        await api.put(`/post/update/${post?.id}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        toast.success("Post updated");
      }

      onSuccess();
      setOpen(false);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const contentLength = formData.content.length;
  const contentRatio = Math.min(contentLength / CONTENT_LIMIT, 1);
  const nearLimit = contentRatio > 0.9;
  const ringOffset = RING_CIRCUMFERENCE * (1 - contentRatio);

  return (
    <div className="post-modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <style>{`
        @keyframes postModalFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes postModalScaleIn {
          from { opacity: 0; transform: translateY(14px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .post-modal-backdrop { animation: postModalFadeIn 0.18s ease-out; }
        .post-modal-panel { animation: postModalScaleIn 0.28s cubic-bezier(0.16, 1, 0.3, 1); }
        .post-modal-scroll::-webkit-scrollbar { width: 8px; }
        .post-modal-scroll::-webkit-scrollbar-thumb { background: #e2e2e2; border-radius: 9999px; }
        .post-modal-scroll::-webkit-scrollbar-track { background: transparent; }
      `}</style>

      <div className="post-modal-panel post-modal-scroll flex max-h-[92vh] w-full max-w-2xl flex-col overflow-y-auto rounded-[28px] bg-white shadow-[0_30px_80px_-20px_rgba(15,23,42,0.35)] ring-1 ring-black/5">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-7 py-5 backdrop-blur">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-600">
              {mode === "create" ? "New entry" : "Editing"}
            </p>
            <h2 className="mt-0.5 font-serif text-2xl font-semibold text-slate-900">
              {mode === "create" ? "Create a post" : "Edit post"}
            </h2>
          </div>

          <button
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M1 1L15 15M15 1L1 15"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-6 px-7 py-6">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Title
            </label>

            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Write an attractive title..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Category
            </label>

            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. Design, Engineering, Life"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
            />
          </div>

          <div>
            <div className="mb-2 flex items-end justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Content
              </label>

              <div className="flex items-center gap-2">
                
                <span
                  className={`font-mono text-xs ${
                    nearLimit ? "text-rose-500" : "text-slate-400"
                  }`}
                >
                  {contentLength}/{CONTENT_LIMIT}
                </span>
              </div>
            </div>

            <textarea
              rows={3}
              maxLength={CONTENT_LIMIT}
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Share your thoughts..."
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/60 p-4 leading-relaxed text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
            />
          </div>

          <div>
            <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Cover image
            </label>

            <input
              ref={fileRef}
              hidden
              type="file"
              accept="image/*"
              onChange={handleImage}
            />

            {!preview ? (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                className={`flex h-52 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed transition ${
                  dragActive
                    ? "border-teal-500 bg-teal-50/60"
                    : "border-slate-200 bg-slate-50/40 hover:border-teal-400 hover:bg-teal-50/30"
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-500/10 text-teal-600">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 16V4M12 4L7 9M12 4L17 9"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 16V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V16"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  Drop an image, or click to browse
                </p>
                <span className="text-xs text-slate-400">PNG, JPG, WEBP up to 10MB</span>
              </button>
            ) : (
              <div className="group relative mt-1 overflow-hidden rounded-2xl">
                <Image
                  src={preview}
                  width={900}
                  height={600}
                  alt=""
                  className="max-h-[360px] w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />

                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm transition hover:bg-rose-500 hover:text-white"
                  aria-label="Remove image"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M1 1L15 15M15 1L1 15"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-white"
                >
                  Replace
                </button>
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-slate-100 bg-white/95 px-7 py-5 backdrop-blur">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_-6px_rgba(15,156,140,0.55)] transition hover:bg-teal-700 hover:shadow-[0_10px_24px_-6px_rgba(15,156,140,0.6)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            )}
            {loading ? "Posting..." : mode === "create" ? "Publish post" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}