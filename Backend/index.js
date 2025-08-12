const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');

// Import all models
const User = require('./models/userModel');
const Trip = require('./models/tripModel');
const Itinerary = require('./models/itineraryModel');
const Stop = require('./models/stopsModel');
const Activity = require('./models/activityModel');

// Import controllers
const userController = require('./controllers/userController');
const tripController = require('./controllers/tripController');
const itineraryController = require('./controllers/itineraryController');
const stopController = require('./controllers/stopsController');
const activityController = require('./controllers/activityController');

// Define all model associations after models are loaded
Trip.hasOne(Itinerary, { foreignKey: 'trip_id' });
Itinerary.belongsTo(Trip, { foreignKey: 'trip_id' });
Itinerary.hasMany(Stop, { foreignKey: 'itinerary_id' });
Stop.belongsTo(Itinerary, { foreignKey: 'itinerary_id' });
Stop.hasMany(Activity, { foreignKey: 'stop_id' });
Activity.belongsTo(Stop, { foreignKey: 'stop_id' });

require('dotenv').config();

const app = express();

console.log('--- SERVER STARTING WITH LATEST ROUTE CONFIG ---');

// Configure CORS with specific origin
app.use(cors({
  origin: 'http://localhost:5179',
  credentials: true
}));

app.use(express.json());

// Add comprehensive logging middleware
app.use((req, res, next) => {
  console.log(`\n=== INCOMING REQUEST ===`);
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.originalUrl}`);
  console.log(`Path: ${req.path}`);
  console.log(`Body:`, req.body);
  console.log(`========================\n`);
  next();
});

console.log('🔧 Setting up routes...');

// Simple test route first
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// User CRUD Routes
console.log('📝 Setting up user routes...');
app.post('/users', userController.createUser);
app.get('/users', userController.getUsers);
app.get('/users/:id', userController.getUserById);
app.put('/users/:id', userController.updateUser);
app.delete('/users/:id', userController.deleteUser);

// Trip CRUD Routes
app.post('/trips', tripController.createTrip);
app.get('/trips', tripController.getAllTrips);
app.get('/trips/user/:userId', tripController.getTripsByUserId);
app.get('/trips/:id', tripController.getTripById);
app.put('/trips/:id', tripController.updateTrip);
app.delete('/trips/:id', tripController.deleteTrip);

// Test route for debugging
app.post('/test', (req, res) => {
  console.log('🔥 TEST ROUTE HIT!');
  res.json({ message: 'Test route working!' });
});

// Itinerary CRUD Routes
console.log('🎯 Setting up itinerary routes...');
app.post('/itineraries', (req, res, next) => {
  console.log('🎯 ITINERARY ROUTE HIT!');
  next();
}, itineraryController.createItinerary);
app.get('/itineraries', itineraryController.getAllItineraries);
app.get('/itineraries/:id', itineraryController.getItineraryById);
app.put('/itineraries/:id', itineraryController.updateItinerary);
app.delete('/itineraries/:id', itineraryController.deleteItinerary);

// Stop CRUD Routes
app.post('/stops', stopController.createStop);
app.get('/stops', stopController.getAllStops);
app.get('/stops/:id', stopController.getStopById);
app.put('/stops/:id', stopController.updateStop);
app.delete('/stops/:id', stopController.deleteStop);

// Activity CRUD Routes
app.post('/activities', activityController.createActivity);
app.get('/activities', activityController.getAllActivities);
app.get('/activities/:id', activityController.getActivityById);
app.put('/activities/:id', activityController.updateActivity);
app.delete('/activities/:id', activityController.deleteActivity);

// Sync DB before starting the server
// Using force: true to recreate tables and match updated schema (removes city column)
sequelize.sync({ force: true })
    .then(async () => {
        console.log('Database connected & synced (tables recreated)');
        
        // Create a default user for development
        const User = require('./models/userModel');
        try {
            await User.create({
                user_id: "b42c2100-c448-43ca-9cfb-520e5ec45d50",
                firstname: "Test",
                lastname: "User",
                email: "test@example.com",
                contact: "1234567890",
                city: "Test City",
                country: "Test Country"
            });
            console.log('✅ Default test user created');
        } catch (error) {
            console.log('⚠️ Default user creation failed (may already exist):', error.message);
        }
    })
    .catch(err => console.error('Error syncing DB:', err));

// Catch-all middleware for logging unmatched routes
// This must be after all other routes and middleware
app.use((req, res, next) => {
  console.log(`--- UNMATCHED ROUTE LOG --- Method: ${req.method}, URL: ${req.originalUrl}`);
  // Pass to a final error handler or send response
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
