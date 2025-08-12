const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');

// Import models
const User = require('./models/userModel');
const Trip = require('./models/tripModel');
const Itinerary = require('./models/itineraryModel');
const Stop = require('./models/stopsModel');
const Activity = require('./models/activityModel');

require('dotenv').config();

const app = express();

// Basic middleware
app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true
}));
app.use(express.json());

// Define model associations
Trip.hasOne(Itinerary, { foreignKey: 'trip_id' });
Itinerary.belongsTo(Trip, { foreignKey: 'trip_id' });
Itinerary.hasMany(Stop, { foreignKey: 'itinerary_id' });
Stop.belongsTo(Itinerary, { foreignKey: 'itinerary_id' });
Stop.hasMany(Activity, { foreignKey: 'stop_id' });
Activity.belongsTo(Stop, { foreignKey: 'stop_id' });

// Health check
app.get('/health', (req, res) => {
  console.log('✅ Health check hit!');
  res.json({ status: 'OK', message: 'Hybrid server is running with database!' });
});

// Trip creation with real database
app.post('/trips', async (req, res) => {
  console.log('\n🚀 === TRIP CREATION (REAL DATABASE) ===');
  console.log('✅ Trip creation route hit!');
  console.log('📦 Request Body:', JSON.stringify(req.body, null, 2));
  
  try {
    // Create real trip in database
    const trip = await Trip.create(req.body);
    console.log('✅ Trip created in database:', trip.toJSON());
    
    const responseData = trip.toJSON();
    console.log('📤 Response Data:', JSON.stringify(responseData, null, 2));
    console.log('=== END TRIP CREATION ===\n');
    
    res.json(responseData);
  } catch (error) {
    console.error('❌ Trip creation failed:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Itinerary creation with real database
app.post('/itineraries', async (req, res) => {
  console.log('\n🎯 === ITINERARY CREATION (REAL DATABASE) ===');
  console.log('✅ Itinerary creation route hit!');
  console.log('📦 Request Body:', JSON.stringify(req.body, null, 2));
  
  try {
    // Create real itinerary in database
    const itinerary = await Itinerary.create(req.body);
    console.log('✅ Itinerary created in database:', itinerary.toJSON());
    
    const responseData = itinerary.toJSON();
    console.log('📤 Response Data:', JSON.stringify(responseData, null, 2));
    console.log('=== END ITINERARY CREATION ===\n');
    
    res.json(responseData);
  } catch (error) {
    console.error('❌ Itinerary creation failed:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Stop creation with real database
app.post('/stops', async (req, res) => {
  console.log('\n🛑 === STOP CREATION (REAL DATABASE) ===');
  console.log('✅ Stop creation route hit!');
  console.log('📦 Request Body:', JSON.stringify(req.body, null, 2));
  
  try {
    // Create real stop in database
    const stop = await Stop.create(req.body);
    console.log('✅ Stop created in database:', stop.toJSON());
    
    const responseData = stop.toJSON();
    console.log('📤 Response Data:', JSON.stringify(responseData, null, 2));
    console.log('=== END STOP CREATION ===\n');
    
    res.json(responseData);
  } catch (error) {
    console.error('❌ Stop creation failed:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Activity creation with real database
app.post('/activities', async (req, res) => {
  console.log('\n🎪 === ACTIVITY CREATION (REAL DATABASE) ===');
  console.log('✅ Activity creation route hit!');
  console.log('📦 Request Body:', JSON.stringify(req.body, null, 2));
  
  try {
    // Create real activity in database
    const activity = await Activity.create(req.body);
    console.log('✅ Activity created in database:', activity.toJSON());
    
    const responseData = activity.toJSON();
    console.log('📤 Response Data:', JSON.stringify(responseData, null, 2));
    console.log('=== END ACTIVITY CREATION ===\n');
    
    res.json(responseData);
  } catch (error) {
    console.error('❌ Activity creation failed:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 404 handler
app.use((req, res) => {
  console.log(`❌ Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Database sync and server start
const PORT = 3000;

sequelize.sync({ force: true })
  .then(async () => {
    console.log('✅ Database connected & synced (tables recreated)');
    
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
      console.log(`🚀 Hybrid Server running on port ${PORT}`);
      console.log('📋 Routes with REAL DATABASE PERSISTENCE:');
      console.log('   POST /trips - Creates real trip in database');
      console.log('   POST /itineraries - Creates real itinerary in database');
      console.log('   POST /stops - Creates real stop in database');
      console.log('   POST /activities - Creates real activity in database');
      console.log('✨ Ready for requests with database persistence!');
    });
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  });
