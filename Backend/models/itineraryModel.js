const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Itinerary = sequelize.define('Itinerary', {
    itinerary_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    trip_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'trips',
            key: 'trip_id'
        }
    },
}, {
    tableName: 'itinerary',
    timestamps: true,
});

module.exports = Itinerary;
