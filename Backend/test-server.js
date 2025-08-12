const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');

// Import models for database operations
const User = require('./models/userModel');
const Trip = require('./models/tripModel');
const Itinerary = require('./models/itineraryModel');
const Stop = require('./models/stopsModel');
const Activity = require('./models/activityModel');

require('dotenv').config();

const app = express();

// Define model associations
Trip.hasOne(Itinerary, { foreignKey: 'trip_id' });
Itinerary.belongsTo(Trip, { foreignKey: 'trip_id' });
Itinerary.hasMany(Stop, { foreignKey: 'itinerary_id' });
Stop.belongsTo(Itinerary, { foreignKey: 'itinerary_id' });
Stop.hasMany(Activity, { foreignKey: 'stop_id' });
Activity.belongsTo(Stop, { foreignKey: 'stop_id' });

// Basic middleware
app.use(cors({
  origin: 'http://localhost:5174', // Fixed: frontend is running on 5174
  credentials: true
}));
app.use(express.json());

// Simple test routes
app.get('/health', (req, res) => {
  console.log('✅ Health route hit!');
  res.json({ status: 'OK', message: 'Server is running' });
});

app.post('/test-itineraries', (req, res) => {
  console.log('✅ Test itinerary route hit!');
  res.json({ message: 'Test itinerary route working', data: req.body });
});

// Add actual routes that frontend expects - WITH REAL DATABASE

// GET routes for fetching data
app.get('/trips', async (req, res) => {
  console.log('\n📋 === GET ALL TRIPS REQUEST (REAL DATABASE) ===');
  console.log('✅ Get trips route hit!');
  
  try {
    const trips = await Trip.findAll();
    console.log(`✅ Found ${trips.length} trips in database`);
    console.log('📤 Response Data:', JSON.stringify(trips, null, 2));
    console.log('=== END GET TRIPS ===\n');
    
    res.json(trips);
  } catch (error) {
    console.error('❌ Get trips failed:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/itineraries', async (req, res) => {
  console.log('\n🎯 === GET ALL ITINERARIES REQUEST (REAL DATABASE) ===');
  console.log('✅ Get itineraries route hit!');
  
  try {
    const itineraries = await Itinerary.findAll();
    console.log(`✅ Found ${itineraries.length} itineraries in database`);
    console.log('📤 Response Data:', JSON.stringify(itineraries, null, 2));
    console.log('=== END GET ITINERARIES ===\n');
    
    res.json(itineraries);
  } catch (error) {
    console.error('❌ Get itineraries failed:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/stops', async (req, res) => {
  console.log('\n🛑 === GET ALL STOPS REQUEST (REAL DATABASE) ===');
  console.log('✅ Get stops route hit!');
  
  try {
    const stops = await Stop.findAll();
    console.log(`✅ Found ${stops.length} stops in database`);
    console.log('📤 Response Data:', JSON.stringify(stops, null, 2));
    console.log('=== END GET STOPS ===\n');
    
    res.json(stops);
  } catch (error) {
    console.error('❌ Get stops failed:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/activities', async (req, res) => {
  console.log('\n🎪 === GET ALL ACTIVITIES REQUEST (REAL DATABASE) ===');
  console.log('✅ Get activities route hit!');
  
  try {
    const activities = await Activity.findAll();
    console.log(`✅ Found ${activities.length} activities in database`);
    console.log('📤 Response Data:', JSON.stringify(activities, null, 2));
    console.log('=== END GET ACTIVITIES ===\n');
    
    res.json(activities);
  } catch (error) {
    console.error('❌ Get activities failed:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/trips', async (req, res) => {
  console.log('\n🚀 === TRIP CREATION REQUEST (REAL DATABASE) ===');
  console.log('✅ Trip creation route hit!');
  console.log('📋 Request Headers:', req.headers);
  console.log('📦 Request Body:', JSON.stringify(req.body, null, 2));
  console.log('🔍 Body Keys:', Object.keys(req.body));
  console.log('📊 Body Values:', Object.values(req.body));
  
  try {
    // Create REAL trip in database
    const trip = await Trip.create(req.body);
    const responseData = trip.toJSON();
    
    console.log('✅ REAL TRIP CREATED IN DATABASE!');
    console.log('📤 Response Data:', JSON.stringify(responseData, null, 2));
    console.log('=== END TRIP CREATION ===\n');
    
    res.json(responseData);
  } catch (error) {
    console.error('❌ Trip creation failed:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/itineraries', async (req, res) => {
  console.log('\n🎯 === ITINERARY CREATION REQUEST (REAL DATABASE) ===');
  console.log('✅ Itinerary creation route hit!');
  console.log('📋 Request Headers:', req.headers);
  console.log('📦 Request Body:', JSON.stringify(req.body, null, 2));
  console.log('🔍 Body Keys:', Object.keys(req.body));
  console.log('📊 Body Values:', Object.values(req.body));
  
  try {
    // Create REAL itinerary in database
    const itinerary = await Itinerary.create(req.body);
    const responseData = itinerary.toJSON();
    
    console.log('✅ REAL ITINERARY CREATED IN DATABASE!');
    console.log('📤 Response Data:', JSON.stringify(responseData, null, 2));
    console.log('=== END ITINERARY CREATION ===\n');
    
    res.json(responseData);
  } catch (error) {
    console.error('❌ Itinerary creation failed:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/stops', async (req, res) => {
  console.log('\n🛑 === STOP CREATION REQUEST (REAL DATABASE) ===');
  console.log('✅ Stop creation route hit!');
  console.log('📋 Request Headers:', req.headers);
  console.log('📦 Request Body:', JSON.stringify(req.body, null, 2));
  console.log('🔍 Body Keys:', Object.keys(req.body));
  console.log('📊 Body Values:', Object.values(req.body));
  
  try {
    // Create REAL stop in database
    const stop = await Stop.create(req.body);
    const responseData = stop.toJSON();
    
    console.log('✅ REAL STOP CREATED IN DATABASE!');
    console.log('📤 Response Data:', JSON.stringify(responseData, null, 2));
    console.log('=== END STOP CREATION ===\n');
    
    res.json(responseData);
  } catch (error) {
    console.error('❌ Stop creation failed:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/activities', async (req, res) => {
  console.log('\n🎪 === ACTIVITY CREATION REQUEST (REAL DATABASE) ===');
  console.log('✅ Activity creation route hit!');
  console.log('📋 Request Headers:', req.headers);
  console.log('📦 Request Body:', JSON.stringify(req.body, null, 2));
  console.log('🔍 Body Keys:', Object.keys(req.body));
  console.log('📊 Body Values:', Object.values(req.body));
  
  try {
    // Create REAL activity in database
    const activity = await Activity.create(req.body);
    const responseData = activity.toJSON();
    
    console.log('✅ REAL ACTIVITY CREATED IN DATABASE!');
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

const PORT = 3001;

// Database sync and server start
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
      console.log(`🚀 Test Server with REAL DATABASE running on port ${PORT}`);
      console.log('📋 Routes with REAL DATABASE PERSISTENCE:');
      console.log('   GET /trips - Fetches all trips from database');
      console.log('   POST /trips - Creates real trip in database');
      console.log('   GET /itineraries - Fetches all itineraries from database');
      console.log('   POST /itineraries - Creates real itinerary in database');
      console.log('   GET /stops - Fetches all stops from database');
      console.log('   POST /stops - Creates real stop in database');
      console.log('   GET /activities - Fetches all activities from database');
      console.log('   POST /activities - Creates real activity in database');
      console.log('✨ Ready for requests with database persistence!');
    });
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  });
