const moment = require('moment-timezone');
module.exports = (sequelize, DataTypes) => {
    const Meter = sequelize.define('Meter', {
        rs485_no: {
            type: DataTypes.INTEGER,
            unique: true
        },
        name: DataTypes.STRING,
        desc: DataTypes.STRING,
        active: DataTypes.BOOLEAN,
        sett_v1_modbusFn: DataTypes.INTEGER,
        sett_v1_addr: DataTypes.INTEGER,
        sett_v1_dataLength: DataTypes.INTEGER,
        sett_v1_dataType: DataTypes.INTEGER,
        sett_v1_operation: DataTypes.TINYINT,
        sett_v1_operationNumber: {
            type: DataTypes.FLOAT,
            defaultValue: 0.00,
        },

        sett_v2_modbusFn: DataTypes.INTEGER,
        sett_v2_addr: DataTypes.INTEGER,
        sett_v2_dataLength: DataTypes.INTEGER,
        sett_v2_dataType: DataTypes.INTEGER,
        sett_v2_operation: DataTypes.TINYINT,
        sett_v2_operationNumber: {
            type: DataTypes.FLOAT,
            defaultValue: 0.00,
        },

        sett_v3_modbusFn: DataTypes.INTEGER,
        sett_v3_addr: DataTypes.INTEGER,
        sett_v3_dataLength: DataTypes.INTEGER,
        sett_v3_dataType: DataTypes.INTEGER,
        sett_v3_operation: DataTypes.TINYINT,
        sett_v3_operationNumber: {
            type: DataTypes.FLOAT,
            defaultValue: 0.00,
        },

        sett_vAvg_modbusFn: DataTypes.INTEGER,
        sett_vAvg_addr: DataTypes.INTEGER,
        sett_vAvg_dataLength: DataTypes.INTEGER,
        sett_vAvg_dataType: DataTypes.INTEGER,
        sett_vAvg_operation: DataTypes.TINYINT,
        sett_vAvg_operationNumber: {
            type: DataTypes.FLOAT,
            defaultValue: 0.00,
        },

        sett_i1_modbusFn: DataTypes.INTEGER,
        sett_i1_addr: DataTypes.INTEGER,
        sett_i1_dataLength: DataTypes.INTEGER,
        sett_i1_dataType: DataTypes.INTEGER,
        sett_i1_operation: DataTypes.TINYINT,
        sett_i1_operationNumber: {
            type: DataTypes.FLOAT,
            defaultValue: 0.00,
        },

        sett_i2_modbusFn: DataTypes.INTEGER,
        sett_i2_addr: DataTypes.INTEGER,
        sett_i2_dataLength: DataTypes.INTEGER,
        sett_i2_dataType: DataTypes.INTEGER,
        sett_i2_operation: DataTypes.TINYINT,
        sett_i2_operationNumber: {
            type: DataTypes.FLOAT,
            defaultValue: 0.00,
        },

        sett_i3_modbusFn: DataTypes.INTEGER,
        sett_i3_addr: DataTypes.INTEGER,
        sett_i3_dataLength: DataTypes.INTEGER,
        sett_i3_dataType: DataTypes.INTEGER,
        sett_i3_operation: DataTypes.TINYINT,
        sett_i3_operationNumber: {
            type: DataTypes.FLOAT,
            defaultValue: 0.00,
        },

        sett_iAvg_modbusFn: DataTypes.INTEGER,
        sett_iAvg_addr: DataTypes.INTEGER,
        sett_iAvg_dataLength: DataTypes.INTEGER,
        sett_iAvg_dataType: DataTypes.INTEGER,
        sett_iAvg_operation: DataTypes.TINYINT,
        sett_iAvg_operationNumber: {
            type: DataTypes.FLOAT,
            defaultValue: 0.00,
        },

        sett_kWh_modbusFn: DataTypes.INTEGER,
        sett_kWh_addr: DataTypes.INTEGER,
        sett_kWh_dataLength: DataTypes.INTEGER,
        sett_kWh_dataType: DataTypes.INTEGER,
        sett_kWh_operation: DataTypes.TINYINT,
        sett_kWh_operationNumber: {
            type: DataTypes.FLOAT,
            defaultValue: 0.00,
        },

        sett_pf_modbusFn: DataTypes.INTEGER,
        sett_pf_addr: DataTypes.INTEGER,
        sett_pf_dataLength: DataTypes.INTEGER,
        sett_pf_dataType: DataTypes.INTEGER,
        sett_pf_operation: DataTypes.TINYINT,
        sett_pf_operationNumber: {
            type: DataTypes.FLOAT,
            defaultValue: 0.00,
        },
        
        sett_freq_modbusFn: DataTypes.INTEGER,
        sett_freq_addr: DataTypes.INTEGER,
        sett_freq_dataLength: DataTypes.INTEGER,
        sett_freq_dataType: DataTypes.INTEGER,
        sett_freq_operation: DataTypes.TINYINT,
        sett_freq_operationNumber: {
            type: DataTypes.FLOAT,
            defaultValue: 0.00,
        },
    })

    return Meter
}