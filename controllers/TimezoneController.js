const utilities = require('../utilities')
const moment = require('moment-timezone');
const Sequelize = require('../models')
const {
    MeterLogging
} = require('../models')

module.exports = {

    async index(req, res) {
        try {
            const config = await utilities.readJSONFile('config/config.json')
            return res.send(config.timezone)

        } catch (err) {
            console.error(err)
            res.status(500).send(err.message)
        }
    },
    async put(req, res) {
        try {
            if (!req.body.timezone) return res.status(400).json({
                'message': 'timezone is request!'
            })
            const backupConfig = await utilities.readJSONFile('config/config.json')

            if (backupConfig.timezone !== req.body.timezone) {
                backupConfig.timezone = req.body.timezone
                const newConfig = backupConfig
                await utilities.writeJSONFile('config/config.json', newConfig)
                await convertTimeInDB(req.body.timezone)
            }
            return res.send(req.body)
        } catch (err) {
            res.status(500).send(err.message)
            console.error(err)
        }
    },

    async currentTime(req,res){
        try{
            const currentTimeUTC = moment.utc();
            const config = await utilities.readJSONFile('config/config.json')
            const covertedTime = currentTimeUTC.tz(config.timezone)
            return res.send({"time": covertedTime.format()})
        }catch(err){
            res.status(500).send(err.message)
            console.error(err)
        }
    }

}

async function convertTimeInDB(timezone) {
    const queryPerTime = 10000;
    let offset = 0;
    // สร้าง transaction
    const transaction = await Sequelize.sequelize.transaction();
    try {
        console.log(timezone)
        while (true) {
            let rows = await MeterLogging.findAll({
                attributes: ['id','timestamp', 'dd', 'dth', 'yearMonth', 'dow', 'year', 'month', 'hour'],
                limit: queryPerTime,
                offset: offset
            })

            
            for(let row of rows){
                const newTimestamp = moment.utc(row.timestamp).tz(timezone)
                row.dd = newTimestamp.format('YYYY-MM-DD')
                row.dth = newTimestamp.format('YYYY-MM-DD HH:00:00')
                row.yearMonth = newTimestamp.format('YYYY-MM')
                row.dow = newTimestamp.day()
                row.dom = newTimestamp.date()
                row.year = newTimestamp.year()
                row.month = newTimestamp.month() + 1
                row.hour = newTimestamp.hour()
                await row.save({ transaction }); // ใช้ transaction ที่เราสร้าง
            }
            

            if (rows.length < queryPerTime) {
                break;
            }

            offset += queryPerTime
        }
        // ยืนยัน transaction
        await transaction.commit();
    } catch (e) {
        await transaction.rollback();
        throw e;
        
    }
}