const {Holiday} = require('../models')
const { Op } = require("sequelize");
module.exports = {
    //get all holiday
    async showAll(req, res) {
        
        try {
            
            const holidays = await Holiday.findAll({
                attributes: ['id', 'holiday_name', 'holiday_date'],
            })

            return res.send(holidays)
        } catch (err) {
            console.error(err)
            res.status(500).send(err.message)
        }
    },
    async index(req, res) {
        
        try {
            const page = req.body.page || 1
            const perPage = req.body.perPage || 10

            let whereQuery = {}
            let orderQuery = []

            if (typeof req.body.searchQuery !== 'undefined' && req.body.searchQuery !== '') {
                Object.assign(whereQuery, {
                    [Op.or]: ['holiday_name','holiday_date'].map((key)=>({
                        [key]:{
                            [Op.substring]: req.body.searchQuery
                        }
                    }))
                })

            }

            if (req.body.sort?.field !== '' && req.body.sort?.type !== 'none') {
                orderQuery.push([`${req.body.sort.field}`, req.body.sort.type])
            }

            const countHoliday = await Holiday.findAll({
                where: whereQuery,
                order: orderQuery,
            })

            const total = countHoliday.length

            const holidays = await Holiday.findAll({
                attributes: ['id', 'holiday_name', 'holiday_date'],
                where: whereQuery,
                order: orderQuery,
                offset: (page - 1) * perPage,
                limit: perPage,
            })

            let response = {
                totalRecords: total,
                rows: holidays
            }

            return res.send(response)
        } catch (err) {
            console.error(err)
            res.status(500).send(err.message)
        }
    },

    // create holiday
    async create(req, res) {
        try {
            const {
                holiday_name,
                holiday_date
            } = req.body
            if (!holiday_name || !holiday_date) return res.status(400).json({
                'message': 'Key and value are required'
            })

            const duplicate = await Holiday.findOne({
                where: {
                    [Op.or]: [
                        { 'holiday_name': holiday_name },
                        { 'holiday_date': holiday_date },
                      ]
                }
            })
            if (duplicate) return res.sendStatus(409) // Conflict

            const holiday = await Holiday.create(req.body);

            
            res.send(holiday)
        } catch (err) {
            res.status(500).send(err.message)
            console.error(err)
        }

    },
    // edit holiday
    async put(req, res) {
        try {
            const holiday = await Holiday.findOne({
                where: {
                    id: req.params.holiday_id
                }
            })

            if (!holiday) {
                return res.status(403).send({
                    error: 'The holiday information was incorrect'
                })
            }

            await Holiday.update(req.body, {
                where: {
                    id: req.params.holiday_id
                }
            })

            res.send(req.body)
        } catch (err) {
            res.status(500).send(err.message)
            console.error(err)
        }
    },
    // delete holiday
    async remove(req, res) {
        try {
            const holiday = await Holiday.findOne({
                where: {
                    id: req.params.holiday_id
                }
            })

            if (!holiday) {
                return res.status(403).send({
                    error: 'The holiday information was incorrect'
                })
            }
            await Holiday.destroy({
                where: {
                    id: req.params.holiday_id
                }
            })
            return res.sendStatus(200)
        } catch (err) {
            return res.status(500).send(err.message)
        }
    },
    // show holiday
    async show(req, res) {
        try {
            const holiday = await Holiday.findOne({
                where: {
                    id: req.params.holiday_id
                }
            })

            if (!holiday) {
                return res.status(403).send({
                    error: 'The holiday information was incorrect'
                })
            }
            res.send(holiday.toJSON())
        } catch (err) {
            res.status(500).send(err.message)
            console.error(err)
        }
    }

}