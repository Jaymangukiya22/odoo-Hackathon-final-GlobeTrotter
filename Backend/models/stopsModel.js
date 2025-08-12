const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Itinerary = require('./itineraryModel');

const Stop = sequelize.define('Stop', {
    stop_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    itinerary_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Itinerary,
            key: 'itinerary_id'
        }
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    start_date: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    end_date: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'stops',
    timestamps: true,
});

// Define association
Itinerary.hasMany(Stop, { foreignKey: 'itinerary_id' });
Stop.belongsTo(Itinerary, { foreignKey: 'itinerary_id' });

module.exports = Stop;
