const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Stop = require('./stopsModel');
const { time } = require('console');

const Activity = sequelize.define('Activity', {
    activity_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    stop_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Stop,
            key: 'stop_id'
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    time: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    notes: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    
}, {
    tableName: 'activities',
    timestamps: true,
});

// Define association
Activity.belongsTo(Stop, { foreignKey: 'stop_id' });
Stop.hasMany(Activity, { foreignKey: 'stop_id' });

module.exports = Activity;
