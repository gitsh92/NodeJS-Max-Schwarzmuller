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
    const product = new Product(title, price, description, imageUrl, null, req.user._id);
    product.save()
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(console.log);
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
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
    Product.findById(productId)
        .then(product => {
            if (!product) {
                return res.status(404).render('404', { title: 'Page Not Found', path: '/not-found' });
            }
            res.render('admin/edit-product',
            {
                title: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product
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

    const product  = new Product(
        updatedTitle,
        updatedPrice,
        updatedDescription,
        updatedImageUrl,
        productId
    );
    return product.save()
        .then(result => {
            console.log('Updated product');
            res.redirect('/admin/products');
        })
        .catch(console.log);
};

exports.postDeleteProduct = (req, res, next) => {
    const { productId } = req.body;
    Product.deleteById(productId) 
        .then(() => {
            console.log('Destroyed product');
            res.redirect('/admin/products');
        })
        .catch(console.log);
};