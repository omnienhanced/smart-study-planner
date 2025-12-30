"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { Navbar } from "../components/Navbar"
import { Sidebar } from "../components/Sidebar"
import { Card } from "../components/Card"
import { generateTimetable, getTimetable } from "../services/apiService"
import toast from 'react-hot-toast';

const Timetable = () => {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [timetable, setTimetable] = useState(null)
  const [showForm, setShowForm] = useState(true)
  const [fetchingTimetable, setFetchingTimetable] = useState(true)

  const [subjects, setSubjects] = useState(["Math", "Physics", "Chemistry"])
  const [newSubject, setNewSubject] = useState("")
  const [examDates, setExamDates] = useState(["2024-02-15", "2024-02-20", "2024-02-25"])
  const [newDate, setNewDate] = useState("")
  const [difficulty, setDifficulty] = useState("medium")
  const [dailyHours, setDailyHours] = useState(4)

  useEffect(() => {
    if (user?.uid) fetchExistingTimetable()
  }, [user])

  const fetchExistingTimetable = async () => {
    setFetchingTimetable(true)
    try {
      const response = await getTimetable(user.uid)
      const timetableData = response.data.timetable?.timetable || response.data.timetable
      if (timetableData?.schedule?.length > 0) {
        setTimetable(timetableData)
        setShowForm(false)
      } else {
        setShowForm(true)
      }
    } catch (error) {
      console.error("Error fetching timetable:", error)
      toast.error("Failed to fetch timetable")
      setShowForm(true)
    } finally {
      setFetchingTimetable(false)
    }
  }

  const addSubject = () => newSubject.trim() && (setSubjects([...subjects, newSubject]), setNewSubject(""))
  const removeSubject = (i) => setSubjects(subjects.filter((_, idx) => idx !== i))
  const addExamDate = () => newDate.trim() && (setExamDates([...examDates, newDate]), setNewDate(""))
  const removeExamDate = (i) => setExamDates(examDates.filter((_, idx) => idx !== i))

  const handleGenerateTimetable = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await generateTimetable({ userId: user.uid, subjects, examDates, difficulty, dailyHours })
      setTimetable(response.data.timetable?.timetable || response.data.timetable)
      setShowForm(false)
      toast.success("Timetable generated successfully!")
    } catch (error) {
      console.error(error)
      toast.error("Failed to generate timetable")
    } finally {
      setLoading(false)
    }
  }

  const handleEditTimetable = () => {
    setShowForm(true)
    setTimetable(null)
  }

  if (fetchingTimetable) {
    return (
      <div className="flex h-screen bg-dark">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gradient-to-r from-pink-500 to-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading your timetable...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-dark text-white">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
              AI Study Timetable
            </h1>
            {timetable && (
              <button
                onClick={handleEditTimetable}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg hover:scale-105 transition-transform"
              >
                Edit Timetable
              </button>
            )}
          </div>

          {/* Form */}
          {showForm ? (
            <Card className="bg-gray-800 text-white shadow-lg">
              <h2 className="text-2xl font-semibold mb-6">Generate Your Study Timetable</h2>
              <form onSubmit={handleGenerateTimetable} className="space-y-6">
                {/* Subjects */}
                <div>
                  <label className="block text-sm font-medium mb-2">Subjects</label>
                  <div className="space-y-2 mb-3">
                    {subjects.map((s, i) => (
                      <div key={i} className="flex justify-between items-center bg-gray-700 p-2 rounded-lg">
                        <span>{s}</span>
                        <button type="button" onClick={() => removeSubject(i)} className="text-red-400 hover:text-red-300">
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary"
                      placeholder="Add a subject"
                    />
                    <button type="button" onClick={addSubject} className="px-4 py-2 bg-primary rounded-lg hover:bg-indigo-600">
                      Add
                    </button>
                  </div>
                </div>

                {/* Exam Dates */}
                <div>
                  <label className="block text-sm font-medium mb-2">Exam Dates</label>
                  <div className="space-y-2 mb-3">
                    {examDates.map((d, i) => (
                      <div key={i} className="flex justify-between items-center bg-gray-700 p-2 rounded-lg">
                        <span>{d}</span>
                        <button type="button" onClick={() => removeExamDate(i)} className="text-red-400 hover:text-red-300">
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary"
                    />
                    <button type="button" onClick={addExamDate} className="px-4 py-2 bg-primary rounded-lg hover:bg-indigo-600">
                      Add
                    </button>
                  </div>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium mb-2">Difficulty Level</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                {/* Daily Hours */}
                <div>
                  <label className="block text-sm font-medium mb-2">Daily Study Hours: {dailyHours}</label>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={dailyHours}
                    onChange={(e) => setDailyHours(Number.parseInt(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 gradient-bg rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 transition-all"
                >
                  {loading ? "Generating Timetable..." : "Generate Timetable"}
                </button>
              </form>
            </Card>
          ) : (
            // Timetable View
            <div className="space-y-4">
              {timetable?.schedule?.map((day, idx) => (
                <Card key={idx} className="bg-gray-800 shadow-lg">
                  <h3 className="text-xl font-semibold mb-4 text-primary">{day.day || `Day ${idx + 1}`}</h3>
                  <div className="space-y-3">
                    {day.sessions?.map((s, i) => (
                      <div key={i} className="flex items-center justify-between bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors">
                        <div>
                          <p className="font-semibold text-lg">{s.subject}</p>
                          <p className="text-sm text-gray-400">🕐 {s.time}</p>
                          {s.topic && <p className="text-sm text-indigo-300 mt-1">{s.topic}</p>}
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            s.priority === "high"
                              ? "bg-red-500 bg-opacity-20 text-red-300"
                              : s.priority === "medium"
                              ? "bg-yellow-500 bg-opacity-20 text-yellow-300"
                              : "bg-green-500 bg-opacity-20 text-green-300"
                          }`}
                        >
                          {s.priority}
                        </span>
                      </div>
                    )) || <p className="text-gray-400 py-4 text-center">No sessions scheduled</p>}
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

export default Timetable
