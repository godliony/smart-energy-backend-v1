const allowedOrigins = require('../config/allowedOptions');

const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if(allowedOrigins.includes(origin) || allowedOrigins.includes('*')){
        res.header('Access-Control-Allow-Credentials', true);
    }
    next();
}
module.exports = credentials;