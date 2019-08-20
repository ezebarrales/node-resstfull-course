const express = require('express');
const _ = require('underscore');
const Category = require('./../models/category');
const { validateToken, validateAdmin } = require('./../middleware/authentication');

const app = express();

app.post('/category', validateToken, (req, res) => {

    const { body, user } = req;
    const { description } = body;

    let category = new Category({
        description,
        user
    });

    category.save((err, category) => {

        if(err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        return res.status(201).json({
            ok: true,
            category
        });

    });

});

app.put('/category/:id', [validateToken, validateAdmin], (req, res) => {

    const { body, params } = req;
    const { id } = params;

    let changes = _.pick(body, [
        'description'
    ]);

    const findOptions = {
        new: true,
        runValidators: true,
        context: 'query'
    };

    Category.findByIdAndUpdate(id, changes, findOptions, (err, category) => {

        if(err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        return res.json({
            ok: true,
            category
        });

    });

});

app.get('/category', validateToken, (req, res) => {

    let { from, limit } = req.query;
    from = Number(from) || 0;
    limit = Number(limit) || 5;

    Category.find({})
        .skip(from)
        .limit(limit)
        .sort('description')
        .populate('user', 'name email')
        .exec((err, categories) => {

            if(err) {
                return res.status(400).json({
                    ok: false,
                    error: err
                });
            }

            Category.countDocuments({}, (err, count) => {

                if(err) {
                    return res.status(400).json({
                        ok: false,
                        error: err
                    });
                }

                res.json({
                    ok: true,
                    categories,
                    total: count
                });
            });

        });

});

app.get('/category/:id', validateToken, (req, res) => {

    const { params } = req;
    const { id } = params;

    Category.findById(id)
    .populate('user')
    .exec((err, category) => {

        if(err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        return res.json({
            ok: true,
            category
        });

    });
});

app.delete('/category/:id', [validateToken, validateAdmin], (req, res) => {

    const { params } = req;
    const { id } = params;

    Category.findByIdAndRemove(id, (err, category) => {

        if(err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        if(!category) {
            return res.status(400).json({
                ok: false,
                message: "La categoría no existe"
            });
        }

        return res.json({
            ok: true,
            category
        });

    });

});


module.exports = app;