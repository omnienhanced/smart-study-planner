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
      toast.error("Failed to logout")
    }
  }

  return (
    <nav className="glass-card px-4 md:px-8 py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 shadow-lg rounded-xl border border-white/20">
      
      <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent text-center md:text-left">
        Smart Study Planner
      </h1>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-200 max-w-[220px] truncate">
          {user?.email}
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:scale-105 transition"
        >
          <FiLogOut size={18} />
          Logout
        </button>
      </div>
    </nav>
  )
}

