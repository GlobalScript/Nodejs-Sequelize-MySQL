const db = require('../models/index');

const getBasket = async (userId) => {
    try {
        const basket = await db.basket.findOne({
            where: {userId},
            attributes: {
                exclude: ['updatedAt', 'createdAt'],
            },
            include: [
                {
                    model: db.goods,
                    attributes: [
                        'id',
                        'title',
                        'price',
                        'finalPrice',
                        'discount',
                        'description',
                        'image',
                        'category',
                        'popular',
                        'isNew',
                        'createdAt',
                        'updatedAt',
                        [db.sequelize.literal('ROUND(finalPrice * quantity, 2)'), 'subtotal']
                    ],
                    through: {
                        attributes: ['quantity']
                    }
                }]
        });
        if (!basket) {
            return null;
        }
        let totalPrice = basket.goods.reduce((acc, item) => {
            acc += parseFloat(item.dataValues.subtotal);
            return acc;
        }, 0);
        return {...basket.toJSON(), totalPrice};
    } catch (error) {
        throw {message: 'Internal server error: getBasket', error};
    }
};

exports.addToBasket = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.userId;
    if (!productId || !quantity) {
        return res.status(400).send({ message: 'Properties such as productId and quantity must be provided' });
    }
    const parsedQuantity = Number(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
        return res.status(400).send({ message: 'Quantity must be a number greater than 0' });
    }
    try {
        const product = await db.goods.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        let basket = await db.basket.findOne({ where: { userId } });
        if (!basket) {
            basket = await db.basket.create({ userId });
        }
        const basketProduct = await db.basket_product.findOne({
            where: { basketId: basket.id, goodId: productId }
        });
        if (basketProduct) {
            basketProduct.quantity += parsedQuantity;
            await basketProduct.save();
        } else {
            await basket.addGoods(product, { through: { quantity: parsedQuantity } });
        }
        basket = await getBasket(userId);
        if (!basket) {
            return res.status(404).json({ message: 'Basket not found' });
        }
        res.status(200).json({ basket });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error: addToBasket', error });

    }
};

exports.updateProductQuantityInBasket = async (req, res) => {
    const userId = req.userId;
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
        return res.status(400).json({ message: 'productId and quantity are required' });
    }
    const parsedQuantity = Number(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
        return res.status(400).json({ message: 'Quantity must be a number greater than 0' });
    }
    try {
        let basket = await db.basket.findOne({
            where: { userId },
            include: {
                model: db.goods,
                where: { id: productId }
            }
        });
        if (!basket) {
            return res.status(404).json({ message: 'Product not found in basket' });
        }
        const product = basket.goods[0];
        if (!product) {
            return res.status(404).json({ message: 'Product not found in basket' });
        }
        await basket.addGoods(product, { through: { quantity: parsedQuantity } });
        basket = await getBasket(userId);
        if (!basket) {
            return res.status(404).json({ message: 'Basket not found' });
        }
        res.status(200).json({ basket });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error: updateProductQuantityInBasket', error});
    }
};

exports.deleteProductFromBasket = async (req, res) => {
    const userId = req.userId;
    const {productId} = req.body;
    if (!productId) {
        return res.status(400).json({message: "productId is required"});
    }
    try {
        let basket = await db.basket.findOne({
            where: {userId},
            include: {
                model: db.goods,
                where: {id: productId}
            }
        });
        if (!basket) {
            return res.status(404).json({message: "Product not found in basket"});
        }
        const product = basket.goods[0];
        if (!product) {
            return res.status(404).json({message: "Product not found in basket"});
        }
        await basket.removeGoods(product);
        basket = await getBasket(userId);
        if (!basket || basket.goods.length === 0) {
            await db.basket.destroy({
                where: {userId}
            });
            return res.status(200).json({message: "Basket and product removed successfully"});
        }
        res.status(200).json({basket});
    } catch (error) {
        res.status(500).json({ message: "Internal server error: deleteProductFromBasket", error});
    }
};

exports.getAuthorizedUserBasket = async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(400).json({message: "userId is required"});
    }
    try {
        const basket = await getBasket(userId);
        if (!basket) {
            return res.status(404).json({message: "Basket not found"});
        }
        res.status(200).json({basket});
    } catch (error) {
        res.status(500).json({ message: "Internal server error: getAuthorizedUserBasket", error });
    }
};


