const express = require('express');
const {
    addToBasket, getAuthorizedUserBasket, updateProductQuantityInBasket, deleteProductFromBasket
} = require("../controllers/basket.controller");



const router = express.Router();

router.get('/auth-user', getAuthorizedUserBasket);
router.post('/add-product', addToBasket);
router.delete('/remove-product', deleteProductFromBasket);
router.put('/update-quantity', updateProductQuantityInBasket);


module.exports = router;
