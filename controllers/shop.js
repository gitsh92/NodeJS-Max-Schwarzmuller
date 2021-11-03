const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/index',
                {
                    products,
                    title: 'All Products',
                    path: '/products'
                }
            );
        })
        .catch(console.log);
};

exports.getProduct = (req, res, next) => {
    const { productId } = req.params;
    Product.findByPk(+productId)
        .then(product => {
            if (!product) {
                return res.status(404).render('404', { title: 'Page Not Found', path: '/not-found' });
            }
            res.render('shop/product-detail', { title: product.title, path: '/products', product });
        })
        .catch(console.log);
}

exports.getIndex = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/index',
                {
                    products,
                    title: 'Shop',
                    path: '/'
                }
            );
        })
        .catch(console.log);
};

exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then(cart => {
            return cart.getProducts();
        })
        .then(products => {
            res.render('shop/cart', {
                title: 'Your Cart',
                path: '/cart',
                products 
            });
        })
        .catch(console.log);
};

exports.postCart = (req, res, next) => {
    let { productId } = req.body;
    productId = +productId;
    let fetchedCart;
    let newQuantity = 1;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: productId } })
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            if (product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product;
            }
            return Product.findByPk(productId);
        })
        .then(product => {
            return fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
        })
        .then(() => res.redirect('/cart'))
        .catch(console.log);
};

exports.postCartDeleteProduct = (req, res, next) => {
    const { productId } = req.body;
    req.user.getCart()
        .then(cart => {
            return cart.getProducts({ where: { id: productId } });
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(console.log);
};

exports.getOrders = (req, res, next) => {
    req.user.getOrders({ include: ['products'] })
        .then(orders => {
            res.render('shop/orders', {
                title: 'Your Orders',
                path: '/orders',
                orders
            });
        })
        .catch(console.log);
};

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            return req.user.createOrder()
                .then(order => {
                    return order.addProducts(products.map(p => {
                        p.orderItem = { quantity: p.cartItem.quantity };
                        return p;
                    }))
                })
                .catch(console.log);
        })
        .then(result => {
            fetchedCart.setProducts(null);
        })
        .then(result => {
            res.redirect('/orders');
        })
        .catch(console.log);
};