const moment = require('moment-timezone');
const utilities = require('../utilities')
module.exports = (sequelize, DataTypes) => {
    const MeterLogging = sequelize.define('MeterLogging', {
        timestamp: {
            type: DataTypes.DATE,
            //defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
        },
        dd: DataTypes.STRING(10),
        dth: DataTypes.STRING(23),
        yearMonth: DataTypes.INTEGER,
        dow: DataTypes.INTEGER,
        dom: DataTypes.INTEGER,
        year: DataTypes.INTEGER,
        month: DataTypes.INTEGER,
        hour: DataTypes.INTEGER,
        meter_id: DataTypes.INTEGER,
        v1: DataTypes.FLOAT,
        v2: DataTypes.FLOAT,
        v3: DataTypes.FLOAT,
        vAvg: DataTypes.FLOAT,
        i1: DataTypes.FLOAT,
        i2: DataTypes.FLOAT,
        i3: DataTypes.FLOAT,
        iAvg: DataTypes.FLOAT,
        kWh: DataTypes.DOUBLE,
        diff_kWh: DataTypes.FLOAT,
        pf: DataTypes.FLOAT,
        freq: DataTypes.FLOAT,
    }, {
        indexes: [{
            name: 'timestamp_index', // กำหนดชื่อ index (ตัวเลือก)
            unique: false, // กำหนดให้ index เป็น unique หรือไม่ (ตัวเลือก)
            fields: ['timestamp'] // กำหนดฟิลด์ที่ต้องการสร้าง index
        }],
        timestamps: false
    })

    MeterLogging.beforeCreate(async (instance, options) => {
        const config = await utilities.readJSONFile('config/config.json')
        const nowUTC = moment.utc(new Date())
        const now = nowUTC.clone().tz(config.timezone)

        instance.timestamp = nowUTC
        instance.dd = now.format('YYYY-MM-DD')
        instance.dth = now.format('YYYY-MM-DD HH:00:00')
        instance.yearMonth = now.format('YYYY-MM')
        instance.dow = now.day()
        instance.dom = now.date()
        instance.year = now.year()
        instance.month = now.month() + 1
        instance.hour = now.hour()

        const previousRecord = await MeterLogging.findOne({
            where: {
                meter_id: instance.meter_id
            },
            order: [['timestamp', 'DESC']]
        });
    
        // If a previous record exists, calculate the difference in kWh
        if (previousRecord) {
            instance.diff_kWh = Number(instance.kWh) - Number(previousRecord.kWh);
        } else {
            // If no previous record exists, diff_kWh is the same as kWh
            instance.diff_kWh = 0;
        }
    });
    return MeterLogging
}