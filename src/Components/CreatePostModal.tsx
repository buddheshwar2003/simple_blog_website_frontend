"use client";

import { Dispatch, SetStateAction, useState } from "react";

interface CreatePostModalProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const CreatePostModal = ({ setOpen }: CreatePostModalProps) => {
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    categoryName: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setPostData({ ...postData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(postData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-lg rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Create New Post</h3>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              name="title"
              type="text"
              placeholder="Enter post title"
              value={postData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={postData.categoryName}
              onChange={handleChange}
              name="categoryName"
            >
              <option value={""}>Select Category</option>
              <option value={"technology"}>Technology</option>
              <option value={"programing"}>Programming</option>
              <option value={"design"}>Design</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <textarea
              name="content"
              value={postData.content}
              onChange={handleChange}
              rows={5}
              placeholder="Write your content here..."
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-sm border rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
