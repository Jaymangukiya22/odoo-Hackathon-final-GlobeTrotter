const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const User = require('./models/userModel');
const userController = require('./controllers/userController');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// CRUD Routes
app.post('/users', userController.createUser);
app.get('/users', userController.getUsers);
app.get('/users/:id', userController.getUserById);
app.put('/users/:id', userController.updateUser);
app.delete('/users/:id', userController.deleteUser);

// Sync DB and Start Server
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database connected & synced');
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    })
    .catch(err => console.error('Error syncing DB:', err));
