
// ================================================
// Environment
// ================================================
process.env.ENV = process.env.ENV || 'dev';

// ================================================
// Listening port Node Server
// ================================================
process.env.PORT = process.env.PORT || 8000;

// ================================================
// Password Encrypt
// ================================================
process.env.ENCRIPT_SALT = 10;

// ================================================
// JWT configuration
// ================================================
// JWT expiration
process.env.JWT_EXPIRATION = 60 * 60;
// JWT secret
process.env.JWT_SECRET = process.env.JWT_SECRET || 'dev-sign-secret';


// ================================================
// Database connection
// ================================================
process.env.DB_CONNECTION = process.env.DB_CONNECTION || 'mongodb://localhost:27017/cafe';