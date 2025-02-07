

"use client"

import { type FormEvent, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { toast } from "@/components/ui/use-toast"

function isValidRedirectUrl(url: string) {
  return url && url.startsWith("/") && !url.includes("://")
}

export default function LoginComponent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/"
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    const email = (target.elements.namedItem("email") as HTMLInputElement).value;
    const password = (target.elements.namedItem("password") as HTMLInputElement).value;

    const response = await fetch("http://localhost:3001/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-cache",
    });

    const data = await response.json();
console.log("data:",data);  
    if (response.ok) {
      // Validate the redirect URL before using it
      const safeRedirect = isValidRedirectUrl(redirect) ? redirect : "/";
      router.push(safeRedirect); // Redirect to the original URL or home page
    } else {
      alert(data.message);
      console.log(data);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white shadow-2xl rounded-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Welcome Back</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="user@example.com" defaultValue={"user@example.com"} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  defaultValue={"password123"}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full">
                Sign In
            </Button>
          </form>
          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Forgot your password?
            </a>
          </div>
          <div className="mt-4 text-center">
            <span className="text-sm text-gray-600">Dont have an account? </span>
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Sign up
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

