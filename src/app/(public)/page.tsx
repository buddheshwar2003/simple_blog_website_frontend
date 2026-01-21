"use client";
import Navbar from "@/Components/Navbar";
import Link from "next/link";
import { useEffect } from "react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Write, Share & Read Blogs with Ease
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          A simple blogging platform built with Next.js, Redux Toolkit, and
          Tailwind CSS. Fast, clean, and developer-friendly.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/register"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-100"
          >
            Login
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold text-lg mb-2">Fast & Modern</h3>
          <p className="text-gray-600">
            Built with Next.js and Tailwind for speed and performance.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold text-lg mb-2">State Management</h3>
          <p className="text-gray-600">
            Redux Toolkit keeps your app predictable and scalable.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold text-lg mb-2">Secure Auth</h3>
          <p className="text-gray-600">
            Login & Register flow ready for real authentication.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} ReduxBlog. All rights reserved.
      </footer>
    </div>
  );
}
