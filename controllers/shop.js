const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render('shop/index', {
        products,
        title: 'All Products',
        path: '/products',
      });
    })
    .catch(console.log);
};

exports.getProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return res
          .status(404)
          .render('404', { title: 'Page Not Found', path: '/not-found' });
      }
      res.render('shop/product-detail', {
        title: product.title,
        path: '/products',
        product,
      });
    })
    .catch(console.log);
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render('shop/index', {
        products,
        title: 'Shop',
        path: '/',
      });
    })
    .catch(console.log);
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then((user) => {
      res.render('shop/cart', {
        title: 'Your Cart',
        path: '/cart',
        products: user.cart.items,
      });
    })
    .catch(console.log);
};

exports.postCart = (req, res, next) => {
  let { productId } = req.body;
  Product.findById(productId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(console.log);
};

exports.postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  req.user
    .removeFromCart(productId)
    .then((result) => {
      res.redirect('/cart');
    })
    .catch(console.log);
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then((orders) => {
      res.render('shop/orders', {
        title: 'Your Orders',
        path: '/orders',
        orders,
      });
    })
    .catch(console.log);
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return {
          quantity: i.quantity,
          product: { ...i.productId._doc },
        };
      });

      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user,
        },
        products,
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then((result) => {
      res.redirect('/orders');
    })
    .catch(console.log);
};
