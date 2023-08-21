const allowedOrigins = require('./allowedOptions');

const corsOption = {
    origin: (origin, callback) => {
        if((allowedOrigins.indexOf(origin) !== -1 || !origin) || allowedOrigins.indexOf('*') !== -1){
            callback(null, true)
        }else{
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOption;