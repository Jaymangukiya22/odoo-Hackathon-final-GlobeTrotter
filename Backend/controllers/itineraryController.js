const Itinerary = require('../models/itineraryModel');

// Create a new trip
exports.createItinerary = async (req, res) => {
    try {
        const itinerary = await Itinerary.create(req.body);
        res.json(itinerary);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all trips for a user
exports.getItinerariesByUserId = async (req, res) => {
    try {
        const itineraries = await Itinerary.findAll({
            where: { user_id: req.params.userId }
        });
        res.json(itineraries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a specific trip by ID
exports.getItineraryById = async (req, res) => {
    try {
        const itinerary = await Itinerary.findByPk(req.params.id);
        if (!itinerary) return res.status(404).json({ error: 'Itinerary not found' });
        res.json(itinerary);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a trip
exports.updateItinerary = async (req, res) => {
    try {
        const [updated] = await Itinerary.update(req.body, {
            where: { itinerary_id: req.params.id }
        });
        if (!updated) return res.status(404).json({ error: 'Itinerary not found' });
        res.json({ message: 'Trip updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a trip
exports.deleteItinerary = async (req, res) => {
    try {
        const deleted = await Itinerary.destroy({
            where: { itinerary_id: req.params.id }
        });
        if (!deleted) return res.status(404).json({ error: 'Itinerary not found' });
        res.json({ message: 'Itinerary deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all trips
exports.getAllItineraries = async (req, res) => {
    try {
        const itineraries = await Itinerary.findAll();
        res.json(itineraries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
