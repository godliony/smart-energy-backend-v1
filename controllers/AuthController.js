const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Op, where } = require("sequelize");

const {User,UserRole, UserRefreshToken,Role} = require('../models')

/* Shop.hasMany(ShopAd, {foreignKey : 'shop_id', as : 'ads'});
ShopAd.belongsTo(Shop, {foreignKey : 'id'}) */


const accessTokenExpiresIn = '5s'
const refreshTokenExpiresIn = '99y'
module.exports = {

    // Login
    async handleLogin(req, res) {
        try{
          const cookies = req.cookies;
          const { username, password } = req.body
          if (!username || !password) return res.status(400).json({ 'message': 'Username and password are required' })

          const user = await User.findOne({
            where: {
              username: username
            },
            include:[
              { 
                  model:UserRole,
                  attributes: ['role_id'],
                  required:false,
                  include:[
                    { 
                        model:Role,
                        attributes: ['role_key','role_value'],
                        required:false
                    }
                  ]
              }
            ]
          })
          if (!user) return res.status(401).json({ 'message': 'Username or Password incorrect!' }) // Unauthorized

          //evaluate password
          const match = await bcrypt.compare(password, user.password)
          if (match) {
            
              if(user.active !== true){return res.status(401).json({ 'message': 'User account is not yet activated.' })}

              /* const roles = await UserRole.findAll({
                attributes: ['role_id'],
                where: {
                  user_id: user.id
                }
              }) */

              const roles = user.UserRoles.map((role)=>role.Role)
              //creat JWTs
              const accessToken = jwt.sign(
                  { "UserInfo": 
                    {
                      "userId": user.id,
                      "username": user.username,
                      "roles": roles
                    }
                  },
                  process.env.ACCESS_TOKEN_SECRET,
                  { expiresIn: accessTokenExpiresIn }
              )
              //refreshToken
              const newRefreshToken = jwt.sign(
                  { "userId": user.id,
                  "username": user.username },
                  process.env.REFRESH_TOKEN_SECRET,
                  { expiresIn: refreshTokenExpiresIn } 
              )
              /* const newRefreshTokenArray = 
                !cookies?.jwt
                  ? user.refreshToken
                  : user.refreshToken.filter(rt => rt !== cookies.jwt);
              */

              if(cookies?.jwt) res.clearCookie('jwt', { httpOnly: true, secure: false, sameSite: 'None'})

              //Saving refreshToken with current user
              /* await User.doc(user.id).update({ "refreshToken": [...newRefreshTokenArray,newRefreshToken] }) */
              await UserRefreshToken.create({
                'user_id': user.id,
                'token': newRefreshToken
              })
              res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 })
              res.json({ user, roles,accessToken })
          } else {
              return res.status(401).json({ 'message': 'Username or Password incorrect!' })
          }
        }catch(e){
          res.status(500).send(err.message).send(err)
          console.error(e)
        }
    },

    async handleLogout(req,res){
      try{
        // On client, also delete the accessToken
        const cookies = req.cookies
        if(!cookies?.jwt) return res.sendStatus(204); //No content
        const refreshToken = cookies.jwt;
      
        //Is refreshToken in db?
        /* const users = await User.where("refreshToken", 'array-contains', refreshToken).get().then((querySnapshot) => {
          return querySnapshot.docs.map(doc => Object.assign(doc.data(), { id: doc.id }))
        }); */

        const userRefreshToken = await UserRefreshToken.findOne({
          where:{
            token: refreshToken
          }
        })
        if (!userRefreshToken) {
          res.clearCookie('jwt', { httpOnly: true, secure: false, sameSite: 'None'})
          return res.sendStatus(204) //No content
        }

        // Delete refreshToken in db
        //await User.doc(user.id).update({ "refreshToken": user.refreshToken.filter(rt => rt !== refreshToken) })
        await UserRefreshToken.destroy({
          where:{
            token: refreshToken
          }
        })
        res.clearCookie('jwt', { httpOnly: true, secure: false, sameSite: 'None'}) // secure: false - only serves on https
        res.sendStatus(204)
      }catch(e){
        res.status(500).send(err.message).send(err)
        console.error(e)
      }
    },

    //Refresh Token
    async handleRefreshToken(req, res){
      try{
        const cookies = req.cookies
        if(!cookies?.jwt) return res.sendStatus(401);
        const refreshToken = cookies.jwt;
        res.clearCookie('jwt', { httpOnly: true, secure: false, sameSite: 'None' })

        const userRefreshToken = await UserRefreshToken.findOne({
          where:{
            token: refreshToken
          }
        })

        // Detected refresh token reuse!
        if (!userRefreshToken){
          jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err,decoded) => {
              if(err)return res.sendStatus(403) //Forbidden
              console.log('attempted refresh token reuse!')
              /* const hackedUser = await User.where("username", "==", decoded.username).get().then((querySnapshot) => {
                return querySnapshot.docs.map(doc => Object.assign(doc.data(), { id: doc.id }))
              }); */
              const hackedUser = await UserRefreshToken.findOne({
                where:{
                  user_id: decoded.user_id
                }
              })
              if(hackedUser){
                await hackedUser.destroy()
              }
              
            }
          )
          return res.sendStatus(403) //Forbidden
        }
      
        const user = await User.findOne({
          where: {
            id: userRefreshToken.user_id
          },
          include:[
            { 
                model:UserRole,
                attributes: ['role_id'],
                required:false,
                include:[
                  { 
                      model:Role,
                      attributes: ['role_key','role_value'],
                      required:false
                  }
                ]
            }
          ]
        })

      
        // evaluate jwt
        
        jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET,
          async (err,decoded) => {
            if(err){
              //Delete old token
              console.log('expired refresh token')
              //await User.doc(user.id).update({ "refreshToken": [...newRefreshTokenArray] })
              await userRefreshToken.destroy()
            }
            if(err || user.username !== decoded.username) return res.sendStatus(403);

            await userRefreshToken.destroy()

            //Refresh token was still valid
            //const roles = Object.values(user.roles);
            const roles = user.UserRoles.map((role)=>role.Role)

            const accessToken = jwt.sign(
              { "UserInfo": 
                {
                  "user_id": user.id,
                  "username": user.username,
                  "roles": roles
                }
              },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: accessTokenExpiresIn }
            )
            const newRefreshToken = jwt.sign(
                { "user_id": user.id,
                "username": user.username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: refreshTokenExpiresIn }
            )
            //Saving refreshToken with current user
            //await User.doc(user.id).update({ "refreshToken": [...newRefreshTokenArray, newRefreshToken] })
            
            await UserRefreshToken.create({
              user_id: user.id,
              token: newRefreshToken
            })
            res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 })
            res.json({ user, roles,accessToken })
          }
        )
      }catch(e){
        res.status(500).send(err.message).send(err)
        console.error(e)
      }
    },

    //New user
    async handleRegister(req,res){
      try {
        const {username, password, email} = req.body
        if(!username || !password || !email ) return res.status(400).json({'message': 'Username, password and email are required'})
        
        /* const duplicate = await User.where("username","==",username).get(); */
        const duplicate = await User.findOne({
          where: {
            [Op.or]: [
              {username: username},
              {email: email}
            ]
          }
        })
        if(duplicate) return res.sendStatus(409) // Conflict

        //encrypt the password
        const hashedPwd = await bcrypt.hash(password,10);
        req.body.password = hashedPwd
        //store the new user
        const user = await User.create(req.body);

        /* await UserRole.create({
          user_id: user.id,
          role_id: 1000
        }) */
        res.send({'success': `New user ${username} created!`})
      } catch (err) {
          res.status(500).send(err.message).send(err)
          console.error(err)
      }
    }
}