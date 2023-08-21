const { Op } = require("sequelize");
const utilities = require('../utilities')

module.exports = {
    
    async index(req, res) {
        try {
            const config = await utilities.readJSONFile('config/config.json')
            return res.send({
                "startOnPeak":config.startOnPeak,
                "endOnPeak":config.endOnPeak 
            })
            
        } catch (err) {
            console.error(err)
            res.status(500).send(err.message).send(err)
        }
    },
    async put(req, res) {
        try {
            if(!req.body.startOnPeak && !req.body.endOnPeak) return res.status(400).json({
                'message': 'startOnPeak or endOnPeak are request!'
            })
            const backupConfig = await utilities.readJSONFile('config/config.json')
            if(req.body.startOnPeak)
                backupConfig.startOnPeak = req.body.startOnPeak
            if(req.body.endOnPeak)
                backupConfig.endOnPeak = req.body.endOnPeak
            const newConfig = backupConfig
            await utilities.writeJSONFile('config/config.json',newConfig)
            return res.send(req.body)
        } catch (err) {
            res.status(500).send(err.message).send(err)
            console.error(err)
        }
    },

}