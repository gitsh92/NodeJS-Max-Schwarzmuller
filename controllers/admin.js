const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product',
        {
            title: 'Add Product',
            path: '/admin/add-product',
            editing: false
        });
};

exports.postAddProduct = (req, res, next) => {
    const { title, imageUrl, price, description } = req.body;
    const product = new Product(null, title, imageUrl, description, price);
    product.save()
        .then(() => res.redirect('/'))
        .catch(console.log);
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('admin/products',
        {
            products,
            title: 'Admin Products',
            path: '/admin/products'
        });
    });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const { productId } = req.params;
    Product.findById(+productId, product => {
        if (!product) {
            return res.status(404).render('404', { title: 'Page Not Found', path: '/not-found' });
        }
        res.render('admin/edit-product',
        {
            title: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product
        });
    });
};

exports.postEditProduct = (req, res, next) => {
    const {
        productId,
        title: updatedTitle,
        price: updatedPrice,
        imageUrl: updatedImageUrl,
        description: updatedDescription } = req.body;

    const updatedProduct = new Product(+productId, updatedTitle, updatedImageUrl, updatedDescription, updatedPrice);
    updatedProduct.save();

    res.redirect('/admin/products');
};

exports.postDeleteProduct = (req, res, next) => {
    const { productId } = req.body;
    Product.deleteById(+productId);
    res.redirect('/admin/products');
};