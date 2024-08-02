const express = require('express');
const {
    createProduct, updateProduct, getAllProducts, deleteProductById, getProductsByCategory, getProductsByPriceAsc,
    getProductsByPriceDesc
} = require("../controllers/goods.controller");

const {authMiddleware} = require("../middlewares/auth.middleware");
const {Roles} = require('../config/constants');
const {accessRole} = require("../middlewares/role.middleware");

const router = express.Router();

router.get('/all-products', getAllProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/asc/:category?', getProductsByPriceAsc);
router.get('/desc/:category?', getProductsByPriceDesc);

router.post('/create-product', authMiddleware, accessRole(Roles.ADMIN), createProduct);
router.put('/edit-product', authMiddleware, accessRole(Roles.ADMIN), updateProduct);
router.delete('/delete-product', authMiddleware, accessRole(Roles.ADMIN), deleteProductById);

module.exports = router;
