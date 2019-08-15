
process.env.ENV = process.env.ENV || 'prod';
process.env.PORT = process.env.PORT || 8000;
process.env.ENCRIPT_SALT = 10;


switch(process.env.ENV) {
    case 'dev':
        process.env.DB_CONNECTION = 'mongodb://localhost:27017/cafe';
        break;
    case 'prod':
        process.env.DB_CONNECTION = 'mongodb+srv://root:75966957@cluster0-lhwh7.mongodb.net/test';
        break;
}