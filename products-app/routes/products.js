const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const debug = require('debug')('products-app:products');

// Read products data from JSON file
const getProducts = () => {
    const filePath = path.join(__dirname, '../products.json');
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
};

router.get('/', (req, res) => {
    const minPrice = parseFloat(req.query.min_price) || 0;
    let products = getProducts();
    
    // Filter products based on min_price
    products = products.filter(product => product.product_price > minPrice);
    
    // Calculate stock value
    products = products.map(product => {
        return {
            ...product,
            stock_value: product.product_price * product.product_quantity
        };
    });

    debug(`Filtered products: ${JSON.stringify(products)}`);
    
    res.render('products', { products });
});

module.exports = router;
