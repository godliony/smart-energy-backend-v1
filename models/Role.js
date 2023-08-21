module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('Role', {
        role_key: DataTypes.STRING,
        role_value: DataTypes.INTEGER,
    })
    return Role
}