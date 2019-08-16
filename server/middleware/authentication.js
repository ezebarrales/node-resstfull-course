const jwt = require('jsonwebtoken');

// ================================================
// Validar Token
// ================================================
let validateToken = (req, res, next) => {

    let token = req.get('Authorization');

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {

        if(err) {
            return res.status(401).json({
                ok: false,
                error: err
            });
        }

        req.user = decoded.user;
        next();
    });
};

// ================================================
// Validate ROLE_ADMIN
// ================================================
let validateAdmin = (req, res, next) => {

    let { user } = req;

    if(user.role !== 'ROLE_ADMIN') {
        return res.status(401).json({
            ok: false,
            error: 'Role not authorized'
        });
    }

    next();

};

module.exports = {
    validateToken,
    validateAdmin
};