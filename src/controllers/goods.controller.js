const db = require('../models/index');

exports.createProduct = async (req, res) => {
    try {
        const {title, price, discount, description, image, category, popular, isNew} = req.body;
        if (!title || !price || !description || !category) {
            return res.status(400).json({error: "Product properties such as title, price, description, and category must be provided."});
        }
        let finalPrice = price;
        if (discount && discount > 0) {
            finalPrice = ((price * (100 - discount)) / 100);
            finalPrice = Math.round(finalPrice * 100) / 100;
        }
        const product = await db.goods.create({
            title,
            price,
            finalPrice,
            discount,
            description,
            image,
            category,
            popular,
            isNew
        });
        return res.status(201).json(product);
    } catch (error) {
        return res.status(500).json({error: "Could not create product"});
    }
};

exports.updateProduct = async (req, res) => {
    const {title, price, discount, description, image, category, popular, isNew, productId} = req.body;
    if (!title || !price || !description || !category || !productId) {
        return res.status(400).json({error: "Product properties such as title, price, description, productId, and category must be provided."});
    }
    try {
        let finalPrice = price;
        if (discount && discount > 0) {
            finalPrice = Math.round(((price * (100 - discount)) / 100) * 20) / 20;
            finalPrice = parseFloat(finalPrice.toFixed(2));
        }
        const product = await db.goods.findByPk(productId);
        if (!product) {
            return res.status(400).send({error: 'Product not found'});
        }
        const updatedProduct = await product.update({
            title,
            price,
            discount,
            finalPrice,
            description,
            image,
            category,
            popular,
            isNew
        });
        return res.status(200).json(updatedProduct);
    } catch (error) {
        return res.status(500).json({error: "Could not update product"});
    }
};

exports.deleteProductById = async (req, res) => {
    const {productId} = req.body;
    if (!productId) {
        return res.status(400).json({error: 'Product ID is missing'});
    }
    try {
        const product = await db.goods.findByPk(productId);
        if (!product) {
            return res.status(400).send({error: 'Product not found'});
        }
        await product.destroy();
        return res.status(200).json({message: "Product deleted successfully"});
    } catch (error) {
        return res.status(500).json({error: "Could not delete product"});
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await db.goods.findAll();
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({error: "Could not fetch products"});
    }
};

exports.getProductsByCategory = async (req, res) => {
    const category = req.params.category;
    if (!category) {
        return res.status(400).json({error: 'Category is missing'});
    }
    try {
        const products = await db.goods.findAll({where: {category}});
        return res.json(products);
    } catch (error) {
        return res.status(500).json({error: 'Internal server error'});
    }
};

exports.getProductsByPriceAsc = async (req, res) => {
    const category = req.params.category;
    try {
        let products;
        if (category) {
            products = await db.goods.findAll({
                where: {category},
                order: [['finalPrice', 'ASC']]
            });
        } else {
            products = await db.goods.findAll({
                order: [['finalPrice', 'ASC']]
            });
        }
        return res.json(products);
    } catch (error) {
        return res.status(500).json({error: 'Internal server error'});
    }
};

exports.getProductsByPriceDesc = async (req, res) => {
    const category = req.params.category;
    try {
        let products;
        if (category) {
            products = await db.goods.findAll({
                where: {category},
                order: [['finalPrice', 'DESC']]
            });
        } else {
            products = await db.goods.findAll({
                order: [['finalPrice', 'DESC']]
            });
        }
        return res.json(products);
    } catch (error) {
        return res.status(500).json({error: 'Internal server error'});
    }
};

