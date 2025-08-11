const Trip = require('../models/tripModel');

// Create a new trip
exports.createTrip = async (req, res) => {
    try {
        const trip = await Trip.create(req.body);
        res.json(trip);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all trips for a user
exports.getTripsByUserId = async (req, res) => {
    try {
        const trips = await Trip.findAll({
            where: { user_id: req.params.userId }
        });
        res.json(trips);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a specific trip by ID
exports.getTripById = async (req, res) => {
    try {
        const trip = await Trip.findByPk(req.params.id);
        if (!trip) return res.status(404).json({ error: 'Trip not found' });
        res.json(trip);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a trip
exports.updateTrip = async (req, res) => {
    try {
        const [updated] = await Trip.update(req.body, {
            where: { trip_id: req.params.id }
        });
        if (!updated) return res.status(404).json({ error: 'Trip not found' });
        res.json({ message: 'Trip updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a trip
exports.deleteTrip = async (req, res) => {
    try {
        const deleted = await Trip.destroy({
            where: { trip_id: req.params.id }
        });
        if (!deleted) return res.status(404).json({ error: 'Trip not found' });
        res.json({ message: 'Trip deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all trips
exports.getAllTrips = async (req, res) => {
    try {
        const trips = await Trip.findAll();
        res.json(trips);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
