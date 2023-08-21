module.exports = (sequelize, DataTypes) => {
    const UserRefreshToken = sequelize.define('UserRefreshToken', {
        user_id: DataTypes.INTEGER,
        token: DataTypes.TEXT,
    })
    return UserRefreshToken
}