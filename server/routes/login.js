const express = require('express');
const bcrypt = require('bcrypt');
const User = require('./../models/user');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const app = express();

app.post('/login', (req, res) => {

    let { body } = req;
    let { email, password } = body;

    User.findOne({
        email,
    }, (err, user) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        }

        if (!user) {
            return res.status(400).json({
                ok: false,
                message: "Invalid user or password",
            });
        }

        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(400).json({
                ok: false,
                message: "Invalid user or password",
            });
        }

        let token = jwt.sign({
            user
        }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });

        return res.json({
            ok: true,
            user,
            token
        });
    });

});

// Google Configurations
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return payload;
}

app.post('/login/google', async (req, res) => {

    let token = req.body.idtoken;

    let google_user = await verify(token).catch(err => {
        return res.status(403).json({
            ok: false,
            error: err
        });
    });

    User.findOne({
        email: google_user.email
    }, (err, user) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        }

        if(user) {

            if(user.google === false) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: "Ya tienes una cuenta creada que no fue logueada con Google. Utiliza la autenticación normal."
                    }
                });
            }
            else {
                let token = jwt.sign({
                    user
                }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });

                return res.json({
                    ok: true,
                    user,
                    token
                });
            }
        }
        else {

            // Si el usuario no existe en nuestra base de datos
            let user = new User({
                name: google_user.name,
                email: google_user.email,
                img: google_user.picture,
                password: 'google-sign',
                google: true
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
                    user,
                    token
                });
        
            });

        }
    });



});

module.exports = app;