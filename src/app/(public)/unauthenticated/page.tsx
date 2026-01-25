"use client"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Unauthenticated() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /login after 3 seconds
    const timer = setTimeout(() => {
      router.push("/login");
    }, 3000); // 3000ms = 3 seconds

    // Cleanup in case the component unmounts early
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-4 text-red-600">
        Unauthenticated
      </h1>
      <p className="text-gray-700 mb-6">
        You don’t have access to this page. Redirecting to login...
      </p>
      <div className="w-64 h-2 bg-gray-300 rounded-full overflow-hidden">
        <div className="h-full bg-blue-600 animate-progress"></div>
      </div>
      <p className="text-sm text-gray-500 mt-2">Redirecting in 3 seconds</p>

      {/* Tailwind progress bar animation */}
      <style jsx>{`
        .animate-progress {
          animation: progress 3s linear forwards;
        }
        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
