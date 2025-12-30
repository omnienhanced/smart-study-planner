const express = require("express")
const router = express.Router()
const timetableController = require("../controllers/timetable.controller")

router.post("/generate", timetableController.generateTimetable)
router.get("/:userId", timetableController.getTimetable)
router.put("/:userId", timetableController.updateTimetable)
router.delete("/:userId", timetableController.deleteTimetable)

module.exports = router
