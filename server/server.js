require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// routing
app.use(require('./config/router'));

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
    if(err) throw err;

    console.log("Database CONECTED!");
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto ${process.env.PORT}`);
});