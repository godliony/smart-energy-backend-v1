const verifyRoles = (...allowedRoles) =>{
  return (req,res,next) =>{
    if(!req?.roles) return res.sendStatus(401);
    const rolesArray = [...allowedRoles];
    const result = req.roles.map(role => rolesArray.includes(role.role_value)).find(val => val === true);
    if(!result) return res.sendStatus(401) //Unauthorized.
    next();
  }
}

module.exports = verifyRoles