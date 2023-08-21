module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('Rs485', {
        port: DataTypes.STRING,
        baudRate: DataTypes.INTEGER,
        parity: DataTypes.STRING,
        dataBits: DataTypes.STRING,
        stopBits: DataTypes.STRING,
    })
    return Role
}