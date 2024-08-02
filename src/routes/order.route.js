const express = require('express');
const {createOrder, getLastOrderDetails, getAllOrders, getOrdersByUserId} = require("../controllers/order.controller");
const {accessRole} = require("../middlewares/role.middleware");

const router = express.Router();

router.post('/order', createOrder);
router.get('/details/:orderId', getLastOrderDetails);
router.get('/all-orders', accessRole(), getAllOrders);
router.post('/find-order', accessRole(), getOrdersByUserId);

module.exports = router;
