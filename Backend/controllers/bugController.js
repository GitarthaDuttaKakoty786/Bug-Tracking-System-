const Bug = require("../models/Bug");

// Create Bug
const createBug = async (req, res) => {
    try {
        const { title, description, priority, status } = req.body;

        const bug = await Bug.create({
            title,
            description,
            priority,
            status,
            createdBy: req.user._id
        });

        res.status(201).json(bug);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get All Bugs
const getBugs = async (req, res) => {
    try {

        const bugs = await Bug.find({
            createdBy: req.user._id
        });

        res.json(bugs);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Update Bug
const updateBug = async (req, res) => {
    try {

        const bug = await Bug.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(bug);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Delete Bug
const deleteBug = async (req, res) => {
    try {

        await Bug.findByIdAndDelete(req.params.id);

        res.json({
            message: "Bug Deleted"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createBug,
    getBugs,
    updateBug,
    deleteBug
};