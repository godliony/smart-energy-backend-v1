const {MeterLogging,Meter} = require('../models')
const { Op, where } = require("sequelize");
const moment = require('moment-timezone');
const NodeCache = require( "node-cache" );
const myCache = new NodeCache();

/* async function getOrCalKwhLifeTime(meter_id){
    const key = `energy/${meter_id}/lifetime`
    try{
        let meterDataJson = {}
        const result = myCache.get(key)
        if(result) return result
        else{
            console.log("meterLogging create cache")
            let meterLogging = await MeterLogging.findAll({
                attributes: [['timestamp','t'], 'kwh'],
                where:{
                    meter_id: meter_id
                },
                order: [
                    ['timestamp', 'ASC'],
                ]
            })
            meterDataJson={
                'meter_id': meter_id,
                'data': meterLogging
            }

            let totalLiftTime = 0
            let onPeak = 0
            let offPeak = 0

            let onPeakStart = 9
            let offPeakStart = 22

            //เมื่อ get ค่าจากฐานข้อมูลได้แล้ว ให้ใส่โค้ดนี้ลงด้านล่าง
            // ตัวแปร meterDataJson เป็นตัวแปรที่เก็บค่าข้อมูลที่ get มาได้
            for(let i=1; i<meterDataJson.data.length; i++){
                const localDate = moment.utc(meterDataJson.data[i-1].dataValues.t.replace(' ', 'T').replace(' +00:00', 'Z'));
                let day = moment(localDate).day()
                const hour = moment(localDate).hour();
                const diff = meterDataJson.data[i].dataValues.kwh - meterDataJson.data[i-1].dataValues.kwh;
                if(hour >= onPeakStart && hour < offPeakStart &&day !== 0 && day !== 6)
                    onPeak += diff
                else
                    offPeak += diff
                totalLiftTime += diff
            }
            const jsonData = {
                'totalLiftTime':totalLiftTime,
                'onPeak': onPeak,
                'offPeak': offPeak,
            }
            myCache.set(key, jsonData, 60 * 5)
            return jsonData
        }
    }catch(e){
        console.log(e)
        return {}
    }   
} */

async function getOrCalKwhLifeTime(meter_id){
    const key = `energy/${meter_id}/lifetime`
    try{
        let meterDataJson = {}
        const result = myCache.get(key)
        if(result) return result
        else{
            console.log("meterLogging create cache")
            let meterLogging = await MeterLogging.findAll({
                attributes: [['timestamp','t'], 'kwh'],
                where:{
                    meter_id: meter_id
                },
                order: [
                    ['timestamp', 'ASC'],
                ]
            })
            meterDataJson={
                'meter_id': meter_id,
                'data': meterLogging
            }

            let totalLiftTime = 0
            let onPeak = 0
            let offPeak = 0

            let onPeakStart = 9
            let offPeakStart = 22

            //เมื่อ get ค่าจากฐานข้อมูลได้แล้ว ให้ใส่โค้ดนี้ลงด้านล่าง
            // ตัวแปร meterDataJson เป็นตัวแปรที่เก็บค่าข้อมูลที่ get มาได้
            for(let i=1; i<meterDataJson.data.length; i++){
                const localDate = moment.utc(meterDataJson.data[i-1].dataValues.t.replace(' ', 'T').replace(' +00:00', 'Z'));
                let day = moment(localDate).day()
                const hour = moment(localDate).hour();
                const diff = meterDataJson.data[i].dataValues.kwh - meterDataJson.data[i-1].dataValues.kwh;
                if(hour >= onPeakStart && hour < offPeakStart &&day !== 0 && day !== 6)
                    onPeak += diff
                else
                    offPeak += diff
                totalLiftTime += diff
            }
            const jsonData = {
                'totalLiftTime':totalLiftTime,
                'onPeak': onPeak,
                'offPeak': offPeak,
            }
            myCache.set(key, jsonData, 60 * 5)
            return jsonData
        }
    }catch(e){
        console.log(e)
        return {}
    }   
}

async function getOrCalKwhLifeTime(meter_id){
    const key = `energy/${meter_id}/lifetime`
    try{
        let meterDataJson = {}
        const result = myCache.get(key)
        if(result) return result
        else{
            console.log("meterLogging create cache")
            let meterLogging = await MeterLogging.findAll({
                attributes: [['timestamp','t'], 'kwh'],
                where:{
                    meter_id: meter_id
                },
                order: [
                    ['timestamp', 'ASC'],
                ]
            })
            meterDataJson={
                'meter_id': meter_id,
                'data': meterLogging
            }

            let totalLiftTime = 0
            let onPeak = 0
            let offPeak = 0

            let onPeakStart = 9
            let offPeakStart = 22

            //เมื่อ get ค่าจากฐานข้อมูลได้แล้ว ให้ใส่โค้ดนี้ลงด้านล่าง
            // ตัวแปร meterDataJson เป็นตัวแปรที่เก็บค่าข้อมูลที่ get มาได้
            for(let i=1; i<meterDataJson.data.length; i++){
                const localDate = moment.utc(meterDataJson.data[i-1].dataValues.t.replace(' ', 'T').replace(' +00:00', 'Z'));
                let day = moment(localDate).day()
                const hour = moment(localDate).hour();
                const diff = meterDataJson.data[i].dataValues.kwh - meterDataJson.data[i-1].dataValues.kwh;
                if(hour >= onPeakStart && hour < offPeakStart &&day !== 0 && day !== 6)
                    onPeak += diff
                else
                    offPeak += diff
                totalLiftTime += diff
            }
            const jsonData = {
                'totalLiftTime':totalLiftTime,
                'onPeak': onPeak,
                'offPeak': offPeak,
            }
            myCache.set(key, jsonData, 60 * 5)
            return jsonData
        }
    }catch(e){
        console.log(e)
        return {}
    }   
}
async function getOrCalKwhYearly(meter_id, selectDate){
    try{
        const yearDate = moment.utc(selectDate).format('YYYY')
        const key = `energy/${meter_id}/yearly/${yearDate}`
        let meterDataJson = {}
        const result = myCache.get(key)
        if(result) return result
        else{
            console.log("meterLogging create cache")
            let startDate = moment.utc(selectDate).startOf('year').toDate();
            let endDate = moment.utc(selectDate).endOf('year').toDate();
            console.log(startDate)
            let meterLogging = await MeterLogging.findAll({
                attributes: [['timestamp','t'], 'kwh'],
                where:{
                    meter_id: meter_id,
                    timestamp:  {
                        [Op.between]: [startDate, endDate]
                    }
                },
                order: [
                    ['timestamp', 'ASC'],
                ]
            })
            meterDataJson = {
                'meter_id': meter_id,
                'data': meterLogging
            }

            let totalYearly = 0
            let onPeak = 0
            let offPeak = 0

            let onPeakStart = 9
            let offPeakStart = 22

            //เมื่อ get ค่าจากฐานข้อมูลได้แล้ว ให้ใส่โค้ดนี้ลงด้านล่าง
            // ตัวแปร meterDataJson เป็นตัวแปรที่เก็บค่าข้อมูลที่ get มาได้
            for(let i=1; i<meterDataJson.data.length; i++){
                const localDate = moment.utc(meterDataJson.data[i-1].dataValues.t.replace(' ', 'T').replace(' +00:00', 'Z'));
                let day = moment(localDate).day()
                const hour = moment(localDate).hour();
                const diff = meterDataJson.data[i].dataValues.kwh - meterDataJson.data[i-1].dataValues.kwh; 
                if(hour >= onPeakStart && hour < offPeakStart && day !== 0 && day !== 6)
                    onPeak += diff
                else
                    offPeak += diff
                totalYearly += diff
            }
            const jsonData = {
                'totalYearly':totalYearly,
                'onPeak': onPeak,
                'offPeak': offPeak,
            }
            myCache.set(key, jsonData, 60 * 5)
            console.log(jsonData)
            return jsonData
        }
    }catch(e){
        console.log(e)
        return {}
    }   
}

/* async function getOrCalKwhMonthly(meter_id, selectDate){
    const monthDate = moment.utc(selectDate).format('YYYY-MM')
    const key = `energy/${meter_id}/monthly/${monthDate}`
    try{
        let meterDataJson = {}
        const result = myCache.get(key)
        if(result) return result
        else{
            console.log("meterLogging create cache")
            let startDate = moment.utc(selectDate).startOf('month').toDate();
            let endDate = moment.utc(selectDate).endOf('month').toDate();
            let meterLogging = await MeterLogging.findAll({
                attributes: [['timestamp','t'], 'kwh'],
                where:{
                    meter_id: meter_id,
                    timestamp:  {
                        [Op.between]: [startDate, endDate]
                    }
                },
                order: [
                    ['timestamp', 'ASC'],
                ]
            })
            meterDataJson = {
                'meter_id': meter_id,
                'data': meterLogging
            }

            let totalMonthly = 0
            let onPeak = 0
            let offPeak = 0

            let onPeakStart = 9
            let offPeakStart = 22

            //เมื่อ get ค่าจากฐานข้อมูลได้แล้ว ให้ใส่โค้ดนี้ลงด้านล่าง
            // ตัวแปร meterDataJson เป็นตัวแปรที่เก็บค่าข้อมูลที่ get มาได้
            for(let i=1; i<meterDataJson.data.length; i++){
                const localDate = moment.utc(meterDataJson.data[i-1].dataValues.t.replace(' ', 'T').replace(' +00:00', 'Z'));
                let day = moment(localDate).day()
                const hour = moment(localDate).hour();
                const diff = meterDataJson.data[i].dataValues.kwh - meterDataJson.data[i-1].dataValues.kwh; /////////////////ยังไม่ตรง ผลรวมไม่ตรงกับ kwhTotal แก้ด้วยยยยยยยยยยยยยยยยยยยยยย
                if(hour >= onPeakStart && hour < offPeakStart && day !== 0 && day !== 6)
                    onPeak += diff
                else
                    offPeak += diff
                totalMonthly += diff
            }
            const jsonData = {
                'totalMonthly':totalMonthly,
                'onPeak': onPeak,
                'offPeak': offPeak,
            }
            myCache.set(key, jsonData, 60 * 5)
            return jsonData
        }
    }catch(e){
        console.log(e)
        return {}
    }   
} */

async function getOrCalKwhMonthly(meter_id, selectDate){
    const monthDate = moment.utc(selectDate).format('YYYY-MM')
    const key = `energy/${meter_id}/monthly/${monthDate}`
    try{
        let meterDataJson = {}
        const result = myCache.get(key)
        if(result) return result
        else{
            console.log("meterLogging create cache")
            let startDate = moment.utc(selectDate).startOf('month').toDate();
            let endDate = moment.utc(selectDate).endOf('month').toDate();
            let meterLogging = await MeterLogging.findAll({
                attributes: [['timestamp','t'], 'kwh'],
                where:{
                    id: {
                        [Op.in]: meter_id,
                    },
                    timestamp:  {
                        [Op.between]: [startDate, endDate]
                    }
                },
                order: [
                    ['meter_id', 'ASC'],
                    ['timestamp', 'ASC'],
                ]
            })
            

            let totalMonthly = 0
            let onPeak = 0
            let offPeak = 0

            let onPeakStart = 9
            let offPeakStart = 22

            //เมื่อ get ค่าจากฐานข้อมูลได้แล้ว ให้ใส่โค้ดนี้ลงด้านล่าง
            // ตัวแปร meterDataJson เป็นตัวแปรที่เก็บค่าข้อมูลที่ get มาได้
            for(let i=1; i<meterDataJson.data.length; i++){
                const localDate = moment.utc(meterDataJson.data[i-1].dataValues.t.replace(' ', 'T').replace(' +00:00', 'Z'));
                let day = moment(localDate).day()
                const hour = moment(localDate).hour();
                const diff = meterDataJson.data[i].dataValues.kwh - meterDataJson.data[i-1].dataValues.kwh; /////////////////ยังไม่ตรง ผลรวมไม่ตรงกับ kwhTotal แก้ด้วยยยยยยยยยยยยยยยยยยยยยย
                if(hour >= onPeakStart && hour < offPeakStart && day !== 0 && day !== 6)
                    onPeak += diff
                else
                    offPeak += diff
                totalMonthly += diff
            }
            const jsonData = {
                'totalMonthly':totalMonthly,
                'onPeak': onPeak,
                'offPeak': offPeak,
            }
            myCache.set(key, jsonData, 60 * 5)
            return jsonData
        }
    }catch(e){
        console.log(e)
        return {}
    }   
}

async function getOrCalKwhDaily(meter_id, selectDate){
    const dayDate = moment.utc(selectDate).format('YYYY-MM-DD')
    const key = `energy/${meter_id}/daily/${dayDate}`
    try{
        let meterDataJson = {}
        const result = myCache.get(key)
        if(result) return result
        else{
            console.log("meterLogging create cache")
            let startDate = moment.utc(selectDate).startOf('day').toDate();
            let endDate = moment.utc(selectDate).endOf('day').toDate();
            let meterLogging = await MeterLogging.findAll({
                attributes: [['timestamp','t'], 'kwh'],
                where:{
                    meter_id: meter_id,
                    timestamp:  {
                        [Op.between]: [startDate, endDate]
                    }
                },
                order: [
                    ['timestamp', 'ASC'],
                ]
            })
            meterDataJson = {
                'meter_id': meter_id,
                'data': meterLogging
            }

            let totalDaily = 0
            let onPeak = 0
            let offPeak = 0

            let onPeakStart = 9
            let offPeakStart = 22

            //เมื่อ get ค่าจากฐานข้อมูลได้แล้ว ให้ใส่โค้ดนี้ลงด้านล่าง
            // ตัวแปร meterDataJson เป็นตัวแปรที่เก็บค่าข้อมูลที่ get มาได้
            for(let i=1; i<meterDataJson.data.length; i++){
                const localDate = moment.utc(meterDataJson.data[i-1].dataValues.t.replace(' ', 'T').replace(' +00:00', 'Z'));
                let day = moment(localDate).day()
                const hour = moment(localDate).hour();
                const diff = meterDataJson.data[i].dataValues.kwh - meterDataJson.data[i-1].dataValues.kwh; /////////////////ยังไม่ตรง ผลรวมไม่ตรงกับ kwhTotal แก้ด้วยยยยยยยยยยยยยยยยยยยยยย
                if(hour >= onPeakStart && hour < offPeakStart && day !== 0 && day !== 6)
                    onPeak += diff
                else
                    offPeak += diff
                    totalDaily += diff
            }
            const jsonData = {
                'totalDaily':totalDaily,
                'onPeak': onPeak,
                'offPeak': offPeak,
            }
            myCache.set(key, jsonData, 60 * 5)
            console.log(jsonData)
            return jsonData
        }
    }catch(e){
        console.log(e)
        return {}
    }   
}


module.exports = {
    
    /* async kWhEachHourlyInDay(req, res) {
        try {
            let formatDate = "YYYY-MM-DDTHH:mm:ss.SSSZ";
            let whereCondition = {}
            const {selectDate, meter_id} = req.query
            //console.log(req.query)
            if(!selectDate) return res.status(400).json({
                'message': 'selectDate is required'
            })

            

            if(!moment(selectDate, formatDate, true).isValid()) throw new Error('Invalid Date')

            let startDate = moment.utc(selectDate).startOf('day').toDate();
            let endDate = moment.utc(selectDate).endOf('day').toDate();

            if(selectDate){
                whereCondition.timestamp = {
                    [Op.between]: [startDate, endDate]
                }
            }

            let meterDataJson = []
            if(meter_id){
                whereCondition.meter_id = meter_id
                let meterLogging = await MeterLogging.findAll({
                    attributes: [['timestamp','t'], 'kwh'],
                    where: whereCondition
                })
                meterDataJson.push({
                    'meter_id': meter_id,
                    'data': meterLogging
                })
            }else{
                const meter = await Meter.findAll({
                    attributes: ['id'],
                })
                meterDataJson = await Promise.all(meter.map(async (meter)=>{
                    whereCondition.meter_id = meter.dataValues.id
                    let meterLogging = await MeterLogging.findAll({
                        attributes: [['timestamp','t'], 'kwh'],
                        where: whereCondition
                    })
                    return {
                        'meter_id': meter.dataValues.id,
                        'data': meterLogging
                    }
                }))
            }
            return res.send(meterDataJson)

            //Frontend คำนวณใน 1 วัน

            //กำหนดตัวแปรนี้ใน data ของ Vue
            let totalDailySums = 0
            let onPeakSums = 0
            let offPeakSums = 0

            let hourlySums = Array.from({length: 24}, (v, i) => ({t: i + ':00', kwh: 0}));
            let onPeakStart = 9
            let offPeakStart = 22

            //เมื่อ get ค่าจากฐานข้อมูลได้แล้ว ให้ใส่โค้ดนี้ลงด้านล่าง
            // ตัวแปร meterDataJson เป็นตัวแปรที่เก็บค่าข้อมูลที่ get มาได้
            for(let i=0; i<meterDataJson.length; i++){
                for(let j=1; j<meterDataJson[i].data.length; j++){
                    const localDate = moment.utc(meterDataJson[i].data[j-1].t).tz('Asia/Bangkok');
                    const hour = moment(localDate).hour();
                    const diff = meterDataJson[i].data[j].kwh - meterDataJson[i].data[j-1].kwh;
                    if(hour >= onPeakStart && hour < offPeakStart)
                        onPeakSums += diff
                    else
                        offPeakSums += diff
                    hourlySums[hour].kwh += diff;
                    totalDailySums += diff
                }
            }
            return res.send({
                'hourlySums': hourlySums,
                'onPeakSums': onPeakSums,
                'offPeakSums': offPeakSums,
                'totalDailySums': totalDailySums
            })

            

            

        } catch (err) {
            console.log(err)
            return res.status(500).send(err.message)
        }
    }, */
    /* async kWhTotal(req, res) {
        try {
            let whereCondition = {}
            const {meter_id} = req.query

            let meterDataJson = []
            if(meter_id){
                whereCondition.meter_id = meter_id
                let meterLogging = await MeterLogging.findAll({
                    attributes: [['timestamp','t'], 'kwh'],
                })
                meterDataJson.push({
                    'meter_id': meter_id,
                    'data': meterLogging
                })
            }else{
                const meter = await Meter.findAll({
                    attributes: ['id'],
                })
                meterDataJson = await Promise.all(meter.map(async (meter)=>{
                    whereCondition.meter_id = meter.dataValues.id
                    let meterLogging = await MeterLogging.findAll({
                        attributes: [['timestamp','t'], 'kwh'],
                        where: whereCondition
                    })
                    return {
                        'meter_id': meter.dataValues.id,
                        'data': meterLogging
                    }
                }))
            }
            return res.send(meterDataJson)

        } catch (err) {
            console.log(err)
            return res.status(500).send(err.message)
        }
    }, */
    /* async kWhTotal(req,res){
        try {
            const {meter_id} = req.query

            let meterDataJson = []
            if(meter_id){
                const dataJsonkWhliftTime = await getOrCalKwhLifeTime(meter_id)
                return res.send(dataJsonkWhliftTime)
            }else{
                const meter = await Meter.findAll({
                    attributes: ['id'],
                })
                meterDataJson = await Promise.all(meter.map(async (meter)=>{
                    whereCondition.meter_id = meter.dataValues.id
                    let meterLogging = await MeterLogging.findAll({
                        attributes: [['timestamp','t'], 'kwh'],
                        where: whereCondition
                    })
                    return {
                        'meter_id': meter.dataValues.id,
                        'data': meterLogging
                    }
                }))
            }
            return res.send(meterDataJson)

        } catch (err) {
            console.log(err)
            return res.status(500).send(err.message)
        }
    }, */

    async total_kWhLifeTime(req,res){
        const startOnPeak = 9
        const endOnPeak = 22
        const {meter_id} = req.query
        let whereCondition = {}
        try {
            if(meter_id) whereCondition.meter_id = meter_id

            whereCondition.hour = {[Op.between]: [startOnPeak, endOnPeak] }
            const totalKwhOnPeak = await MeterLogging.sum('diff_kwh',{
                where: whereCondition
            })

            whereCondition.hour = {[Op.notBetween]: [startOnPeak, endOnPeak] }
            const totalKwhOffPeak = await MeterLogging.sum('diff_kwh',{
                where: whereCondition
            })
            
            return res.send({
                'total': totalKwhOnPeak+totalKwhOffPeak,
                'onPeak': totalKwhOnPeak,
                'offPeak': totalKwhOffPeak
            })

        } catch (err) {
            console.log(err)
            return res.status(500).send(err.message)
        }
    },
    /* async total_kWhAllDevice(req,res){
        try {
            let jsonData = {totalLiftTime: 0, onPeak: 0, offPeak: 0}
            const meter = await Meter.findAll({
                attributes: ['id'],
            })
            for(let i=0; i<meter.length; i++){
                const dataJsonkWhliftTime = await getOrCalKwhLifeTime(meter[i].dataValues.id)
                jsonData.totalLiftTime += dataJsonkWhliftTime.totalLiftTime
                jsonData.onPeak += dataJsonkWhliftTime.onPeak
                jsonData.offPeak += dataJsonkWhliftTime.offPeak
            }
            return res.send(jsonData)

        } catch (err) {
            console.log(err)
            return res.status(500).send(err.message)
        }
    }, */
    /* async total_kWhYearlyAllDevice(req,res){
        try {
            let jsonData = {totalYearly: 0, onPeak: 0, offPeak: 0}
            let formatDate = "YYYY-MM-DDTHH:mm:ss.SSSZ";
            const {selectDate} = req.query
            //console.log(req.query)
            if(!selectDate) return res.status(400).json({
                'message': 'selectDate is required'
            })

            if(!moment(selectDate, formatDate, true).isValid()) throw new Error('Invalid Date')

            const meter = await Meter.findAll({
                attributes: ['id'],
            })
            for(let i=0; i<meter.length; i++){
                const dataJsonkWhliftTime = await getOrCalKwhYearly(meter[i].dataValues.id,selectDate)
                jsonData.totalYearly += dataJsonkWhliftTime.totalYearly
                jsonData.onPeak += dataJsonkWhliftTime.onPeak
                jsonData.offPeak += dataJsonkWhliftTime.offPeak
            }
            return res.send(jsonData)

        } catch (err) {
            console.log(err)
            return res.status(500).send(err.message)
        }
    }, */
    async total_kWhYearlyDevice(req,res){
        try {
            let whereCondition = {}

            const startOnPeak = 9
            const endOnPeak = 22

            let formatDate = "YYYY-MM-DDTHH:mm:ss.SSSZ";
            const {selectDate,meter_id} = req.query
            //console.log(req.query)
            if(!selectDate) return res.status(400).json({
                'message': 'selectDate is required'
            })

            if(!moment(selectDate, formatDate, true).isValid()) throw new Error('Invalid Date')

            let startDate = moment.utc(selectDate).startOf('year').toDate();
            let endDate = moment.utc(selectDate).endOf('year').toDate();

            if(meter_id) whereCondition.meter_id = meter_id
            whereCondition.timestamp = {[Op.between]: [startDate, endDate]}
            whereCondition.hour = {[Op.between]: [startOnPeak, endOnPeak] }

            const totalKwhOnPeak = await MeterLogging.sum('diff_kwh',{
                where: whereCondition
            })

            whereCondition.hour = {[Op.notBetween]: [startOnPeak, endOnPeak] }
            const totalKwhOffPeak = await MeterLogging.sum('diff_kwh',{
                where: whereCondition
            })
            
            return res.send({
                'total': totalKwhOnPeak+totalKwhOffPeak || 0,
                'onPeak': totalKwhOnPeak || 0,
                'offPeak': totalKwhOffPeak || 0
            })

        } catch (err) {
            console.log(err)
            return res.status(500).send(err.message)
        }
    },
    /* async total_kWhMonthlyAllDevice(req,res){
        try {
            let jsonData = {totalMonthly: 0, onPeak: 0, offPeak: 0}
            let formatDate = "YYYY-MM-DDTHH:mm:ss.SSSZ";
            const {selectDate} = req.query
            //console.log(req.query)
            if(!selectDate) return res.status(400).json({
                'message': 'selectDate is required'
            })

            if(!moment(selectDate, formatDate, true).isValid()) throw new Error('Invalid Date')

            const meter = await Meter.findAll({
                attributes: ['id'],
            })
            for(let i=0; i<meter.length; i++){
                const dataJsonkWhMonthly = await getOrCalKwhMonthly(meter[i].dataValues.id,selectDate)
                jsonData.totalMonthly += dataJsonkWhMonthly.totalMonthly
                jsonData.onPeak += dataJsonkWhMonthly.onPeak
                jsonData.offPeak += dataJsonkWhMonthly.offPeak
            }
            return res.send(jsonData)

        } catch (err) {
            console.log(err)
            return res.status(500).send(err.message)
        }
    }, */
    async total_kWhMonthlyDevice(req,res){
        try {

            const {meter_id} = req.query
            let whereCondition = {}

            const startOnPeak = 9
            const endOnPeak = 22

            let formatDate = "YYYY-MM-DDTHH:mm:ss.SSSZ";
            const {selectDate} = req.query
            //console.log(req.query)
            if(!selectDate) return res.status(400).json({
                'message': 'selectDate is required'
            })

            if(!moment(selectDate, formatDate, true).isValid()) throw new Error('Invalid Date')

            let startDate = moment.utc(selectDate).startOf('month').toDate();
            let endDate = moment.utc(selectDate).endOf('month').toDate();

            const totalKwhOnPeak = await MeterLogging.sum('diff_kwh',{
                where:{
                    timestamp: {
                        [Op.between]: [startDate, endDate]
                    },
                    hour: {
                        [Op.between]: [startOnPeak, endOnPeak]
                    }
                }
            })
            const totalKwhOffPeak = await MeterLogging.sum('diff_kwh',{
                where:{
                    timestamp: {
                        [Op.between]: [startDate, endDate]
                    },
                    hour: {
                        [Op.notBetween]: [startOnPeak, endOnPeak]
                    }
                }
            })
            
            return res.send({
                'total': totalKwhOnPeak+totalKwhOffPeak || 0,
                'onPeak': totalKwhOnPeak || 0,
                'offPeak': totalKwhOffPeak || 0
            })

        } catch (err) {
            console.log(err)
            return res.status(500).send(err.message)
        }
    },
    /* async total_kWhDailyAllDevice(req,res){
        try {
            let jsonData = {totalDaily: 0, onPeak: 0, offPeak: 0}
            let formatDate = "YYYY-MM-DDTHH:mm:ss.SSSZ";
            const {selectDate} = req.query
            //console.log(req.query)
            if(!selectDate) return res.status(400).json({
                'message': 'selectDate is required'
            })

            if(!moment(selectDate, formatDate, true).isValid()) throw new Error('Invalid Date')

            const meter = await Meter.findAll({
                attributes: ['id'],
            })
            for(let i=0; i<meter.length; i++){
                const dataJsonkWhliftTime = await getOrCalKwhDaily(meter[i].dataValues.id,selectDate)
                jsonData.totalDaily += dataJsonkWhliftTime.totalDaily
                jsonData.onPeak += dataJsonkWhliftTime.onPeak
                jsonData.offPeak += dataJsonkWhliftTime.offPeak
            }
            return res.send(jsonData)

        } catch (err) {
            console.log(err)
            return res.status(500).send(err.message)
        }
    }, */

    async total_kWhDailyDevice(req,res){
        try {
            const startOnPeak = 9
            const endOnPeak = 22

            let formatDate = "YYYY-MM-DDTHH:mm:ss.SSSZ";
            const {selectDate} = req.query
            //console.log(req.query)
            if(!selectDate) return res.status(400).json({
                'message': 'selectDate is required'
            })

            if(!moment(selectDate, formatDate, true).isValid()) throw new Error('Invalid Date')

            let startDate = moment.utc(selectDate).startOf('date').toDate();
            let endDate = moment.utc(selectDate).endOf('date').toDate();

            const totalKwhOnPeak = await MeterLogging.sum('diff_kwh',{
                where:{
                    timestamp: {
                        [Op.between]: [startDate, endDate]
                    },
                    hour: {
                        [Op.between]: [startOnPeak, endOnPeak]
                    }
                }
            })
            const totalKwhOffPeak = await MeterLogging.sum('diff_kwh',{
                where:{
                    timestamp: {
                        [Op.between]: [startDate, endDate]
                    },
                    hour: {
                        [Op.notBetween]: [startOnPeak, endOnPeak]
                    }
                }
            })
            
            return res.send({
                'total': totalKwhOnPeak+totalKwhOffPeak || 0,
                'onPeak': totalKwhOnPeak || 0,
                'offPeak': totalKwhOffPeak || 0
            })

        } catch (err) {
            console.log(err)
            return res.status(500).send(err.message)
        }
    },

    /* async kWhEachMonthlyInYear(req, res) {
        try {
            const MM = ['01','02','03','04','05','06','07','08','09','10','11','12']
            let monthlySums = Array.from({length: 12},(v,i) => ({t: moment().month(i).format('MMM'), onPeak: 0, offPeak: 0}))
            
            let formatDate = "YYYY-MM-DDTHH:mm:ss.SSSZ";
            let whereCondition = {}
            let meterDataJson = []
            const {selectDate, meter_id} = req.query
            //console.log(req.query)
            if(!selectDate) return res.status(400).json({
                'message': 'selectDate is required'
            })

            
            const meterLogging = await MeterLogging.findAll({
                attributes: [['timestamp','t'],'meter_id', 'kwh'],
                order: [
                    ['meter_id', 'ASC'],
                    ['timestamp', 'ASC'],
                ]
            })
            
            return res.send(meterLogging)
            if(!moment(selectDate, formatDate, true).isValid()) throw new Error('Invalid Date')
            for(let i=0; i<MM.length; i++){
                const date = selectDate.replace(`-${selectDate.substr(5,2)}-`,`-${MM[i]}-`)
                if(meter_id){
                    const kWhMonthly = await getOrCalKwhMonthly(meter_id, date)
                    monthlySums[i].onPeak += kWhMonthly.onPeak
                    monthlySums[i].offPeak += kWhMonthly.offPeak
                }else{
                    const meter = await Meter.findAll({
                        attributes: ['id'],
                    })
                    for(let j=0; j<meter.length; j++){
                        const kWhMonthly = await getOrCalKwhMonthly(meter[j].dataValues.id, date)
                        monthlySums[i].onPeak += kWhMonthly.onPeak
                        monthlySums[i].offPeak += kWhMonthly.offPeak
                    }
                }
                
            }
            return res.send(monthlySums)

        } catch (err) {
            console.log(err)
            return res.status(500).send(err.message)
        }
    }, */

    async kWhEachMonthlyInYear(req, res) {
        try {
            let monthlySums = Array.from({length: 12},(v,i) => ({t: moment().month(i).format('MMM'), onPeak: 0, offPeak: 0}))
            const startOnPeak = 9
            const endOnPeak = 22

            let formatDate = "YYYY-MM-DDTHH:mm:ss.SSSZ";
            const {selectDate} = req.query
            //console.log(req.query)
            if(!selectDate) return res.status(400).json({
                'message': 'selectDate is required'
            })

            if(!moment(selectDate, formatDate, true).isValid()) throw new Error('Invalid Date')

            let startDate = moment.utc(selectDate).startOf('year').toDate();
            let endDate = moment.utc(selectDate).endOf('year').toDate();

            const kWhOnPeak = await MeterLogging.findAll({
                attributes:['month','hour','diff_kwh'],
                where:{
                    timestamp: {
                        [Op.between]: [startDate, endDate]
                    },
                    hour: {
                        [Op.between]: [startOnPeak, endOnPeak]
                    }
                }
            })
            
            for(let i=0; i<kWhOnPeak.length; i++){
                monthlySums[kWhOnPeak[i].dataValues.month-1].onPeak += kWhOnPeak[i].dataValues.diff_kwh
            }

            const kWhOffPeak = await MeterLogging.findAll({
                attributes:['month','hour','diff_kwh'],
                where:{
                    timestamp: {
                        [Op.between]: [startDate, endDate]
                    },
                    hour: {
                        [Op.notBetween]: [startOnPeak, endOnPeak]
                    }
                }
            })
            for(let i=0; i<kWhOffPeak.length; i++){
                monthlySums[kWhOffPeak[i].dataValues.month-1].offPeak += kWhOffPeak[i].dataValues.diff_kwh
            }
            return res.send(monthlySums)
            
        } catch (err) {
            console.log(err)
            return res.status(500).send(err.message)
        }
    },

    /* async kWhEachMonthlyInYear(req, res) {
        try {
            let formatDate = "YYYY-MM-DDTHH:mm:ss.SSSZ";
            let whereCondition = {}
            const {selectDate, meter_id} = req.query
            //console.log(req.query)
            if(!selectDate) return res.status(400).json({
                'message': 'selectDate is required'
            })

            if(!moment(selectDate, formatDate, true).isValid()) throw new Error('Invalid Date')

            let startDate = moment.utc(selectDate).startOf('year').toDate();
            let endDate = moment.utc(selectDate).endOf('year').toDate();

            if(selectDate){
                whereCondition.timestamp = {
                    [Op.between]: [startDate, endDate]
                }
            }
            
            let meterDataJson = []
            if(meter_id){
                whereCondition.meter_id = meter_id
                let meterLogging = await MeterLogging.findAll({
                    attributes: [['timestamp','t'], 'kwh'],
                    where: whereCondition,
                    order: [
                        ['timestamp', 'ASC'],
                    ]
                })
                meterDataJson.push({
                    'meter_id': meter_id,
                    'data': meterLogging
                })
            }else{
                const meter = await Meter.findAll({
                    attributes: ['id'],
                })
                meterDataJson = await Promise.all(meter.map(async (meter)=>{
                    whereCondition.meter_id = meter.dataValues.id
                    let meterLogging = await MeterLogging.findAll({
                        attributes: [['timestamp','t'], 'kwh'],
                        where: whereCondition,
                        order: [
                            ['timestamp', 'ASC'],
                        ]
                    })
                    return {
                        'meter_id': meter.dataValues.id,
                        'data': meterLogging
                    }
                }))
            }

            let monthlySums = Array.from({length: 12},(v,i) => ({t: moment().month(i).format('MMM'), onPeak: 0, offPeak: 0}))
            let onPeakStart = 9
            let offPeakStart = 22

            //เมื่อ get ค่าจากฐานข้อมูลได้แล้ว ให้ใส่โค้ดนี้ลงด้านล่าง
            // ตัวแปร meterDataJson เป็นตัวแปรที่เก็บค่าข้อมูลที่ get มาได้
            for(let i=0; i<meterDataJson.length; i++){
                for(let j=1; j<meterDataJson[i].data.length; j++){
                    const localDate = moment.utc(meterDataJson[i].data[j-1].dataValues.t.replace(' ', 'T').replace(' +00:00', 'Z'));
                    let month = moment(localDate).month()
                    let day = moment(localDate).date()
                    const hour = moment(localDate).hour();
                    const diff = meterDataJson[i].data[j].dataValues.kwh - meterDataJson[i].data[j-1].dataValues.kwh;
                    if(hour >= onPeakStart && hour < offPeakStart && day !== 0 && day !== 6)
                        monthlySums[month].onPeak += diff
                    else
                        monthlySums[month].offPeak += diff
                }
            }

            return res.send({
                'monthlySums':monthlySums
            }) 

        } catch (err) {
            console.log(err)
            return res.status(500).send(err.message)
        }
    }, */
    async kWhEachDailyInMonth(req, res) {
        try {
            const startOnPeak = 9
            const endOnPeak = 22
            let whereCondition = {}
            let formatDate = "YYYY-MM-DDTHH:mm:ss.SSSZ";
            const {selectDate, meter_id} = req.query
            //console.log(req.query)
            if(!selectDate) return res.status(400).json({
                'message': 'selectDate is required'
            })

            if(!moment(selectDate, formatDate, true).isValid()) throw new Error('Invalid Date')

            let dailySums = Array.from({length: moment(selectDate).daysInMonth()},(v,i) => ({t: i+1, onPeak: 0, offPeak: 0}))

            let startDate = moment.utc(selectDate).startOf('month').toDate();
            let endDate = moment.utc(selectDate).endOf('month').toDate();

            if(meter_id) whereCondition.meter_id = meter_id
            whereCondition.hour = {[Op.between]: [startOnPeak, endOnPeak] }
            whereCondition.timestamp = {[Op.between]: [startDate, endDate]}

            const kWhOnPeak = await MeterLogging.findAll({
                attributes:['dom','hour','diff_kwh'],
                where: whereCondition
            })
            for(let i=0; i<kWhOnPeak.length; i++){
                dailySums[kWhOnPeak[i].dataValues.dom-1].onPeak += kWhOnPeak[i].dataValues.diff_kwh
            }

            whereCondition.hour = {[Op.notBetween]: [startOnPeak, endOnPeak] }
            const kWhOffPeak = await MeterLogging.findAll({
                attributes:['dom','hour','diff_kwh'],
                where: whereCondition
            })
            for(let i=0; i<kWhOffPeak.length; i++){
                dailySums[kWhOffPeak[i].dataValues.dom-1].offPeak += kWhOffPeak[i].dataValues.diff_kwh
            }
            return res.send(dailySums)
            
        } catch (err) {
            console.log(err)
            return res.status(500).send(err.message)
        }
    },
    async kWhEachHourlyInDay(req, res) {
        try {
            let whereCondition = {}

            const startOnPeak = 9
            const endOnPeak = 22

            let formatDate = "YYYY-MM-DDTHH:mm:ss.SSSZ";
            const {selectDate, meter_id} = req.query
            //console.log(req.query)
            if(!selectDate) return res.status(400).json({
                'message': 'selectDate is required'
            })

            if(!moment(selectDate, formatDate, true).isValid()) throw new Error('Invalid Date')

            let hourlySums = Array.from({length: 24}, (v, i) => ({t: i + ':00', onPeak: 0, offPeak: 0}));

            let startDate = moment.utc(selectDate).startOf('date').toDate();
            let endDate = moment.utc(selectDate).endOf('date').toDate();

            if(meter_id) whereCondition.meter_id = meter_id
            whereCondition.timestamp = {[Op.between]: [startDate, endDate]}
            whereCondition.hour = {[Op.between]: [startOnPeak, endOnPeak] }
            const kWhOnPeak = await MeterLogging.findAll({
                attributes:['hour','diff_kwh'],
                where: whereCondition
            })
            
            for(let i=0; i<kWhOnPeak.length; i++){
                hourlySums[kWhOnPeak[i].dataValues.hour].onPeak += kWhOnPeak[i].dataValues.diff_kwh
            }

            whereCondition.hour = {[Op.notBetween]: [startOnPeak, endOnPeak] }
            const kWhOffPeak = await MeterLogging.findAll({
                attributes:['hour','diff_kwh'],
                where: whereCondition
            })
            for(let i=0; i<kWhOffPeak.length; i++){
                hourlySums[kWhOffPeak[i].dataValues.hour].offPeak += kWhOffPeak[i].dataValues.diff_kwh
            }
            return res.send(hourlySums)
            
        } catch (err) {
            console.log(err)
            return res.status(500).send(err.message)
        }
    },
    /* async kWhEachDailyInMonth(req, res) {
        try {
            let formatDate = "YYYY-MM-DDTHH:mm:ss.SSSZ";
            let whereCondition = {}
            const {selectDate, meter_id} = req.query
            //console.log(req.query)
            if(!selectDate) return res.status(400).json({
                'message': 'selectDate is required'
            })

            if(!moment(selectDate, formatDate, true).isValid()) throw new Error('Invalid Date')

            let startDate = moment.utc(selectDate).startOf('month').toDate();
            let endDate = moment.utc(selectDate).endOf('month').toDate();

            if(selectDate){
                whereCondition.timestamp = {
                    [Op.between]: [startDate, endDate]
                }
            }

            let meterDataJson = []
            if(meter_id){
                whereCondition.meter_id = meter_id
                let meterLogging = await MeterLogging.findAll({
                    attributes: [['timestamp','t'], 'kwh'],
                    where: whereCondition
                })
                meterDataJson.push({
                    'meter_id': meter_id,
                    'data': meterLogging
                })
            }else{
                const meter = await Meter.findAll({
                    attributes: ['id'],
                })
                meterDataJson = await Promise.all(meter.map(async (meter)=>{
                    whereCondition.meter_id = meter.dataValues.id
                    let meterLogging = await MeterLogging.findAll({
                        attributes: [['timestamp','t'], 'kwh'],
                        where: whereCondition
                    })
                    return {
                        'meter_id': meter.dataValues.id,
                        'data': meterLogging
                    }
                }))
            }
            return res.send(meterDataJson)

            //Frontend คำนวณใน 1 เดือน

            //กำหนดตัวแปรนี้ใน data ของ Vue
            let totalMonthlySums = 0
            let onPeakSums = 0
            let offPeakSums = 0

            let dailySums = Array.from({length: moment().daysInMonth()},(v,i) => ({t: i+1, kwh: 0}))
            let onPeakStart = 9
            let offPeakStart = 22

            //เมื่อ get ค่าจากฐานข้อมูลได้แล้ว ให้ใส่โค้ดนี้ลงด้านล่าง
            // ตัวแปร meterDataJson เป็นตัวแปรที่เก็บค่าข้อมูลที่ get มาได้
            for(let i=0; i<meterDataJson.length; i++){
                for(let j=1; j<meterDataJson[i].data.length; j++){
                    const localDate = moment.utc(meterDataJson[i].data[j-1].dataValues.t).tz('Asia/Bangkok');
                    let day = moment(localDate).date()
                    const hour = moment(localDate).hour();
                    const diff = meterDataJson[i].data[j].dataValues.kwh - meterDataJson[i].data[j-1].dataValues.kwh;
                    if(hour >= onPeakStart && hour < offPeakStart)
                        onPeakSums += diff
                    else
                        offPeakSums += diff
                    dailySums[day-1].kwh += diff;
                    totalMonthlySums += diff
                }
            }

            return res.send({
                'totalMonthlySums':totalMonthlySums,
                'onPeakSums': onPeakSums,
                'offPeakSums': offPeakSums,
                'dailySums': dailySums
            })

            

            

        } catch (err) {
            console.log(err)
            return res.status(500).send(err.message)
        }
    }, */
}