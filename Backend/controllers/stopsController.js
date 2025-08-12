const Stop = require('../models/stopsModel');

// Create a new trip
exports.createStop = async (req, res) => {
    try {
        const stop = await Stop.create(req.body);
        res.json(stop);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all trips for a user
exports.getStopsByUserId = async (req, res) => {
    try {
        const stops = await Stop.findAll({
            where: { user_id: req.params.userId }
        });
        res.json(stops);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a specific trip by ID
exports.getStopById = async (req, res) => {
    try {
        const stop = await Stop.findByPk(req.params.id);
        if (!stop) return res.status(404).json({ error: 'Stop not found' });
        res.json(stop);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a trip
exports.updateStop = async (req, res) => {
    try {
        const [updated] = await Stop.update(req.body, {
            where: { stop_id: req.params.id }
        });
        if (!updated) return res.status(404).json({ error: 'Stop not found' });
        res.json({ message: 'Stop updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a trip
exports.deleteStop = async (req, res) => {
    try {
        const deleted = await Stop.destroy({
            where: { stop_id: req.params.id }
        });
        if (!deleted) return res.status(404).json({ error: 'Stop not found' });
        res.json({ message: 'Stop deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all stops
exports.getAllStops = async (req, res) => {
    try {
        const stops = await Stop.findAll();
        res.json(stops);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
