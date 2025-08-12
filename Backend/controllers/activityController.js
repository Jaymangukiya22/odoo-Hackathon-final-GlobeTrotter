const Activity = require('../models/activityModel');

// Create a new trip
exports.createActivity = async (req, res) => {
    try {
        const activity = await Activity.create(req.body);
        res.json(activity);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all trips for a user
exports.getActivitiesByUserId = async (req, res) => {
    try {
        const activities = await Activity.findAll({
            where: { user_id: req.params.userId }
        });
        res.json(activities);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a specific trip by ID
exports.getActivityById = async (req, res) => {
    try {
        const activity = await Activity.findByPk(req.params.id);
        if (!activity) return res.status(404).json({ error: 'Activity not found' });
        res.json(activity);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a trip
exports.updateActivity = async (req, res) => {
    try {
        const [updated] = await Activity.update(req.body, {
            where: { activity_id: req.params.id }
        });
        if (!updated) return res.status(404).json({ error: 'Activity not found' });
        res.json({ message: 'Activity updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a trip
exports.deleteActivity = async (req, res) => {
    try {
        const deleted = await Activity.destroy({
            where: { activity_id: req.params.id }
        });
        if (!deleted) return res.status(404).json({ error: 'Activity not found' });
        res.json({ message: 'Activity deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all trips
exports.getAllActivities = async (req, res) => {
    try {
        const activities = await Activity.findAll();
        res.json(activities);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
