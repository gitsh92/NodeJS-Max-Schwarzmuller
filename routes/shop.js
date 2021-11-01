const { Router } = require('express');
const path = require('path');
const rootDir = require('../util/path');
const adminData = require('./admin');

const router = Router();

router.get('/', (req, res, next) => {
    res.render('shop',
        {
            products: adminData.products,
            title: 'Shop',
            path: '/',
            hasProducts: adminData.products.length > 0,
            activeShop: true,
            productCSS: true
        });
});

module.exports = router;