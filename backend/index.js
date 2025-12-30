const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
require("dotenv").config()

const timetableRoutes = require("./src/routes/timetable.routes")
const notesRoutes = require("./src/routes/notes.routes")
const progressRoutes = require("./src/routes/progress.routes")

const app = express()

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Routes
app.use("/api/timetable", timetableRoutes)
app.use("/api/notes", notesRoutes)
app.use("/api/progress", progressRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: "Internal Server Error", message: err.message })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
