const { db } = require("../config/firebaseAdmin")

/* =======================
   ADD / UPDATE TASK
======================= */
exports.logProgress = async (req, res) => {
  try {
    const { userId } = req.params
    const { taskId, subject, completed } = req.body

    if (!taskId || subject === undefined || completed === undefined) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const today = new Date().toISOString().split("T")[0]

    const progressRef = db
      .collection("users")
      .doc(userId)
      .collection("progress")
      .doc(today)

    await progressRef.set(
      {
        date: today,
        tasks: {
          [taskId]: {
            subject,
            completed,
            timestamp: new Date(),
          },
        },
      },
      { merge: true } // IMPORTANT
    )

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

/* =======================
   GET ALL PROGRESS
======================= */
exports.getProgress = async (req, res) => {
  try {
    const { userId } = req.params

    const snapshot = await db
      .collection("users")
      .doc(userId)
      .collection("progress")
      .orderBy("date", "desc")
      .get()

    const progress = snapshot.docs.map((doc) => ({
      date: doc.id,
      ...doc.data(),
    }))
    console.log("Progress fetched:", progress.length, "days")
    res.json({ progress })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

/* =======================
   GET STREAK
======================= */
exports.getStreak = async (req, res) => {
  try {
    const { userId } = req.params

    const snapshot = await db
      .collection("users")
      .doc(userId)
      .collection("progress")
      .orderBy("date", "desc")
      .get()

    let streak = 0
    let today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 0; i < snapshot.docs.length; i++) {
      const docDate = new Date(snapshot.docs[i].data().date)
      docDate.setHours(0, 0, 0, 0)

      if (
        docDate.getTime() ===
        today.getTime() - i * 24 * 60 * 60 * 1000
      ) {
        streak++
      } else {
        break
      }
    }

    res.json({ streak })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

/* =======================
   DELETE TASK
======================= */
exports.deleteTask = async (req, res) => {
  try {
    const { userId } = req.params
    const { date, taskId } = req.body

    if (!date || !taskId) {
      return res.status(400).json({ error: "Missing fields" })
    }

    const ref = db
      .collection("users")
      .doc(userId)
      .collection("progress")
      .doc(date)

    const doc = await ref.get()
    if (!doc.exists) return res.json({ success: true })

    const data = doc.data()
    delete data.tasks[taskId]

    if (Object.keys(data.tasks).length === 0) {
      await ref.delete()
    } else {
      await ref.update({ tasks: data.tasks })
    }

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
