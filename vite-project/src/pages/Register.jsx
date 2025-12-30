"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { register } from "../services/authService"
import toast from 'react-hot-toast';

const Register = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    try {
      await register(email, password)
      toast.success("Register successfully!")
      navigate("/dashboard")
      
    } catch (err) {
      setError(err.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-950">
      <div className="w-full max-w-md p-6">
        <div className="glass-card p-10 shadow-2xl rounded-3xl border border-gray-700/30 backdrop-blur-lg bg-gray-900/70">
          {/* Heading */}
          <h1 className="text-4xl font-extrabold text-center mb-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Smart Study Planner
          </h1>
          <p className="text-center text-gray-300 mb-8">Create your account</p>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-500 bg-opacity-30 border border-red-500 rounded-lg text-red-200 text-sm text-center">
                {error}
              </div>
            )}

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-indigo-500 smooth-transition text-white placeholder-gray-400"
              required
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-indigo-500 smooth-transition text-white placeholder-gray-400"
              required
            />

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-indigo-500 smooth-transition text-white placeholder-gray-400"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 gradient-bg rounded-xl font-semibold hover:shadow-lg smooth-transition text-white"
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-gray-400 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 font-medium hover:text-pink-400">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
