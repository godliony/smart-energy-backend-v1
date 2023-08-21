const bcrypt = require('bcrypt')
const {
    Op
} = require("sequelize");
const {User,UserRole,Role} = require('../../models')
const { literal } = require('sequelize');


module.exports = {
    //get all user
    async index(req, res) {

        try {

            const page = req.body.page || 1
            const perPage = req.body.perPage || 10

            

            let whereQuery = {}
            let orderQuery = []

            if (typeof req.body.searchQuery !== 'undefined' && req.body.searchQuery !== '') {
                Object.assign(whereQuery, {
                    [Op.or]: ['username','email','firstname', 'lastname'].map((key)=>({
                        [key]:{
                            [Op.substring]: req.body.searchQuery
                        }
                    }))
                })

            }

            if (req.body.sort.field !== '' && req.body.sort.type !== 'none') {
                orderQuery.push([`${req.body.sort.field}`, req.body.sort.type])
            }


            const countUser = await User.findAll({
                where: whereQuery,
                order: orderQuery,
            })

            const total = countUser.length

            const users = await User.findAll({
                attributes: ['id', 'username', 'email', 'firstname', 'lastname', 'active',
                [literal('datetime(`createdAt`, \'+7 hours\')'), 'createdAt'],],
                where: whereQuery,
                order: orderQuery,
                offset: (page - 1) * perPage,
                limit: perPage,
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

            let response = {
                totalRecords: total,
                rows: users
            }
            res.send(response)
        } catch (err) {
            console.error(err)
            res.status(500).send(err.message).send(err)
        }
    },
    // create user
    async create(req, res) {
        try {
            const {
                username,
                password
            } = req.body
            if (!username || !password) return res.status(400).json({
                'message': 'Username and password are required'
            })

            //const duplicate = await User.where("username","==",username).get();
            const duplicate = await User.findOne({
                where: {
                    username: username
                }
            })
            if (duplicate) return res.sendStatus(409) // Conflict

            //encrypt the password
            req.body.password = await bcrypt.hash(password, 10);
            //store the new user
            //await User.add({"username": username, "password": hashedPwd, "refreshToken": [], "roles": {"User": 2001}});
            const user = await User.create(req.body);

            await UserRole.create({
                user_id: user.id,
                role_id: 1
            })
            res.send({
                'success': `New user ${username} created!`
            })
        } catch (err) {
            res.status(500).send(err.message).send(err)
            console.error(err)
        }

    },
    // edit user, susspend active
    async put(req, res) {
        try {
            //const user = await User.doc(req.params.userId).get()
            const user = await User.findOne({
                where: {
                    id: req.params.user_id
                }
            })

            if (!user) {
                return res.status(403).send({
                    error: 'The user information was incorrect'
                })
            }

            await User.update(req.body, {
                where: {
                    id: req.params.user_id
                }
            })

            res.send(req.body)
        } catch (err) {
            res.status(500).send(err.message).send(err)
            console.error(err)
        }
    },
    // delete user
    async remove(req, res) {
        try {
            //const user = await User.doc(req.params.userId).get()
            const user = await User.findOne({
                where: {
                    id: req.params.user_id
                }
            })

            if (!user) {
                return res.status(403).send({
                    error: 'The user information was incorrect'
                })
            }
            //await User.doc(req.params.userId).delete()
            await User.destroy({
                where: {
                    id: req.params.user_id
                }
            })
            res.send({
                "username": user.username
            })
        } catch (err) {
            return res.status(500).send(err.message).send(err)
        }
        //res.send(`Delete user : ${req.params.userId}`)
    },
    // show user
    async show(req, res) {
        try {
            const user = await User.findOne({
                attributes: ['id', 'username', 'email', 'firstname', 'lastname', 'active'],
                where: {
                    id: req.params.user_id
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

            if (!user) {
                return res.status(403).send({
                    error: 'The user information was incorrect'
                })
            }
            return res.json(user)
        } catch (err) {
            res.status(500).send(err.message).send(err)
            console.error(err)
        }
    },

    async updateRole(req, res) {
        try {
            //const user = await User.doc(req.params.userId).get()
            const user = await User.findOne({
                where: {
                    id: req.params.user_id
                }
            })

            if (!user) {
                return res.status(403).send({
                    error: 'The user information was incorrect'
                })
            }


            //updateRolesUser

            // - before update We need to remove all roles
            await UserRole.destroy({
                where: {
                    user_id: user.id
                }
            })
            // - update new role
            for (var i = 0; i < req.body.role.length; i++) { 
                await UserRole.create({
                    user_id: user.id,
                    role_id: Number(req.body.role[i].role_id)
                })
            }

            res.send(req.body)
        } catch (err) {
            res.status(500).send(err.message).send(err)
            console.error(err)
        }
    },


}