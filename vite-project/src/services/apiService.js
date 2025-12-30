import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Timetable APIs
export const generateTimetable = (data) => api.post("/api/timetable/generate", data)

export const getTimetable = (userId) => api.get(`/api/timetable/${userId}`)

export const updateTimetable = (userId, data) => api.put(`/api/timetable/${userId}`, data)

// Notes APIs
export const summarizeNotes = (data) => api.post("/api/notes/summarize", data)

export const generateQuiz = (data) => api.post("/api/notes/quiz", data)

export const saveNotes = (userId, data) => api.post(`/api/notes/${userId}`, data)

export const getUserNotes = (userId) => api.get(`/api/notes/${userId}`)

export const deleteNote = (userId, noteId) => api.delete(`/api/notes/${userId}/${noteId}`)

// Progress APIs
export const logProgress = (userId, data) => api.post(`/api/progress/${userId}`, data)

export const getProgress = (userId) => api.get(`/api/progress/${userId}`)

export const getStreak = (userId) => api.get(`/api/progress/${userId}/streak`)

export default api
