"use client"

import { logout } from "../services/authService"
import { useAuth } from "../hooks/useAuth"
import { FiLogOut } from "react-icons/fi"
import toast from 'react-hot-toast';

export const Navbar = () => {
  const { user } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      toast.success("Logged out successfully!")
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Failed to logout. Please try again.")
    }
  }

  return (
    <nav className="glass-card px-8 py-4 flex justify-between items-center mb-6 shadow-lg backdrop-blur-md rounded-xl border border-white/20">
      <h1 className="text-3xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
        Smart Study Planner
      </h1>
      <div className="flex items-center gap-4">
        <div className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm text-gray-200 flex items-center gap-2">
          <span>{user?.email}</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:scale-105 hover:brightness-110 transition-transform duration-200"
        >
          <FiLogOut size={18} />
          Logout
        </button>
      </div>
    </nav>
  )
}
