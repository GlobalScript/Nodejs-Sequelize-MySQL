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
        throw new Error('Internal server error');
    }
};

exports.addToBasket = async (req, res) => {
    const {productId, quantity} = req.body;
    const userId = req.userId;
    if (!productId || !quantity) {
        return res.status(400).send({error: 'Properties such as productId and quantity must be provided'});
    }
    try {
        const product = await db.goods.findByPk(productId);
        if (!product) {
            return res.status(404).json({error: 'Product not found'});
        }
        let basket = await db.basket.findOne({where: {userId}});
        if (!basket) {
            basket = await db.basket.create({userId});
        }
        if (!basket) {
            return res.status(404).json({error: "Basket not found"});
        }
        await basket.addGoods(product, {through: {quantity}});
        basket = await getBasket(userId);
        res.status(200).json({basket});
    } catch (error) {
        res.status(500).json({message: 'Internal server error: addToBasket', error});
    }
};

exports.updateProductQuantityInBasket = async (req, res) => {
    const userId = req.userId;
    const {productId, quantity} = req.body;
    if (!productId || !quantity || quantity < 1) {
        return res.status(400).json({error: "productId and a valid quantity are required"});
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
            return res.status(404).json({error: "Product not found in basket"});
        }
        const product = basket.goods[0];
        if (!product) {
            return res.status(404).json({error: "Product not found in basket"});
        }
        await basket.addGoods(product, {through: {quantity}});
        basket = await getBasket(userId);
        if (!basket) {
            return res.status(404).json({error: "Basket not found"});
        }
        res.status(200).json({basket});
    } catch (error) {
        res.status(500).json({message: "Internal server error", error});
    }
};

exports.deleteProductFromBasket = async (req, res) => {
    const userId = req.userId;
    const {productId} = req.body;
    if (!productId) {
        return res.status(400).json({error: "productId is required"});
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
            return res.status(404).json({error: "Product not found in basket"});
        }
        const product = basket.goods[0];
        if (!product) {
            return res.status(404).json({error: "Product not found in basket"});
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
        res.status(500).json({message: "Internal server error", error});
    }
};

exports.getAuthorizedUserBasket = async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(400).json({error: "userId is required"});
    }
    try {
        const basket = await getBasket(userId);
        if (!basket) {
            return res.status(404).json({error: "Basket not found"});
        }
        res.status(200).json({basket});
    } catch (error) {
        res.status(500).json({message: 'Internal server error', error});
    }
};


