const express = require("express")
const router = express.Router()
const progressController = require("../controllers/progress.controller")

router.post("/:userId", progressController.logProgress)
router.get("/:userId", progressController.getProgress)
router.get("/:userId/streak", progressController.getStreak)
router.delete("/:userId", progressController.deleteTask)

module.exports = router
