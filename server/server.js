require('./config/config');
const express = require('express');
const bodyParser = require('body-parser')

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/usuario', (req, res) => {
    res.json('get Usuario');
});

app.post('/usuario', (req, res) => {

    const { body } = req;
    let { nombre, edad } = body;

    if(nombre === undefined) {
        res.status(400).json({
            ok: false,
            message: "El nombre es necesario",
        });
    }
    else {
        res.json(body);
    }

    res.json(req.body);
});

app.put('/usuario/:id', (req, res) => {

    let { id } = req.params;

    res.json({
        id,
    });
});

app.delete('/usuario', (req, res) => {
    res.json("delete Usuario");
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto ${process.env.PORT}`);
});