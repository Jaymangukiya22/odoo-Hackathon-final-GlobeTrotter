const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');

// Import all models first
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

require('dotenv').config();

const app = express();

console.log('🚀 Starting GlobeTrotter Backend Server...');

// Configure CORS
app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true
}));

app.use(express.json());

// Define model associations
console.log('🔗 Setting up model associations...');
Trip.hasOne(Itinerary, { foreignKey: 'trip_id' });
Itinerary.belongsTo(Trip, { foreignKey: 'trip_id' });
Itinerary.hasMany(Stop, { foreignKey: 'itinerary_id' });
Stop.belongsTo(Itinerary, { foreignKey: 'itinerary_id' });
Stop.hasMany(Activity, { foreignKey: 'stop_id' });
Activity.belongsTo(Stop, { foreignKey: 'stop_id' });

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`\n📡 ${req.method} ${req.originalUrl}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('📦 Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

console.log('🛠️ Setting up routes...');

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'GlobeTrotter Backend is running!' });
});

// User routes
app.post('/users', userController.createUser);
app.get('/users', userController.getUsers);
app.get('/users/:id', userController.getUserById);
app.put('/users/:id', userController.updateUser);
app.delete('/users/:id', userController.deleteUser);

// Trip routes
app.post('/trips', tripController.createTrip);
app.get('/trips', tripController.getAllTrips);
app.get('/trips/user/:userId', tripController.getTripsByUserId);
app.get('/trips/:id', tripController.getTripById);
app.put('/trips/:id', tripController.updateTrip);
app.delete('/trips/:id', tripController.deleteTrip);

// Itinerary routes
app.post('/itineraries', itineraryController.createItinerary);
app.get('/itineraries', itineraryController.getAllItineraries);
app.get('/itineraries/:id', itineraryController.getItineraryById);
app.put('/itineraries/:id', itineraryController.updateItinerary);
app.delete('/itineraries/:id', itineraryController.deleteItinerary);

// Stop routes
app.post('/stops', stopController.createStop);
app.get('/stops', stopController.getAllStops);
app.get('/stops/:id', stopController.getStopById);
app.put('/stops/:id', stopController.updateStop);
app.delete('/stops/:id', stopController.deleteStop);

// Activity routes
app.post('/activities', activityController.createActivity);
app.get('/activities', activityController.getAllActivities);
app.get('/activities/:id', activityController.getActivityById);
app.put('/activities/:id', activityController.updateActivity);
app.delete('/activities/:id', activityController.deleteActivity);

// 404 handler
app.use((req, res) => {
  console.log(`❌ Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Database sync and server start
const PORT = process.env.PORT || 3000;

sequelize.sync({ force: true })
  .then(async () => {
    console.log('✅ Database connected & synced');
    
    // Create default user
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
      console.log('⚠️ Default user creation failed (may already exist)');
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 GlobeTrotter Backend running on port ${PORT}`);
      console.log('📋 Available routes:');
      console.log('   GET  /health');
      console.log('   POST /users, /trips, /itineraries, /stops, /activities');
      console.log('   GET  /users, /trips, /itineraries, /stops, /activities');
      console.log('✨ Ready for requests!');
    });
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  });
