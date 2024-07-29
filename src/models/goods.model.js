const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Goods extends Model {

        static associate(models) {
            Goods.belongsToMany(models.basket, { through: 'basket_product' });
        }
    }
    Goods.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                isFloat: {
                    msg: "Price must be a valid number"
                }
            }
        },
        finalPrice: {
            type: DataTypes.FLOAT,
            validate: {
                isFloat: {
                    msg: "Final price must be a valid number"
                }
            }
        },
        discount: {
            type: DataTypes.FLOAT,
            validate: {
                isFloat: {
                    msg: "Discount must be a valid number"
                },
                min: {
                    args: [0],
                    msg: "Discount must be a positive number or null"
                }
            }
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING,
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        popular: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        isNew: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    }, {
        sequelize,
        modelName: 'goods',
    });
    return Goods;
};
