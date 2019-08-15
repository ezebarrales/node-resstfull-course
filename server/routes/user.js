const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('./../models/user');

const app = express();

app.get('/user', (req, res) => {
    
    let { from, limit } = req.query;
    from = Number(from) || 0;
    limit = Number(limit) || 5;

    const conditions = {
        status: true,
    };

    User.find(conditions)
        .skip(from)
        .limit(limit)
        .exec((err, users) => {

            if(err) {
                return res.status(400).json({
                    ok: false,
                    error: err
                });
            }

            User.count({}, (err, count) => {

                if(err) {
                    return res.status(400).json({
                        ok: false,
                        error: err
                    });
                }

                res.json({
                    ok: true,
                    users,
                    total: count
                });
            });

        });

    

});

app.post('/user', (req, res) => {

    const { body } = req;
    let { name, email, password, role } = body;

    password = bcrypt.hashSync(password, 10);

    let user = new User({
        name,
        email,
        password,
        role,
    });

    user.save((err, user) => {

        if(err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        return res.status(201).json({
            ok: true,
            user
        });

    });
});

app.put('/user/:id', (req, res) => {

    const { id } = req.params;
    const { body } = req;
    let user = _.pick(body, [
        'name',
        'email',
        'img',
        'status',
        'role'
    ]);

    const findOptions = {
        new: true,
        runValidators: true,
        context: 'query'
    };

    User.findByIdAndUpdate(id, change, findOptions, (err, user) => {

        if(err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        return res.json({
            ok: true,
            user
        });

    });
});

// Eliminando un registro
/*app.delete('/user/:id', (req, res) => {
    
    const { id } = req.params;

    User.findByIdAndRemove(id, (err, user) => {

        if(err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        if(!user) {
            return res.status(400).json({
                ok: false,
                message: "El usuario no existe"
            });
        }

        return res.json({
            ok: true,
            user
        });

    });
});*/

// Cambiar estado a false para ocultar el registro
app.delete('/user/:id', (req, res) => {
    
    const { id } = req.params;

    const findOptions = {
        new: true,
    };

    const changes = {
        status: false,
    }


    User.findByIdAndUpdate(id, changes, findOptions, (err, user) => {

        if(err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        if(!user) {
            return res.status(400).json({
                ok: false,
                message: "El usuario no existe"
            });
        }

        return res.json({
            ok: true,
            user
        });

    });
});

module.exports = app;