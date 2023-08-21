module.exports = {
    port: 8089,
    db:{
        database: process.env.DB_NAME || 'ProjectDB',
        user: process.env.DB_User || 'root',
        password: process.env.DB_PASS || '',
        options: {
            dialect: process.env.DIALECT || 'sqlite',
            storage: './Project-db.sqlite',
            logging: false,
        },
    }
}