const express = require('express');
const bcrypt = require('bcrypt');
const User = require('./../models/user');
const jwt = require('jsonwebtoken');

const app = express();

app.post('/login', (req, res) => {

    let { body } = req;
    let { email, password } = body;

    User.findOne({
        email,
    }, (err, user) => {

        if(err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        }

        if(!user) {
            return res.status(400).json({
                ok: false,
                message: "Invalid user or password",
            });
        }

        if(!bcrypt.compareSync(password, user.password)) {
            return res.status(400).json({
                ok: false,
                message: "Invalid user or password",
            });
        }

        let token = jwt.sign({
            user
        }, process.env.JWT_SECRET, { expiresIn: 60 });

        return res.json({
            ok: true,
            user,
            token
        });
    });

});

module.exports = app;