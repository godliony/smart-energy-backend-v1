const {Role} = require('../models')
const { Op } = require("sequelize");
module.exports = {
    //get all role
    async showAll(req, res) {
        
        try {
            
            const roles = await Role.findAll({
                attributes: ['id', 'role_key', 'role_value'],
            })

            return res.send(roles)
        } catch (err) {
            console.error(err)
            res.status(500).send(err.message)
        }
    },
    //get role pagination
    async index(req, res) {
        
        try {
            const page = req.body.page || 1
            const perPage = req.body.perPage || 10

            let whereQuery = {}
            let orderQuery = []

            if (typeof req.body.searchQuery !== 'undefined' && req.body.searchQuery !== '') {
                Object.assign(whereQuery, {
                    [Op.or]: ['role_key','role_value'].map((key)=>({
                        [key]:{
                            [Op.substring]: req.body.searchQuery
                        }
                    }))
                })

            }

            if (req.body.sort?.field !== '' && req.body.sort?.type !== 'none') {
                orderQuery.push([`${req.body.sort.field}`, req.body.sort.type])
            }

            const countRole = await Role.findAll({
                where: whereQuery,
                order: orderQuery,
            })

            const total = countRole.length

            const roles = await Role.findAll({
                attributes: ['id', 'role_key', 'role_value'],
                where: whereQuery,
                order: orderQuery,
                offset: (page - 1) * perPage,
                limit: perPage,
            })

            let response = {
                totalRecords: total,
                rows: roles
            }

            return res.send(response)
        } catch (err) {
            console.error(err)
            res.status(500).send(err.message)
        }
    },

    // create role
    async create(req, res) {
        try {
            const {
                role_key,
                role_value
            } = req.body
            if (!role_key || !role_value) return res.status(400).json({
                'message': 'Key and value are required'
            })

            const duplicate = await Role.findOne({
                where: {
                    [Op.or]: [
                        { 'role_key': role_key },
                        { 'role_value': role_value },
                      ]
                }
            })
            if (duplicate) return res.sendStatus(409) // Conflict

            const role = await Role.create(req.body);

            
            res.send(role)
        } catch (err) {
            res.status(500).send(err.message)
            console.error(err)
        }

    },
    // edit role
    async put(req, res) {
        try {
            const role = await Role.findOne({
                where: {
                    id: req.params.role_id
                }
            })

            if (!role) {
                return res.status(403).send({
                    error: 'The role information was incorrect'
                })
            }

            await Role.update(req.body, {
                where: {
                    id: req.params.role_id
                }
            })

            res.send(req.body)
        } catch (err) {
            res.status(500).send(err.message)
            console.error(err)
        }
    },
    // delete role
    async remove(req, res) {
        try {
            const role = await Role.findOne({
                where: {
                    id: req.params.role_id
                }
            })

            if (!role) {
                return res.status(403).send({
                    error: 'The role information was incorrect'
                })
            }
            await Role.destroy({
                where: {
                    id: req.params.role_id
                }
            })
            return res.sendStatus(200)
        } catch (err) {
            return res.status(500).send(err.message)
        }
    },
    // show role
    async show(req, res) {
        try {
            const role = await Role.findOne({
                where: {
                    id: req.params.role_id
                }
            })

            if (!role) {
                return res.status(403).send({
                    error: 'The role information was incorrect'
                })
            }
            res.send(role.toJSON())
        } catch (err) {
            res.status(500).send(err.message)
            console.error(err)
        }
    }

}