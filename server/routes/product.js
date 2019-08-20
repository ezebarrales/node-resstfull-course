const express = require('express');
const _ = require('underscore');
const Product = require('./../models/product');
const { validateToken } = require('./../middleware/authentication');

const app = express();

app.post('/product', validateToken, (req, res) => {

    const { body, user } = req;
    let { name, price, description, status, category  } = body;

    let product = new Product({
        name,
        price,
        description,
        status,
        category,
        user
    });

    product.save((err, product) => {

        if(err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        return res.status(201).json({
            ok: true,
            product
        });

    });

});

app.put('/product/:id', validateToken, (req, res) => {

    const { body, params } = req;
    const { id } = params;

    let changes = _.pick(body, [
        'name',
        'price',
        'description',
        'status',
        'category',
        'user'
    ]);

    const findOptions = {
        new: true,
        runValidators: true,
        context: 'query'
    };

    Product.findByIdAndUpdate(id, changes, findOptions, (err, product) => {

        if(err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        return res.json({
            ok: true,
            product
        });

    });

});

app.get('/product', validateToken, (req, res) => {

    let { from, limit, search } = req.query;
    from = Number(from) || 0;
    limit = Number(limit) || 5;

    const conditions = {
        status: true
    };

    let products = Product.find(conditions)
        .skip(from)
        .limit(limit)
        .populate('user')
        .populate('category');

    if(search) {
        search = new RegExp(search, 'i');
        products.and({
            name: search
        });
    }

    products.exec((err, products) => {

            if(err) {
                return res.status(400).json({
                    ok: false,
                    error: err
                });
            }

            Product.countDocuments({}, (err, count) => {

                if(err) {
                    return res.status(400).json({
                        ok: false,
                        error: err
                    });
                }

                res.json({
                    ok: true,
                    products,
                    total: count
                });
            });

        });

});

app.get('/product/:id', (req, res) => {

    const { params } = req;
    const { id } = params;

    Product.findById(id)
    .populate('user')
    .populate('category')
    .exec((err, product) => {

        if(err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        return res.json({
            ok: true,
            product
        });

    });

});

app.delete('/product/:id', (req, res) => {

    const { id } = req.params;

    const findOptions = {
        new: true,
    };

    const changes = {
        status: false,
    }


    Product.findByIdAndUpdate(id, changes, findOptions, (err, product) => {

        if(err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        if(!product) {
            return res.status(400).json({
                ok: false,
                message: "El producto no existe"
            });
        }

        return res.json({
            ok: true,
            product
        });

    });

});

module.exports = app;