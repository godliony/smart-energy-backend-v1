const { Op } = require("sequelize");
const utilities = require('../utilities')

module.exports = {
    
    async index(req, res) {
        try {
            const config = await utilities.readJSONFile('config/config.json')
            return res.send({
                "costOnPeak":config.costOnPeak,
                "costOffPeak":config.costOffPeak 
            })
            
        } catch (err) {
            console.error(err)
            res.status(500).send(err.message).send(err)
        }
    },
    async put(req, res) {
        try {
            if(!req.body.costOnPeak && !req.body.costOffPeak) return res.status(400).json({
                'message': 'costOnPeak or costOffPeak are request!'
            })
            const backupConfig = await utilities.readJSONFile('config/config.json')
            if(req.body.costOnPeak)
                backupConfig.costOnPeak = req.body.costOnPeak
            if(req.body.costOffPeak)
                backupConfig.costOffPeak = req.body.costOffPeak
            const newConfig = backupConfig
            await utilities.writeJSONFile('config/config.json',newConfig)
            return res.send(req.body)
        } catch (err) {
            res.status(500).send(err.message).send(err)
            console.error(err)
        }
    },

}