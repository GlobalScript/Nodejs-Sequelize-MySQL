'use strict';

const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class BasketProduct extends Model {

        static associate(models) {

        }
    }

    BasketProduct.init({
            quantity: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'basket_product',
        });
    return BasketProduct;
};
