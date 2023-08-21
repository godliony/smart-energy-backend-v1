const {Rs485} = require('../models')
const { Op } = require("sequelize");
const utilities = require('../utilities')
const rs485Config = require('../config/config.json')

const ModbusRead = require('../modbus/ModbusRead')
const {SerialPort} = require('serialport')
let modbusRead = null


if(rs485Config.rs485){
    modbusRead = new ModbusRead(rs485Config.rs485.port,rs485Config.rs485.baudRate,rs485Config.rs485.parity,rs485Config.rs485.dataBits,rs485Config.rs485.stopBits)
    modbusRead.startReading() 
}

module.exports = {
    //get rs485 config
    modbusRead,
    async index(req, res) {
        try {
            const jsonData = await utilities.readJSONFile('config/config.json')
            return res.json(jsonData.rs485 ?? {})
        } catch (err) {
            console.error(err)
            res.status(500).send(err.message).send(err)
        }
    },

    async comport(req,res){
        try{
            let data= []
            const serialPort = await SerialPort.list()

            serialPort.forEach(port=> {
                data.push({
                    'path': port.path,
                    'manufacturer': port.manufacturer,
                })
            })
            return res.send(data)
        }catch(e){
            console.error(e)
        }
    },

    async testRead(req, res){
        try{
            const {
                rs485_no,
                addr,
                dataLength,
                dataType,
                modbusFn,
            } = req.body
            if (!rs485_no || !addr || !dataLength || !dataType || !modbusFn) return res.status(400).json({
                'message': 'rs485_no, address, dataLength, dataType, modbusFn are require!'
            })
            const response = await modbusRead.startInterruptReadding(rs485_no,addr,dataLength,dataType, modbusFn)
            return res.json(response)
        }catch(e){
            console.error(e)
        }
    },

    // edit rs485 config
    async put(req, res) {
        try {
            const {
                port,
                baudRate,
                parity,
                dataBits,
                stopBits,
            } = req.body
            if (!port || !baudRate || !parity || !dataBits|| !stopBits) return res.status(400).json({
                'message': 'port, baudRate, parity, dataBits, stopBits are require!'
            })
            const backupConfig = await utilities.readJSONFile('config/config.json')
            backupConfig.rs485 = req.body
            const newConfig = backupConfig
            await utilities.writeJSONFile('config/config.json',newConfig)
            res.send(req.body)
            if(modbusRead){
                await modbusRead.updateConfig(port,baudRate,parity,dataBits,stopBits)
                modbusRead.startReading()
                
            }
            
        } catch (err) {
            res.status(500).send(err.message).send(err)
            console.error(err)
        }
    },


}