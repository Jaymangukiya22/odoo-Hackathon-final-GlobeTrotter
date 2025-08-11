const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./userModel');

const Trip = sequelize.define('Trip', {
    trip_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    trip_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id'
        }
    },
    travel_dates: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    budget: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    travelers: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1,
    },
    trip_type: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'leisure',
    },
}, {
    tableName: 'trips',
    timestamps: true,
});

// Define association
Trip.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Trip, { foreignKey: 'user_id' });

module.exports = Trip;
