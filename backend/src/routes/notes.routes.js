const express = require("express")
const router = express.Router()
const notesController = require("../controllers/notes.controller")

router.post("/summarize", notesController.summarizeNotes)
router.post("/quiz", notesController.generateQuiz)
router.get("/:userId", notesController.getUserNotes)
router.post("/:userId", notesController.saveNotes)
router.delete("/:userId/:noteId", notesController.deleteNote)

module.exports = router
