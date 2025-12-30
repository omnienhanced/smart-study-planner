"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { Navbar } from "../components/Navbar"
import { Sidebar } from "../components/Sidebar"
import { Card } from "../components/Card"

const Progress = () => {
  const { user } = useAuth()
  const [progressData, setProgressData] = useState([])
  const [loading, setLoading] = useState(true)
  const [newTaskSubject, setNewTaskSubject] = useState("")
  const [showAddTask, setShowAddTask] = useState(false)

  useEffect(() => {
    if (user?.uid) fetchProgress()
  }, [user])

  const fetchProgress = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/progress/${user.uid}`)
      const data = await res.json()
      setProgressData(data.progress || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const deleteTask = async (date, taskId) => {
    if (!confirm("Delete this task?")) return
    try {
      await fetch(`http://localhost:5000/api/progress/${user.uid}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, taskId }),
      })
      fetchProgress()
    } catch (err) {
      console.error("Delete failed", err)
    }
  }

  const addTask = async () => {
    if (!newTaskSubject.trim()) return
    await fetch(`http://localhost:5000/api/progress/${user.uid}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taskId: `task-${Date.now()}`,
        subject: newTaskSubject,
        completed: false,
      }),
    })
    setNewTaskSubject("")
    setShowAddTask(false)
    fetchProgress()
  }

  const toggleTask = async (date, taskId, task) => {
    await fetch(`http://localhost:5000/api/progress/${user.uid}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taskId,
        subject: task.subject,
        completed: !task.completed,
      }),
    })
    fetchProgress()
  }

  return (
    <div className="flex h-screen bg-dark text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="p-6 flex-1 flex flex-col space-y-6 overflow-hidden">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Study Progress
          </h1>

          <button
            onClick={() => setShowAddTask(!showAddTask)}
            className="mb-4 px-4 py-2 w-[125px] bg-primary rounded-lg hover:scale-105 transition-transform font-semibold"
          >
            {showAddTask ? "Cancel" : "+ Add Task"}
          </button>

          {showAddTask && (
            <Card className="bg-gray-800 shadow-lg p-4 flex gap-2 items-center">
              <input
                value={newTaskSubject}
                onChange={(e) => setNewTaskSubject(e.target.value)}
                placeholder="Task subject"
                className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-primary"
              />
              <button
                onClick={addTask}
                className="px-4 py-2 bg-green-600 rounded-lg hover:scale-105 transition-transform font-semibold"
              >
                Add
              </button>
            </Card>
          )}

          {loading ? (
            <p className="text-gray-400">Loading your progress...</p>
          ) : (
            <div className="flex-1 space-y-4 overflow-auto scrollbar-hide">
              {progressData.map((day) => (
                <Card
                  key={day.date}
                  className="bg-gray-800 shadow-lg p-4 flex flex-col max-h-96"
                >
                  <h3 className="font-semibold text-xl mb-2">{day.date}</h3>

                  {/* Scrollable tasks container with hidden scrollbar */}
                  <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                    {Object.entries(day.tasks || {}).map(([id, task]) => (
                      <div
                        key={id}
                        className="flex items-center justify-between p-4 bg-gray-900 rounded-lg hover:bg-gray-850 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTask(day.date, id, task)}
                            className="w-5 h-5 accent-primary cursor-pointer"
                          />
                          <span
                            className={`text-base ${task.completed ? "line-through text-gray-500" : ""}`}
                          >
                            {task.subject}
                          </span>
                        </div>
                        <button
                          onClick={() => deleteTask(day.date, id)}
                          className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                          title="Delete Task"
                        >
                          🗑
                        </button>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Progress
