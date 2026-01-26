"use client"
import Loader from "@/Components/Loader";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

interface SubmitData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const [formData, setFormData] = useState<SubmitData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loader,setLoader]=useState(false);
  const router = useRouter();
  //To Change State Data
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setError("");
    setFormData({ ...formData, [name]: value });
  };
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoader(true)
    if(!formData.confirmPassword || !formData.email || !formData.name || !formData.password){
      setError("Please fill up all details!")
      return
    }
    if(formData.password != formData.confirmPassword){
      setError("Password and Confirm Password should be same!")
      return;
    }
    try {
      const res = await axios.post("http://localhost:8080/auth/register",formData);
      console.log(res)
      if (res.status===201) {
        toast("Successfully Created your account!")
        router.push('/login')
      }else{
        throw new Error("Sonthing went wrong")
      }
    } catch (error) {
      console.error(error)
    }finally{
      setLoader(false)
    }

  };

  return (
    <div className="flex justify-center items-center min-h-[91vh] bg-gray-50 px-4">
    {loader && <Loader />}
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Create Account
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              type="text"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:outline-none focus:ring-blue-400"
              placeholder="Enter Your Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              name="email"
              type="email"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:outline-none focus:ring-blue-400"
              placeholder="xyz@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute outline-none right-3 top-3 text-sm text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:outline-none focus:ring-blue-400"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-4">
          Already have an account?
          <Link href="/login" className="text-blue-600 hover:underline ml-1">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
