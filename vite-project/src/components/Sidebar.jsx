"use client"

import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { FiMenu } from "react-icons/fi"

export const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Timetable", path: "/timetable" },
    { name: "Notes", path: "/notes" },
    { name: "Progress", path: "/progress" },
  ]

  return (
    <>
      {/* Hamburger button for small devices */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-md bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <FiMenu size={24} />
      </button>

      {/* Overlay for small devices */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-64 h-screen transition-transform duration-300 z-50
          md:relative md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          bg-dark shadow-lg backdrop-blur-md border border-white/20`}
      >
        <h2 className="text-2xl font-bold mb-8 text-white ml-5 mt-5">Menu</h2>
        <ul className="space-y-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <li key={item.name}>
                <button
                  onClick={() => {
                    navigate(item.path)
                    setIsOpen(false)
                  }}
                  className={`block w-full text-left px-4 py-2 rounded-lg smooth-transition
                    ${
                      isActive
                        ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                        : "text-white hover:bg-primary"
                    }`}
                >
                  {item.name}
                </button>
              </li>
            )
          })}
        </ul>
      </aside>
    </>
  )
}
