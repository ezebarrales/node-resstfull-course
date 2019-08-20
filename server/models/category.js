const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Category = new Schema({
    description: {
        type: String,
        unique: true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Category', Category);