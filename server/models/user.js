const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

const VALID_ROLES = {
    values: ['ROLE_ADMIN', 'ROLE_USER'],
    message: '{VALUE} is not a valid role',
};

let User = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'ROLE_USER',
        enum: VALID_ROLES,
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
});

User.plugin(uniqueValidator);

module.exports = mongoose.model('User', User);
