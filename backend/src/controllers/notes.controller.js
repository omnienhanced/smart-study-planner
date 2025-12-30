const { db } = require("../config/firebaseAdmin")
const { summarizeNotes, generateQuiz } = require("../services/gemini.service")

exports.summarizeNotes = async (req, res) => {
  try {
    const { userId, notes } = req.body

    const summary = await summarizeNotes(notes)

    res.json({ success: true, summary })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.generateQuiz = async (req, res) => {
  try {
    const { userId, notes } = req.body

    const quiz = await generateQuiz(notes)

    res.json({ success: true, quiz })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getUserNotes = async (req, res) => {
  try {
    const { userId } = req.params
    const snapshot = await db.collection("users").doc(userId).collection("notes").get()

    const notes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

    res.json({ notes })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.saveNotes = async (req, res) => {
  try {
    const { userId } = req.params
    const { originalNotes, summary, quiz, title } = req.body

    await db.collection("users").doc(userId).collection("notes").add({
      originalNotes,
      summary,
      quiz,
      title,
      createdAt: new Date(),
    })

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.deleteNote = async (req, res) => {
  try {
    const { userId, noteId } = req.params

    await db.collection("users").doc(userId).collection("notes").doc(noteId).delete()

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
