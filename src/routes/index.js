const express = require('express');
const authRoute = require("./auth.route");
const userRoute =  require("./user.route");
const roleRoute = require("./role.route");
const goodsRoute = require("./goods.router");
const basketRoute = require("./basket.route");
const orderRoute = require("./order.route");

const {authMiddleware} = require("../middlewares/auth.middleware");

const router = express.Router();

router.use('/auth', authRoute);
router.use('/goods', goodsRoute);

router.use('/user', authMiddleware, userRoute);
router.use('/role', authMiddleware, roleRoute);
router.use('/basket', authMiddleware, basketRoute);
router.use('/orders', authMiddleware, orderRoute);

module.exports = router;
