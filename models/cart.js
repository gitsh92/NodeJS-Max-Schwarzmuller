const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

const filePath = path.join(rootDir, "data", "cart.json");

module.exports = class Cart {
    static addProduct(id, productPrice) {
        // fetch the previous cart
        fs.readFile(filePath, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!err) {
                cart = JSON.parse(fileContent);
            }
            // check to see if product already exists in cart
            const existingProductIndex = cart.products.findIndex(p => p.id === id);
            let updatedProduct;
            if (existingProductIndex > -1) {
                const existingProduct = cart.products[existingProductIndex];
                updatedProduct = { ...existingProduct };
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = {
                    id,
                    qty: 1
                };
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(filePath, JSON.stringify(cart), err => {
                if (err) {
                    console.log(err);
                }
            });
        });
    }

    static deleteProduct(id, productPrice) {
        fs.readFile(filePath, (err, fileContent) => {
            if (err) {
                return;
            }
            const cart = JSON.parse(fileContent);
            const updatedCart = { ...cart };
            const product = updatedCart.products.find(p => p.id === id);
            if (!product) {
                return;
            }
            updatedCart.totalPrice = updatedCart.totalPrice - product.qty * productPrice;
            updatedCart.products = updatedCart.products.filter(p => p.id !== id);
            fs.writeFile(filePath, JSON.stringify(updatedCart), err => {
                if (err) {
                    console.log(err);
                }
            });
        });
    }

    static getCart(cb) {
        fs.readFile(filePath, (err, fileContent) => {
            if (err) {
                cb(null);
            } else {
                const cart = JSON.parse(fileContent);
                cb(cart);
             }
        });
    }
}