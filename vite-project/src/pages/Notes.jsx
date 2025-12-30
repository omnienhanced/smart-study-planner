"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { Navbar } from "../components/Navbar"
import { Sidebar } from "../components/Sidebar"
import { Card } from "../components/Card"
import { summarizeNotes, generateQuiz, saveNotes, getUserNotes, deleteNote } from "../services/apiService"
import toast from 'react-hot-toast';

const Notes = () => {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [tab, setTab] = useState("create")
  const [notes, setNotes] = useState("")
  const [noteTitle, setNoteTitle] = useState("")
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState(null)
  const [quiz, setQuiz] = useState(null)
  const [savedNotes, setSavedNotes] = useState([])
  const [selectedNote, setSelectedNote] = useState(null)

  useEffect(() => {
    if (user?.uid) fetchSavedNotes()
  }, [user])

  const fetchSavedNotes = async () => {
    try {
      const response = await getUserNotes(user.uid)
      setSavedNotes(response.data.notes || [])
    } catch (error) {
      console.error("Error fetching saved notes:", error)
      toast.error("Failed to fetch saved notes")
    }
  }

  const handleSummarize = async (e) => {
    e.preventDefault()
    if (!notes.trim()) return toast.error("Please paste your notes first")
    setLoading(true)
    try {
      const response = await summarizeNotes({ userId: user.uid, notes })
      setSummary(response.data.summary)
      toast.success("Notes summarized successfully!")
    } catch (error) {
      console.error(error)
      toast.error("Failed to summarize notes")
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateQuiz = async (e) => {
    e.preventDefault()
    if (!notes.trim()) return toast.error("Please paste your notes first")
    setLoading(true)
    try {
      const response = await generateQuiz({ userId: user.uid, notes })
      setQuiz(response.data.quiz)
      toast.success("Quiz generated successfully!")
    } catch (error) {
      console.error(error)
      toast.error("Failed to generate quiz")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveNotes = async () => {
    if (!noteTitle.trim()) return toast.error("Please enter a title")
    try {
      await saveNotes(user.uid, { originalNotes: notes, summary, quiz, title: noteTitle })
      toast.success("Notes saved successfully!")
      setNotes(""); setNoteTitle(""); setSummary(null); setQuiz(null)
      fetchSavedNotes()
    } catch (error) {
      console.error(error)
      toast.error("Failed to save notes")
    }
  }

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return
    try {
      await deleteNote(user.uid, noteId)
      toast.success("Note deleted successfully!")
      fetchSavedNotes()
      setSelectedNote(null)
    } catch (error) {
      console.error(error)
      toast.error("Failed to delete note")
    }
  }

  return (
    <div className="flex h-screen bg-dark text-white">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-auto p-6 space-y-6">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
            Study Notes
          </h1>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-gray-700">
            <button
              onClick={() => setTab("create")}
              className={`px-4 py-2 font-medium transition-all ${
                tab === "create" ? "text-primary border-b-2 border-primary" : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Create & Summarize
            </button>
            <button
              onClick={() => setTab("view")}
              className={`px-4 py-2 font-medium transition-all ${
                tab === "view" ? "text-primary border-b-2 border-primary" : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Saved Notes ({savedNotes.length})
            </button>
          </div>

          {tab === "create" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Input Section */}
              <div className="lg:col-span-2 space-y-4">
                <Card className="bg-gray-800 shadow-lg">
                  <h2 className="text-2xl font-semibold mb-4">Paste Your Notes</h2>
                  <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                    <input
                      type="text"
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-primary"
                      placeholder="Note Title"
                    />
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows="8"
                      placeholder="Paste your notes..."
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-primary resize-none"
                    ></textarea>

                    <div className="flex gap-2">
                      <button
                        onClick={handleSummarize}
                        disabled={loading}
                        className="flex-1 py-2 bg-primary rounded-lg hover:scale-105 transition-transform disabled:opacity-50 font-semibold"
                      >
                        {loading ? "Summarizing..." : "Summarize Notes"}
                      </button>
                      <button
                        onClick={handleGenerateQuiz}
                        disabled={loading}
                        className="flex-1 py-2 bg-secondary rounded-lg hover:scale-105 transition-transform disabled:opacity-50 font-semibold"
                      >
                        {loading ? "Generating..." : "Generate Quiz"}
                      </button>
                    </div>

                    {(summary || quiz) && (
                      <button
                        onClick={handleSaveNotes}
                        className="w-full py-2 gradient-bg rounded-lg font-semibold hover:shadow-lg transition-all"
                      >
                        Save Notes & Results
                      </button>
                    )}
                  </form>
                </Card>
              </div>

              {/* Results Section */}
              <div className="space-y-4">
                {summary && (
                  <Card className="bg-gray-800 shadow-lg">
                    <h3 className="text-lg font-semibold mb-3 text-primary">Summary</h3>
                    <div className="space-y-2">
                      {summary.summary && Array.isArray(summary.summary) ? (
                        summary.summary.map((point, idx) => (
                          <div key={idx} className="flex gap-2">
                            <span className="text-primary font-bold">•</span>
                            <p className="text-sm text-gray-300">{point}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400">{JSON.stringify(summary)}</p>
                      )}
                    </div>
                  </Card>
                )}

                {quiz && (
                  <Card className="bg-gray-800 shadow-lg">
                    <h3 className="text-lg font-semibold mb-3 text-secondary">Quiz Questions</h3>
                    <div className="space-y-3">
                      {quiz.questions && Array.isArray(quiz.questions) ? (
                        quiz.questions.slice(0, 5).map((q, idx) => (
                          <div key={idx} className="p-3 bg-gray-900 rounded-lg">
                            <p className="font-semibold text-gray-300 mb-1">Q{idx + 1}: {q.question}</p>
                            <ul className="ml-4 text-gray-400 text-sm space-y-1">
                              {q.options.map((opt, i) => (
                                <li key={i}>{String.fromCharCode(97 + i)}) {opt}</li>
                              ))}
                            </ul>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400">{JSON.stringify(quiz)}</p>
                      )}
                    </div>
                  </Card>
                )}
              </div>
            </div>
          ) : (
            // Saved Notes Tab
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Notes List */}
              <div className="lg:col-span-1">
                <Card className="bg-gray-800 shadow-lg">
                  <h3 className="text-lg font-semibold mb-4">Your Notes</h3>
                  <div className="space-y-2">
                    {savedNotes.length > 0 ? (
                      savedNotes.map((note) => (
                        <button
                          key={note.id}
                          onClick={() => setSelectedNote(note)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                            selectedNote?.id === note.id
                              ? "bg-primary text-white"
                              : "bg-gray-900 hover:bg-gray-700 text-gray-300"
                          }`}
                        >
                          <p className="font-semibold truncate">{note.title}</p>
                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400">No saved notes yet</p>
                    )}
                  </div>
                </Card>
              </div>

              {/* Note Details */}
              {selectedNote && (
                <div className="lg:col-span-3 space-y-4">
                  <Card className="flex justify-between items-start bg-gray-800 shadow-lg">
                    <h2 className="text-2xl font-semibold">{selectedNote.title}</h2>
                    <button
                      onClick={() => handleDeleteNote(selectedNote.id)}
                      className="px-3 py-1 bg-red-500 bg-opacity-20 text-red-300 rounded hover:bg-opacity-30 transition-all"
                    >
                      Delete
                    </button>
                  </Card>

                  {selectedNote.originalNotes && (
                    <Card className="bg-gray-800 shadow-lg">
                      <h3 className="text-lg font-semibold mb-3">Original Notes</h3>
                      <p className="text-gray-300 whitespace-pre-wrap">{selectedNote.originalNotes}</p>
                    </Card>
                  )}

                  {selectedNote.summary && (
                    <Card className="bg-gray-800 shadow-lg">
                      <h3 className="text-lg font-semibold mb-3 text-primary">Summary</h3>
                      <div className="space-y-2">
                        {selectedNote.summary.summary?.map((point, idx) => (
                          <div key={idx} className="flex gap-2">
                            <span className="text-primary font-bold">•</span>
                            <p className="text-sm text-gray-300">{point}</p>
                          </div>
                        )) || <p className="text-sm text-gray-400">{JSON.stringify(selectedNote.summary)}</p>}
                      </div>
                    </Card>
                  )}

                  {selectedNote.quiz && (
                    <Card className="bg-gray-800 shadow-lg">
                      <h3 className="text-lg font-semibold mb-3 text-secondary">Quiz Questions</h3>
                      <div className="space-y-3">
                        {selectedNote.quiz.questions?.map((q, idx) => (
                          <div key={idx} className="p-3 bg-gray-900 rounded-lg">
                            <p className="font-semibold text-gray-300 mb-1">Q{idx + 1}: {q.question}</p>
                            <ul className="ml-4 text-gray-400 text-sm space-y-1">
                              {q.options.map((opt, i) => (
                                <li key={i}>{String.fromCharCode(97 + i)}) {opt}</li>
                              ))}
                            </ul>
                          </div>
                        )) || <p className="text-sm text-gray-400">{JSON.stringify(selectedNote.quiz)}</p>}
                      </div>
                    </Card>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Notes
