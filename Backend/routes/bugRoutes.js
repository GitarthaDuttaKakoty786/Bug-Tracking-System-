const express = require("express");

const {
    createBug,
    getBugs,
    updateBug,
    deleteBug
} = require("../controllers/bugController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createBug);

router.get("/", protect, getBugs);

router.put("/:id", protect, updateBug);

router.delete("/:id", protect, deleteBug);

module.exports = router;