const { db } = require("../config/firebaseAdmin")
const { generateTimetable } = require("../services/gemini.service")

exports.generateTimetable = async (req, res) => {
  try {
    const { userId, subjects, examDates, difficulty, dailyHours } = req.body

    // Validate input
    if (!userId || !subjects || !examDates || !difficulty || !dailyHours) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const timetableData  = await generateTimetable(subjects, examDates, difficulty, dailyHours)

    // Save to Firestore
    await db.collection("users").doc(userId).collection("timetables").add({
      timetable: timetableData,
      createdAt: new Date(),
      subjects,
      difficulty,
      dailyHours,
    })

    res.json({ success: true, timetable: timetableData, })
  } catch (error) {
    console.error('Error in generateTimetable controller:', error)
    res.status(500).json({ 
      error: error.message || "Failed to generate timetable",
      details: error.toString()
    })
  }
}

exports.getTimetable = async (req, res) => {
  try {
    const { userId } = req.params
    
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" })
    }

    const snapshot = await db.collection("users").doc(userId).collection("timetables")
      .orderBy("createdAt", "desc")
      .limit(1)
      .get()

    if (snapshot.empty) {
      return res.json({ timetable: null })
    }

    const timetable = snapshot.docs[0].data()
    res.json({ timetable })
  } catch (error) {
    console.error('Error in getTimetable:', error)
    res.status(500).json({ error: error.message })
  }
}

exports.updateTimetable = async (req, res) => {
  try {
    const { userId } = req.params
    const { timetableId, ...updateData } = req.body

    if (!userId || !timetableId) {
      return res.status(400).json({ error: "User ID and Timetable ID are required" })
    }

    await db.collection("users").doc(userId).collection("timetables").doc(timetableId).update({
      ...updateData,
      updatedAt: new Date()
    })

    res.json({ success: true })
  } catch (error) {
    console.error('Error in updateTimetable:', error)
    res.status(500).json({ error: error.message })
  }
}

exports.deleteTimetable = async (req, res) => {
  try {
    const { userId } = req.params

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" })
    }

    const snapshot = await db.collection("users").doc(userId).collection("timetables").get()

    const batch = db.batch()
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref)
    })
    await batch.commit()

    res.json({ success: true, message: "All timetables deleted" })
  } catch (error) {
    console.error('Error in deleteTimetable:', error)
    res.status(500).json({ error: error.message })
  }
}