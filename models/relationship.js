module.exports = (text) =>{
  const {
    User,
    UserRole,
    UserRefreshToken,
    Role,
    Meter,
    MeterLogging
} = require('.')

  console.log("create relationship model")
  User.hasMany(UserRole, {foreignKey : 'user_id',});
  User.hasMany(UserRefreshToken,{foreignKey:'user_id'})

  Role.hasMany(UserRole, {foreignKey: 'role_id'})

  Meter.hasMany(MeterLogging,{foreignKey : 'meter_id'})



  UserRole.belongsTo(User, {foreignKey : 'user_id'})
  UserRole.belongsTo(Role, {foreignKey : 'role_id'})

  MeterLogging.belongsTo(Meter, {foreignKey : 'meter_id'})
}