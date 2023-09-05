const {Meter} = require('../models')
const { Op } = require("sequelize");
const utilities = require('../utilities')
module.exports = {
    //get all meter
    async showAll(req, res) {
        try {
            const meters = await Meter.findAll({
                attributes: ['id','name', 'desc', 'active']
            })
            return res.send(meters)
        } catch (err) {
            console.error(err)
            res.status(500).send(err.message).send(err)
        }
    },
    //get meter pagination
    async index(req, res) {
        
        try {
            const page = req.body.page || 1
            const perPage = req.body.perPage || 10

            let whereQuery = {}
            let orderQuery = []

            if (typeof req.body.searchQuery !== 'undefined' && req.body.searchQuery !== '') {
                Object.assign(whereQuery, {
                    [Op.or]: ['rs485_no','name','desc'].map((key)=>({
                        [key]:{
                            [Op.substring]: req.body.searchQuery
                        }
                    }))
                })

            }
            if (req.body.sort?.field && req.body.sort?.field !== '' && req.body.sort?.type !== 'none') {
                orderQuery.push([`${req.body.sort.field}`, req.body.sort.type])
            }

            const countMeter = await Meter.findAll({
                where: whereQuery,
                order: orderQuery,
            })

            const total = countMeter.length

            const meters = await Meter.findAll({
                where: whereQuery,
                order: orderQuery,
                offset: (page - 1) * perPage,
                limit: perPage,
            })

            let response = {
                totalRecords: total,
                rows: meters
            }

            return res.send(response)
        } catch (err) {
            console.error(err)
            res.status(500).send(err.message).send(err)
        }
    },

    // create meter
    async create(req, res) {
        try {
            const {
                rs485_no,
                name,
            } = req.body
            if (!rs485_no || !name ) return res.status(400).json({
                'message': 'ID RS485 and name are required'
            })
            const config = await utilities.readJSONFile('config/config.json')
            const limitMeter = config.limitMeter

            const totalMeter = await Meter.count()
            if(totalMeter >= limitMeter)  return res.status(409).send({'message': `Powermeter can't add over ${limitMeter} devices `}) // Conflict

            const duplicate = await Meter.findOne({
                where: {
                    [Op.or]: [
                        { 'name': name },
                        { 'rs485_no': rs485_no },
                      ]
                }
            })
            if (duplicate) return res.status(409).send({'message': 'Name or ID485 Duplicate !'}) // Conflict

            const meter = await Meter.create(req.body);

            
            res.send(meter)
        } catch (err) {
            res.status(500).send(err.message)
            console.error(err)
        }

    },
    // edit meter
    async put(req, res) {
        try {
            const meter = await Meter.findOne({
                where: {
                    id: req.params.id
                }
            })

            if (!meter) {
                return res.status(403).send({
                    error: 'The meter information was incorrect'
                })
            }

            await Meter.update(req.body, {
                where: {
                    id: req.params.id
                }
            })

            res.send(req.body)
        } catch (err) {
            res.status(500).send(err.message).send(err)
            console.error(err)
        }
    },
    // delete meter
    async remove(req, res) {
        try {
            const meter = await Meter.findOne({
                where: {
                    id: req.params.id
                }
            })

            if (!meter) {
                return res.status(403).send({
                    error: 'The meter information was incorrect'
                })
            }
            await Meter.destroy({
                where: {
                    id: req.params.id
                }
            })
            return res.sendStatus(200)
        } catch (err) {
            return res.status(500).send(err.message).send(err)
        }
    },
    // show meter
    async show(req, res) {
        try {
            const meter = await Meter.findOne({
                where: {
                    id: req.params.id
                }
            })

            if (!meter) {
                return res.status(403).send({
                    error: 'The meter information was incorrect'
                })
            }
            res.send(meter.toJSON())
        } catch (err) {
            res.status(500).send(err.message).send(err)
            console.error(err)
        }
    },

    showMeterLastValue(req,res){
        try{
            const {modbusRead} = require('./Rs485Controller');
            const id = req.params.id
            if(!id) return res.status(403).send({
                error: 'id is required!'
            })
            const meterLastValue = modbusRead.getMeterValue(id)
            res.send(meterLastValue ?? {})
        }catch(e){
            res.status(500).send(err.message)
            console.error(err)
        }
    },
    showMultipleMeterLastValue(req,res){
        try{
            const {modbusRead} = require('./Rs485Controller');
            const id = req.body.id
            let arrData = []
            if(!id) return res.status(403).send({
                error: 'id is required!'
            })
            for(let i=0; i<id.length; i++){
                arrData.push(modbusRead.getMeterValue(id[i]) ?? {})
            }
            res.send(arrData)
        }catch(e){
            res.status(500).send(err.message)
            console.error(err)
        }
    }
    

}