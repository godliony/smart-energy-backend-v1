const {
    MeterLogging,
    Meter,
    Holiday
} = require('../models')
const {
    Sequelize,
    Op,
    where
} = require("sequelize");
const utilities = require('../utilities')
const moment = require('moment-timezone');

module.exports = {
    async kWhReport(req, res) {
        try {
            const config = await utilities.readJSONFile('config/config.json')
            const startOnPeak = config.startOnPeak
            const endOnPeak = config.endOnPeak

            let whereCondition = {}

            let formatDate = "YYYY-MM-DDTHH:mm:ss.SSSZ";
            const {
                startDatetime,
                endDatetime,
                typeDatetime,
                meter_id
            } = req.query
            if (!startDatetime || !endDatetime) return res.status(400).json({
                'message': 'startDatetime, endDatetime and typeDatetime are requires.'
            })

            if (!moment(startDatetime, formatDate, true).isValid()) throw new Error('Invalid Date')
            if (!moment(endDatetime, formatDate, true).isValid()) throw new Error('Invalid Date')

            const startDate = moment.tz(startDatetime, config.timezone).toISOString();
            const endDate = moment.tz(endDatetime, config.timezone).toISOString();

            const holidays = await Holiday.findAll({
                attributes:['holiday_date'],
                raw:true
            })
            let strHoliday = holidays.map(item => `'${item.holiday_date}'`).join()
            let arrHoliday = holidays.map(item => item.holiday_date)
            const rangeHour = fnConditionOnPeak(startOnPeak, endOnPeak, config.timezone)

        
            whereCondition = {
                timestamp: {[Op.between]: [startDate, endDate]}
            }
            const totalkWhEachMeterInMonth = await Meter.findAll({
                attributes: [
                    'meter.name',
                    [Sequelize.fn('sum', Sequelize.literal(`case when hour IN (${rangeHour.join(',')}) and dow NOT IN (0,6) and dd NOT IN (${strHoliday}) then diff_kWh else 0 end`)), 'onPeak'],
                    [Sequelize.fn('sum', Sequelize.literal(`case when hour NOT IN (${rangeHour.join(',')}) or dow IN (0,6) or dd IN (${strHoliday}) then diff_kWh else 0 end`)), 'offPeak'],
                ],
                include: [{
                    model:MeterLogging,
                    attributes: [],
                    required:false,
                    where: whereCondition,
                }],
                group: ['meter.id'],
                raw: true
            })

            whereCondition = {
                timestamp: {[Op.between]: [startDate, endDate]},
                [Op.and] : [
                    {hour: {[Op.in]: rangeHour}},
                    {dow: {[Op.notIn]: [0,6]}},
                    {dd: {[Op.notIn]: arrHoliday}}
                ]
            }
            const kWhOnPeak = await MeterLogging.findAll({
                attributes: ['timestamp', 'hour', 'diff_kWh'],
                where: whereCondition,
                group: ['dd','meter_id']
            })

            if(typeDatetime === 'HOURLY'){
                /* var kWh = await MeterLogging.findAll({
                    attributes: [
                        'dth',
                        [Sequelize.fn('sum', Sequelize.literal(`case when hour IN (${rangeHour.join(',')}) and dow NOT IN (0,6) and dd NOT IN (${strHoliday}) then diff_kWh else 0 end`)), 'onPeak'],
                        [Sequelize.fn('sum', Sequelize.literal(`case when hour NOT IN (${rangeHour.join(',')}) or dow IN (0,6) or dd IN (${strHoliday}) then diff_kWh else 0 end`)), 'offPeak'],
                    ],
                    group: ['dth'],
                    where: whereCondition,
                    raw: true
                }) */

                
            }

            /* let hourlySums = Array.from({
                length: 24
            }, (v, i) => ({
                t: i + ':00',
                onPeak: 0,
                offPeak: 0
            }));

            
            whereCondition = {
                timestamp: {[Op.between]: [startDate, endDate]},
                [Op.and] : [
                    {hour: {[Op.in]: rangeHour}},
                    {dow: {[Op.notIn]: [0,6]}},
                    {dd: {[Op.notIn]: arrHoliday}}
                ]
            }
            if (meter_id) whereCondition.meter_id = meter_id
            
            const kWhOnPeak = await MeterLogging.findAll({
                attributes: ['timestamp', 'diff_kWh'],
                where: whereCondition
            })
            for (let i = 0; i < kWhOnPeak.length; i++) {
                const localDate = moment(kWhOnPeak[i].dataValues.timestamp).tz(config.timezone)
                hourlySums[localDate.hour()].onPeak += kWhOnPeak[i].dataValues.diff_kWh
            }

            whereCondition = {
                timestamp: {[Op.between]: [startDate, endDate]},
                [Op.or] : [
                    {hour: {[Op.notIn]: rangeHour}},
                    {dow: {[Op.in]: [0,6]}},
                    {dd: {[Op.in]: arrHoliday}}
                ]
                
            }
            if (meter_id) whereCondition.meter_id = meter_id
            const kWhOffPeak = await MeterLogging.findAll({
                attributes: ['timestamp', 'diff_kWh'],
                where: whereCondition
            })
            for (let i = 0; i < kWhOffPeak.length; i++) {
                const localDate = moment(kWhOffPeak[i].dataValues.timestamp).tz(config.timezone)
                hourlySums[localDate.hour()].offPeak += kWhOffPeak[i].dataValues.diff_kWh
            } */
            return res.send(kWhOnPeak)

        } catch (err) {
            console.error(err)
            return res.status(500).send(err.message)
        }
    },

    async total_kWhLifeTime(req, res) {
        const {
            meter_id
        } = req.query
        let whereCondition = {}
        try {
            const config = await utilities.readJSONFile('config/config.json')
            const startOnPeak = config.startOnPeak
            const endOnPeak = config.endOnPeak


            if (meter_id) whereCondition.meter_id = meter_id

            const rangeHour = fnConditionOnPeak(startOnPeak, endOnPeak, config.timezone)
            const holidays = await Holiday.findAll({
                attributes:['holiday_date'],
                raw:true
            })
            let strHoliday = holidays.map(item => `'${item.holiday_date}'`).join()
            const kWh = await MeterLogging.findOne({
                attributes: [
                    [Sequelize.fn('sum', Sequelize.literal(`case when hour IN (${rangeHour.join(',')}) and dow NOT IN (0,6) and dd NOT IN (${strHoliday}) then diff_kWh else 0 end`)), 'onPeak'],
                    [Sequelize.fn('sum', Sequelize.literal(`case when hour NOT IN (${rangeHour.join(',')}) or dow IN (0,6) or dd IN (${strHoliday}) then diff_kWh else 0 end`)), 'offPeak'],
                ],
                where: whereCondition,
                raw: true
            })

            return res.send({
                'total': kWh.onPeak + kWh.offPeak || 0,
                'onPeak': kWh.onPeak || 0,
                'offPeak': kWh.offPeak || 0
            })

        } catch (err) {
            console.error(err)
            return res.status(500).send(err.message)
        }
    },

    async total_kWhYearlyDevice(req, res) {
        try {
            const config = await utilities.readJSONFile('config/config.json')
            const startOnPeak = config.startOnPeak
            const endOnPeak = config.endOnPeak
            let whereCondition = {}

            let formatDate = "YYYY-MM-DDTHH:mm:ss.SSSZ";
            const {
                selectDate,
                meter_id
            } = req.query
            if (!selectDate) return res.status(400).json({
                'message': 'selectDate is required'
            })

            if (!moment(selectDate, formatDate, true).isValid()) throw new Error('Invalid Date')

            const selectDateTimezone = moment.tz(selectDate, config.timezone)
            let startDate = selectDateTimezone.clone().startOf('year').toISOString();
            let endDate = selectDateTimezone.clone().endOf('year').toISOString();


            if (meter_id) whereCondition.meter_id = meter_id

            const rangeHour = fnConditionOnPeak(startOnPeak, endOnPeak, config.timezone)
            whereCondition.timestamp = {
                [Op.between]: [startDate, endDate]
            }
            /* const kWh = await MeterLogging.findOne({
                attributes: [
                    [Sequelize.fn('sum', Sequelize.literal(`case when hour IN (${rangeHour.join(',')}) and dow NOT IN (0,6) then diff_kWh else 0 end`)), 'onPeak'],
                    [Sequelize.fn('sum', Sequelize.literal(`case when hour NOT IN (${rangeHour.join(',')}) or dow IN (0,6) then diff_kWh else 0 end`)), 'offPeak'],
                ],
                where: whereCondition,
                raw: true
            }) */
            const holidays = await Holiday.findAll({
                attributes:['holiday_date'],
                raw:true
            })
            let strHoliday = holidays.map(item => `'${item.holiday_date}'`).join()
            const kWh = await MeterLogging.findOne({
                attributes: [
                    [Sequelize.fn('sum', Sequelize.literal(`case when hour IN (${rangeHour.join(',')}) and dow NOT IN (0,6) and dd NOT IN (${strHoliday}) then diff_kWh else 0 end`)), 'onPeak'],
                    [Sequelize.fn('sum', Sequelize.literal(`case when hour NOT IN (${rangeHour.join(',')}) or dow IN (0,6) or dd IN (${strHoliday}) then diff_kWh else 0 end`)), 'offPeak'],
                ],
                where: whereCondition,
                raw: true
            })

            return res.send({
                'total': kWh.onPeak + kWh.offPeak || 0,
                'onPeak': kWh.onPeak || 0,
                'offPeak': kWh.offPeak || 0
            })

            /* whereCondition.timestamp = {
                [Op.between]: [startDate, endDate]
            }
            
            whereCondition.hour = {
                [Op.in]: rangeHour
            }

            const totalKwhOnPeak = await MeterLogging.sum('diff_kWh', {
                where: whereCondition
            })

            whereCondition.hour = {
                [Op.notIn]: rangeHour
            }
            const totalKwhOffPeak = await MeterLogging.sum('diff_kWh', {
                where: whereCondition
            })

            return res.send({
                'total': totalKwhOnPeak + totalKwhOffPeak || 0,
                'onPeak': totalKwhOnPeak || 0,
                'offPeak': totalKwhOffPeak || 0
            }) */

        } catch (err) {
            console.error(err)
            return res.status(500).send(err.message)
        }
    },

    async total_kWhMonthlyDevice(req, res) {
        try {

            let whereCondition = {}

            const config = await utilities.readJSONFile('config/config.json')
            const startOnPeak = config.startOnPeak
            const endOnPeak = config.endOnPeak

            let formatDate = "YYYY-MM-DDTHH:mm:ss.SSSZ";
            const {
                selectDate,
                meter_id
            } = req.query
            if (!selectDate) return res.status(400).json({
                'message': 'selectDate is required'
            })

            if (!moment(selectDate, formatDate, true).isValid()) throw new Error('Invalid Date')

            const selectDateTimezone = moment.tz(selectDate, config.timezone)
            let startDate = selectDateTimezone.clone().startOf('month').toISOString();
            let endDate = selectDateTimezone.clone().endOf('month').toISOString();

            if (meter_id) whereCondition.meter_id = meter_id
            whereCondition.timestamp = {
                [Op.between]: [startDate, endDate]
            }
            const rangeHour = fnConditionOnPeak(startOnPeak, endOnPeak, config.timezone)

            /* const kWh = await MeterLogging.findOne({
                attributes: [
                    [Sequelize.fn('sum', Sequelize.literal(`case when hour IN (${rangeHour.join(',')}) and dow NOT IN (0,6) then diff_kWh else 0 end`)), 'onPeak'],
                    [Sequelize.fn('sum', Sequelize.literal(`case when hour NOT IN (${rangeHour.join(',')}) or dow IN (0,6) then diff_kWh else 0 end`)), 'offPeak'],
                ],
                where: whereCondition,
                raw: true
            }) */
            const holidays = await Holiday.findAll({
                attributes:['holiday_date'],
                raw:true
            })
            let strHoliday = holidays.map(item => `'${item.holiday_date}'`).join()
            const kWh = await MeterLogging.findOne({
                attributes: [
                    [Sequelize.fn('sum', Sequelize.literal(`case when hour IN (${rangeHour.join(',')}) and dow NOT IN (0,6) and dd NOT IN (${strHoliday}) then diff_kWh else 0 end`)), 'onPeak'],
                    [Sequelize.fn('sum', Sequelize.literal(`case when hour NOT IN (${rangeHour.join(',')}) or dow IN (0,6) or dd IN (${strHoliday}) then diff_kWh else 0 end`)), 'offPeak'],
                ],
                where: whereCondition,
                raw: true
            })

            return res.send({
                'total': kWh.onPeak + kWh.offPeak || 0,
                'onPeak': kWh.onPeak || 0,
                'offPeak': kWh.offPeak || 0
            })

        } catch (err) {
            console.error(err)
            return res.status(500).send(err.message)
        }
    },

    async total_kWhDailyDevice(req, res) {
        try {
            const config = await utilities.readJSONFile('config/config.json')
            const startOnPeak = config.startOnPeak
            const endOnPeak = config.endOnPeak
            let whereCondition = {}
            let formatDate = "YYYY-MM-DDTHH:mm:ss.SSSZ";
            const {
                selectDate,
                meter_id
            } = req.query
            if (!selectDate) return res.status(400).json({
                'message': 'selectDate is required'
            })

            if (!moment(selectDate, formatDate, true).isValid()) throw new Error('Invalid Date')

            const selectDateTimezone = moment.tz(selectDate, config.timezone)
            let startDate = selectDateTimezone.clone().startOf('date').toISOString();
            let endDate = selectDateTimezone.clone().endOf('date').toISOString();

            if (meter_id) whereCondition.meter_id = meter_id
            whereCondition.timestamp = {
                [Op.between]: [startDate, endDate]
            }

            const rangeHour = fnConditionOnPeak(startOnPeak, endOnPeak, config.timezone)

            /* const kWh = await MeterLogging.findOne({
                attributes: [
                    [Sequelize.fn('sum', Sequelize.literal(`case when hour IN (${rangeHour.join(',')}) and dow NOT IN (0,6) then diff_kWh else 0 end`)), 'onPeak'],
                    [Sequelize.fn('sum', Sequelize.literal(`case when hour NOT IN (${rangeHour.join(',')}) or dow IN (0,6) then diff_kWh else 0 end`)), 'offPeak'],
                ],
                where: whereCondition,
                raw: true
            }) */
            const holidays = await Holiday.findAll({
                attributes:['holiday_date'],
                raw:true
            })
            let strHoliday = holidays.map(item => `'${item.holiday_date}'`).join()
            const kWh = await MeterLogging.findOne({
                attributes: [
                    [Sequelize.fn('sum', Sequelize.literal(`case when hour IN (${rangeHour.join(',')}) and dow NOT IN (0,6) and dd NOT IN (${strHoliday}) then diff_kWh else 0 end`)), 'onPeak'],
                    [Sequelize.fn('sum', Sequelize.literal(`case when hour NOT IN (${rangeHour.join(',')}) or dow IN (0,6) or dd IN (${strHoliday}) then diff_kWh else 0 end`)), 'offPeak'],
                ],
                where: whereCondition,
                raw: true
            })

            return res.send({
                'total': kWh.onPeak + kWh.offPeak || 0,
                'onPeak': kWh.onPeak || 0,
                'offPeak': kWh.offPeak || 0
            })

        } catch (err) {
            console.error(err)
            return res.status(500).send(err.message)
        }
    },



    async kWhEachMonthlyInYear(req, res) {
        try {
            let whereCondition = {}
            const config = await utilities.readJSONFile('config/config.json')
            const startOnPeak = config.startOnPeak
            const endOnPeak = config.endOnPeak

            let monthlySums = Array.from({
                length: 12
            }, (v, i) => ({
                t: moment().month(i).format('MMM'),
                onPeak: 0,
                offPeak: 0
            }))

            let formatDate = "YYYY-MM-DDTHH:mm:ss.SSSZ";
            const {
                selectDate,
                meter_id
            } = req.query

            if (!selectDate) return res.status(400).json({
                'message': 'selectDate is required'
            })

            if (!moment(selectDate, formatDate, true).isValid()) throw new Error('Invalid Date')

            const selectDateTimezone = moment.tz(selectDate, config.timezone)
            let startDate = selectDateTimezone.clone().startOf('year').toISOString();
            let endDate = selectDateTimezone.clone().endOf('year').toISOString();

            const holidays = await Holiday.findAll({
                attributes:['holiday_date'],
                raw:true
            })

            let arrHoliday = holidays.map(item => item.holiday_date)

            const rangeHour = fnConditionOnPeak(startOnPeak, endOnPeak, config.timezone)
            whereCondition = {
                timestamp: {[Op.between]: [startDate, endDate]},
                [Op.and] : [
                    {hour: {[Op.in]: rangeHour}},
                    {dow: {[Op.notIn]: [0,6]}},
                    {dd: {[Op.notIn]: arrHoliday}}
                ]
            }
            if (meter_id) whereCondition.meter_id = meter_id
            const kWhOnPeak = await MeterLogging.findAll({
                attributes: ['timestamp', 'hour', 'diff_kWh'],
                where: whereCondition
            })

            for (let i = 0; i < kWhOnPeak.length; i++) {
                const localDate = moment(kWhOnPeak[i].dataValues.timestamp).tz(config.timezone)
                monthlySums[localDate.month()].onPeak += kWhOnPeak[i].dataValues.diff_kWh
            }

            whereCondition = {
                timestamp: {[Op.between]: [startDate, endDate]},
                [Op.or] : [
                    {hour: {[Op.notIn]: rangeHour}},
                    {dow: {[Op.in]: [0,6]}},
                    {dd: {[Op.in]: arrHoliday}}
                ]
                
            }
            if (meter_id) whereCondition.meter_id = meter_id
            const kWhOffPeak = await MeterLogging.findAll({
                attributes: ['timestamp', 'hour', 'diff_kWh'],
                where: whereCondition
            })
            for (let i = 0; i < kWhOffPeak.length; i++) {
                const localDate = moment(kWhOffPeak[i].dataValues.timestamp).tz(config.timezone)
                monthlySums[localDate.month()].offPeak += kWhOffPeak[i].dataValues.diff_kWh
            }
            return res.send(monthlySums)

        } catch (err) {
            console.error(err)
            return res.status(500).send(err.message)
        }
    },

    async kWhEachDailyInMonth(req, res) {
        try {
            const config = await utilities.readJSONFile('config/config.json')
            const startOnPeak = config.startOnPeak
            const endOnPeak = config.endOnPeak

            let whereCondition = {}
            let formatDate = "YYYY-MM-DDTHH:mm:ss.SSSZ";
            const {
                selectDate,
                meter_id
            } = req.query
            if (!selectDate) return res.status(400).json({
                'message': 'selectDate is required'
            })

            if (!moment(selectDate, formatDate, true).isValid()) throw new Error('Invalid Date')

            let dailySums = Array.from({
                length: moment(selectDate).daysInMonth()
            }, (v, i) => ({
                t: i + 1,
                onPeak: 0,
                offPeak: 0
            }))

            const selectDateTimezone = moment.tz(selectDate, config.timezone)
            let startDate = selectDateTimezone.clone().startOf('month').toISOString();
            let endDate = selectDateTimezone.clone().endOf('month').toISOString();

            const holidays = await Holiday.findAll({
                attributes:['holiday_date'],
                raw:true
            })

            let arrHoliday = holidays.map(item => item.holiday_date)

            const rangeHour = fnConditionOnPeak(startOnPeak, endOnPeak, config.timezone)
            whereCondition = {
                timestamp: {[Op.between]: [startDate, endDate]},
                [Op.and] : [
                    {hour: {[Op.in]: rangeHour}},
                    {dow: {[Op.notIn]: [0,6]}},
                    {dd: {[Op.notIn]: arrHoliday}}
                ]
            }
            if (meter_id) whereCondition.meter_id = meter_id
            console.log("------------------------------------------------------------------------------------------------")
            const kWhOnPeak = await MeterLogging.findAll({
                attributes: ['timestamp', 'hour', 'diff_kWh'],
                where: whereCondition
            })
            console.log(("------------------------------------------------------------------------------------------------"))
            for (let i = 0; i < kWhOnPeak.length; i++) {
                const localDate = moment(kWhOnPeak[i].dataValues.timestamp).tz(config.timezone)
                dailySums[localDate.date() - 1].onPeak += kWhOnPeak[i].dataValues.diff_kWh
            }
            whereCondition = {
                timestamp: {[Op.between]: [startDate, endDate]},
                [Op.or] : [
                    {hour: {[Op.notIn]: rangeHour}},
                    {dow: {[Op.in]: [0,6]}},
                    {dd: {[Op.in]: arrHoliday}}
                ]
                
            }
            if (meter_id) whereCondition.meter_id = meter_id
            const kWhOffPeak = await MeterLogging.findAll({
                attributes: ['timestamp', 'hour', 'diff_kWh'],
                where: whereCondition
            })
            for (let i = 0; i < kWhOffPeak.length; i++) {
                const localDate = moment(kWhOffPeak[i].dataValues.timestamp).tz(config.timezone)
                dailySums[localDate.date() - 1].offPeak += kWhOffPeak[i].dataValues.diff_kWh
            }
            return res.send(dailySums)

        } catch (err) {
            return res.status(500).send(err.message)
        }
    },
    async kWhEachHourlyInDay(req, res) {
        try {
            const config = await utilities.readJSONFile('config/config.json')
            const startOnPeak = config.startOnPeak
            const endOnPeak = config.endOnPeak

            let whereCondition = {}

            let formatDate = "YYYY-MM-DDTHH:mm:ss.SSSZ";
            const {
                selectDate,
                meter_id
            } = req.query
            if (!selectDate) return res.status(400).json({
                'message': 'selectDate is required'
            })

            if (!moment(selectDate, formatDate, true).isValid()) throw new Error('Invalid Date')

            let hourlySums = Array.from({
                length: 24
            }, (v, i) => ({
                t: i + ':00',
                onPeak: 0,
                offPeak: 0
            }));

            const selectDateTimezone = moment.tz(selectDate, config.timezone)
            let startDate = selectDateTimezone.clone().startOf('date').toISOString();
            let endDate = selectDateTimezone.clone().endOf('date').toISOString();

            const holidays = await Holiday.findAll({
                attributes:['holiday_date'],
                raw:true
            })

            let arrHoliday = holidays.map(item => item.holiday_date)

            const rangeHour = fnConditionOnPeak(startOnPeak, endOnPeak, config.timezone)
            whereCondition = {
                timestamp: {[Op.between]: [startDate, endDate]},
                [Op.and] : [
                    {hour: {[Op.in]: rangeHour}},
                    {dow: {[Op.notIn]: [0,6]}},
                    {dd: {[Op.notIn]: arrHoliday}}
                ]
            }
            if (meter_id) whereCondition.meter_id = meter_id
            
            const kWhOnPeak = await MeterLogging.findAll({
                attributes: ['timestamp', 'diff_kWh'],
                where: whereCondition
            })
            for (let i = 0; i < kWhOnPeak.length; i++) {
                const localDate = moment(kWhOnPeak[i].dataValues.timestamp).tz(config.timezone)
                hourlySums[localDate.hour()].onPeak += kWhOnPeak[i].dataValues.diff_kWh
            }

            whereCondition = {
                timestamp: {[Op.between]: [startDate, endDate]},
                [Op.or] : [
                    {hour: {[Op.notIn]: rangeHour}},
                    {dow: {[Op.in]: [0,6]}},
                    {dd: {[Op.in]: arrHoliday}}
                ]
                
            }
            if (meter_id) whereCondition.meter_id = meter_id
            const kWhOffPeak = await MeterLogging.findAll({
                attributes: ['timestamp', 'diff_kWh'],
                where: whereCondition
            })
            for (let i = 0; i < kWhOffPeak.length; i++) {
                const localDate = moment(kWhOffPeak[i].dataValues.timestamp).tz(config.timezone)
                hourlySums[localDate.hour()].offPeak += kWhOffPeak[i].dataValues.diff_kWh
            }
            return res.send(hourlySums)

        } catch (err) {
            console.error(err)
            return res.status(500).send(err.message)
        }
    },
    async top5Consumption(req, res) {
        const config = await utilities.readJSONFile('config/config.json')
        let startDate = ""
        let endDate = ""
        const startOnPeak = config.startOnPeak
        const endOnPeak = config.endOnPeak

        const formatDate = "YYYY-MM-DDTHH:mm:ss.SSSZ";
        const {
            selectDate,
            method
        } = req.query
        if (!selectDate) return res.status(400).json({
            'message': 'selectDate is required'
        })

        if (!moment(selectDate, formatDate, true).isValid()) throw new Error('Invalid Date')

        const selectDateTimezone = moment.tz(selectDate, config.timezone)
        if (method === 'DAY') {
            startDate = selectDateTimezone.clone().startOf('date').toISOString();
            endDate = selectDateTimezone.clone().endOf('date').toISOString();
        } else if (method === 'MONTH') {
            startDate = selectDateTimezone.clone().startOf('month').toISOString();
            endDate = selectDateTimezone.clone().endOf('month').toISOString();
        } else if (method === 'YEAR') {
            startDate = selectDateTimezone.clone().startOf('year').toISOString();
            endDate = selectDateTimezone.clone().endOf('year').toISOString();
        } else {
            return res.status(400).json({
                'message': "method is require. Ex.method='DAY|MONTH|YEAR'"
            })
        }

        let whereCondition = {}

        whereCondition.timestamp = {
            [Op.between]: [startDate, endDate]
        }

        const holidays = await Holiday.findAll({
            attributes:['holiday_date'],
            raw:true
        })
        let strHoliday = holidays.map(item => `'${item.holiday_date}'`).join()

        const rangeHour = fnConditionOnPeak(startOnPeak, endOnPeak, config.timezone)
        const kWh = await MeterLogging.findAll({
            attributes: [
                [Sequelize.fn('sum', Sequelize.col('diff_kWh')), 'totalKWh'],
                [Sequelize.fn('sum', Sequelize.literal(`case when hour IN (${rangeHour.join(',')}) and dow NOT IN (0,6) and dd NOT IN (${strHoliday}) then diff_kWh else 0 end`)), 'onPeak'],
                [Sequelize.fn('sum', Sequelize.literal(`case when hour NOT IN (${rangeHour.join(',')}) or dow IN (0,6) or dd IN (${strHoliday}) then diff_kWh else 0 end`)), 'offPeak'],
            ],
            group: ['name'],
            where: whereCondition,
            order: [
                ['totalKWh', 'DESC']
            ],
            limit: 5,
            raw: true,
            include: [{
                model: Meter,
                attributes: ['name'],
                required: false,
            }]
        })

        return res.send(kWh)
    },
    async onPeakHour(req, res) {
        const config = await utilities.readJSONFile('config/config.json')
        let startOnPeak = config.startOnPeak
        let endOnPeak = config.endOnPeak
        let conditionOnPeak = []

        do {
            conditionOnPeak.push(startOnPeak)
            if (startOnPeak + 1 === 24) startOnPeak = 0
            else startOnPeak = startOnPeak + 1
        } while (startOnPeak !== endOnPeak)

        return res.json({
            'onPeak': conditionOnPeak
        })
    }
}

function fnConditionOnPeak(startOnPeak, endOnPeak, timezone) {
    let utcStart = Number(moment(startOnPeak, 'H').tz(timezone).utc().format('H'))
    const utcEnd = Number(moment(endOnPeak, 'H').tz(timezone).utc().format('H'))
    let conditionOnPeak = []
    do {
        conditionOnPeak.push(utcStart)
        if (utcStart + 1 === 24) utcStart = 0
        else utcStart = utcStart + 1
    } while (utcStart !== utcEnd)
    return conditionOnPeak;
}

function fnConditionOnPeak(startOnPeak, endOnPeak, timezone) {
    let utcStart = Number(moment(startOnPeak, 'H').tz(timezone).utc().format('H'))
    const utcEnd = Number(moment(endOnPeak, 'H').tz(timezone).utc().format('H'))
    let conditionOnPeak = []
    do {
        conditionOnPeak.push(utcStart)
        if (utcStart + 1 === 24) utcStart = 0
        else utcStart = utcStart + 1
    } while (utcStart !== utcEnd)
    return conditionOnPeak;
}