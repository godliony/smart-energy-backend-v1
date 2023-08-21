module.exports = (sequelize, DataTypes) => {
    const Holiday = sequelize.define('Holiday', {
        holiday_name: DataTypes.STRING,
        holiday_date: DataTypes.DATEONLY,
    },{
        timestamps: false
    })
    return Holiday
}