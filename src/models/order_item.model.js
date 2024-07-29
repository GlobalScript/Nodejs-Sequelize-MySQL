const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class OrderItem extends Model {

        static associate(models) {
            OrderItem.belongsTo(models.order);
        }
    }
    OrderItem.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        orderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING,
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'order_item',
    });
    return OrderItem;
};
