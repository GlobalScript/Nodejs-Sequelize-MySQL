const {Model} = require('sequelize');
const {OrderStatus} = require('../config/constants');

module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            Order.hasMany(models.order_item);
            Order.belongsTo(models.user, {
                onDelete: 'CASCADE',
            });

        }
    }

    Order.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        totalPrice: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        deliveryDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM(
                OrderStatus.PENDING,
                OrderStatus.ORDERED,
                OrderStatus.SHIPPED,
                OrderStatus.DELIVERED,
                OrderStatus.CANCELLED),
            defaultValue: OrderStatus.PENDING,
            allowNull: false,
        },
    }, {sequelize, modelName: 'order'});
    return Order;
}
