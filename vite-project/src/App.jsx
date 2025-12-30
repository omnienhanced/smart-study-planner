"use client"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./hooks/useAuth"
import { Loader } from "./components/Loader"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Timetable from "./pages/Timetable"
import Notes from "./pages/Notes"
import Progress from "./pages/Progress"
import { Toaster } from 'react-hot-toast';

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
      <Routes>
        {!user ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/timetable" element={<Timetable />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </>
        )}
      </Routes>
    </Router>
    </>
    
  )
}

export default App
