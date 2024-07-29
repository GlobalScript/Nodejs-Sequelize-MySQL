const db = require('../models/index');
const OrderStatus = require('../config/constants');

exports.createOrder = async (req, res) => {
    const userId = req.userId;
    const {deliveryDate} = req.body;
    if (!deliveryDate) {
        return res.status(400).json({error: "property deliveryDate is required"});
    }
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(deliveryDate)) {
        return res.status(400).json({error: "Invalid date format. Date should be in format 'YYYY-MM-DD'"});
    }
    const currentDate = new Date();
    const selectedDate = new Date(deliveryDate);
    if (selectedDate < currentDate) {
        return res.status(400).json({error: "Order date cannot be in the past"});
    }
    try {
        const basket = await db.basket.findOne({
            where: { userId },
            include: [{
                model: db.goods,
                attributes: {
                    include: [[db.sequelize.literal('ROUND(finalPrice * quantity, 2)'), 'subtotal']]
                },
                through: {
                    attributes: ['quantity']
                }
            }]
        });
        if (!basket || !basket.goods.length) {
            return res.status(400).json({error: 'Basket is empty'});
        }
        let totalPrice = basket.goods.reduce((acc, item) => {
            acc += parseFloat(item.dataValues.subtotal);
            return acc;
        }, 0);
        const order = await db.order.create({
            userId,
            totalPrice,
            deliveryDate,
            status: OrderStatus.ORDERED,
        });
        for (const item of basket.goods) {
            await db.order_item.create({
                productId: item.id,
                orderId: order.id,
                title: item.title,
                image: item.image,
                quantity: item.basket_product.quantity,
                price: item.finalPrice,
            });
        }
        await db.basket.destroy({where: {userId}});
        res.status(201).json({message: 'Order created successfully'});
    } catch (error) {
        res.status(500).json({message: 'Internal server error', error});
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await db.order.findAll({
            include: [
                {
                    model: db.order_item,
                },
                {
                    model: db.user,
                    attributes: ['firstname', 'lastname', 'phone']
                }
            ],
            order: [['createdAt', 'DESC']],
        });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
};

exports.getOrdersByUserId = async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({error: "userId is required"});
    }
    try {
        const orders = await db.order.findAll({
            where: { userId },
            include: [
                {
                    model: db.order_item,
                },
                {
                    model: db.user,
                    attributes: ['firstname', 'lastname', 'phone']
                }
            ]
        });
        if (!orders.length) {
            return res.status(404).json({ message: 'No orders found for this user' });
        }
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
};
