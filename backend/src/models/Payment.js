const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Order = require('./Order');

const Payment = sequelize.define('Payment', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Order,
            key: 'id',
        },
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    method: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'payments',
    timestamps: false,
});

Payment.belongsTo(User, { foreignKey: 'user_id' });
Payment.belongsTo(Order, { foreignKey: 'order_id' });

module.exports = Payment;