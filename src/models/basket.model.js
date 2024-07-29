const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Basket extends Model {
        static associate(models) {
            Basket.belongsToMany(models.goods, {through: 'basket_product'});
            Basket.belongsTo(models.user, {
                onDelete: 'CASCADE',
            });
        }
    }

    Basket.init({}, {sequelize, modelName: 'basket'});
    return Basket;
}
