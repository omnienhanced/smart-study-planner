"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { Navbar } from "../components/Navbar"
import { Sidebar } from "../components/Sidebar"
import { Card } from "../components/Card"
import { getStreak, getProgress, toggleTask as apiToggleTask } from "../services/apiService"
import toast from "react-hot-toast"

const Dashboard = () => {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [streak, setStreak] = useState(0)
  const [progressData, setProgressData] = useState([])
  const [loading, setLoading] = useState(true)

  const today = new Date().toLocaleDateString("en-CA")

  useEffect(() => {
    if (user?.uid) fetchDashboardData()
  }, [user])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const [streakRes, progressRes] = await Promise.all([
        getStreak(user.uid),
        getProgress(user.uid),
      ])
      setStreak(streakRes.data.streak || 0)
      setProgressData(progressRes.data.progress || [])
    } catch (error) {
      console.error("Dashboard fetch error:", error)
      toast.error("Failed to fetch dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const todayProgress = progressData.find(d => d.date === today)
  const todayTasks = todayProgress?.tasks ?? {}

  const completedTasksCount = Object.values(todayTasks).filter(t => t.completed).length
  const totalTasksCount = Object.keys(todayTasks).length

  const toggleTask = async (taskId, task) => {
    try {
      await apiToggleTask(user.uid, {
        taskId,
        subject: task.subject,
        completed: !task.completed,
      })
      fetchDashboardData()
    } catch (err) {
      console.error("Toggle task failed:", err)
      toast.error("Failed to update task")
    }
  }

  return (
    <div className="flex h-screen bg-dark text-white">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="p-6 space-y-6 overflow-y-auto">
          {loading ? (
            <p className="text-gray-400 text-center mt-20">Loading...</p>
          ) : (
            <>
              {/* STREAK */}
              <Card className="bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-xl">
                <h3 className="text-sm opacity-80">Current Streak</h3>
                <p className="text-5xl font-bold mt-2">{streak} 🔥</p>
              </Card>

              {/* STATS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gray-800 text-white shadow-lg">
                  <h3 className="text-sm text-gray-400">Today's Progress</h3>
                  <p className="text-3xl font-bold mt-1">
                    {completedTasksCount}/{totalTasksCount}
                  </p>
                  <div className="w-full bg-gray-700 h-2 rounded mt-3">
                    <div
                      className="h-2 rounded bg-gradient-to-r from-pink-500 to-purple-500 transition-all"
                      style={{
                        width:
                          totalTasksCount > 0
                            ? `${(completedTasksCount / totalTasksCount) * 100}%`
                            : "0%",
                      }}
                    />
                  </div>
                </Card>

                <Card className="bg-gray-800 text-white shadow-lg">
                  <h3 className="text-sm text-gray-400">Days Logged</h3>
                  <p className="text-3xl font-bold mt-1">{progressData.length}</p>
                </Card>

                <Card className="bg-gray-800 text-white shadow-lg">
                  <h3 className="text-sm text-gray-400">Estimated Hours</h3>
                  <p className="text-3xl font-bold mt-1">
                    {(progressData.length * 2).toFixed(1)}
                  </p>
                </Card>
              </div>

              {/* TODAY TASKS */}
              <Card className="bg-gray-800 text-white shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Today's Tasks</h3>
                {totalTasksCount === 0 ? (
                  <p className="text-gray-400">No tasks added today</p>
                ) : (
                  <div className="space-y-2">
                    {Object.entries(todayTasks).map(([id, task]) => (
                      <div
                        key={id}
                        className="flex justify-between items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTask(id, task)}
                            className="w-5 h-5 accent-gradient-to-r from-pink-500 to-purple-500"
                          />
                          <span
                            className={`text-sm ${
                              task.completed ? "line-through text-gray-400" : ""
                            }`}
                          >
                            {task.subject}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default Dashboard
