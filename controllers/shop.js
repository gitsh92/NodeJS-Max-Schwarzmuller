const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/product-list',
        {
            products,
            title: 'All Products',
            path: '/products'
        });
    });
};

exports.getProduct = (req, res, next) => {
    const { productId } = req.params;
    Product.findById(+productId, product => {
        if (!product)
            return res.status(404).render('404', { title: 'Page Not Found', path: '/not-found' });
            
            res.render('shop/product-detail', { title: product.title, path: '/products', product });
        });
}

exports.getIndex = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/index',
        {
            products,
            title: 'Shop',
            path: '/'
        });
    });
};

exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (let product of products) {
                const cartProductData = cart.products.find(p => p.id === product.id);
                if (cartProductData) {
                    cartProducts.push({ productData: product, qty: cartProductData.qty});
                }
            }
            res.render('shop/cart', {
                title: 'Your Cart',
                path: '/cart',
                products: cartProducts
            }); 
        });
    });
};

exports.postCart = (req, res, next) => {
    const { productId } = req.body;
    Product.findById(+productId, product => {
        Cart.addProduct(+productId, product.price);
    });
    res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
    const { productId } = req.body;
    Product.findById(+productId, product => {
        Cart.deleteProduct(+productId, product.price);
        res.redirect('/cart');
    });
};

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        title: 'Your Orders',
        path: '/orders'
    });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        title: 'Checkout',
        path: '/checkout'
    })
};