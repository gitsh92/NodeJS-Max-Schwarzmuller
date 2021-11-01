const { Router } = require('express');
const adminData = require('./admin');

const router = Router();

router.get('/', (req, res, next) => {
    res.render('shop',
        {
            products: adminData.products,
            title: 'Shop',
            path: '/'
        });
});

module.exports = router;