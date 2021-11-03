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
    req.user.createProduct({
        title,
        price,
        imageUrl,
        description
    })
    .then(result => {
        console.log('Created product');
        res.redirect('/admin/products');
    })
    .catch(console.log);
};

exports.getProducts = (req, res, next) => {
    req.user.getProducts()
        .then(products => { 
            res.render('admin/products',
            {
                products,
                title: 'Admin Products',
                path: '/admin/products'
            });
        })
        .catch(console.log);
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const { productId } = req.params;
    req.user.getProducts({ where: { id: +productId } })
        .then (products => {
            if (!products.length) {
                return res.status(404).render('404', { title: 'Page Not Found', path: '/not-found' });
            }
            res.render('admin/edit-product',
            {
                title: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: products[0]
            });
        })
        .catch(console.log);
};

exports.postEditProduct = (req, res, next) => {
    const {
        productId,
        title: updatedTitle,
        price: updatedPrice,
        imageUrl: updatedImageUrl,
        description: updatedDescription } = req.body;

    Product.findByPk(+productId)
        .then(product => {
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.imageUrl = updatedImageUrl;
            product.description = updatedDescription;
            return product.save();
        })
        .then(result => {
            console.log('Updated product');
            res.redirect('/admin/products');
        })
        .catch(console.log);
};

exports.postDeleteProduct = (req, res, next) => {
    const { productId } = req.body;
    Product.findByPk(+productId) 
        .then(product => {
            return product.destroy();
        })
        .then(result => {
            console.log('Destroyed product');
            res.redirect('/admin/products');
        })
        .catch(console.log);
};