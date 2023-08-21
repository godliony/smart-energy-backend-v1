const ModbusRTU = require('modbus-serial');
const utilities = require('../utilities')
const {
  Meter,
  MeterLogging
} = require('../models')

class ModbusRead {
  constructor(port, baudRate, parity, dataBits, stopBits, timeout = 300) {
    this.port = port
    this.baudRate = parseInt(baudRate)
    this.parity = parity
    this.dataBits = dataBits
    this.stopBits = stopBits
    this.timeout = timeout
    this.isReading = false;
    this.readLock = false;
    this.readInterrupt = false;
    this.prevTimeReading = 0
    this.prevTimeLogging = 0
    this.metersData = []
    this.readLoopPromise = null

    this.modbus = new ModbusRTU();
    this.modbus.on('error', (err) => {
      console.error('ModbusRTU error:', err);
    });
    this.connect()

  }

  async connect() {

    try {
      await this.modbus.connectRTUBuffered(this.port, {
        baudRate: this.baudRate,
        parity: this.parity,
        stopBits: this.stopBits,
        dataBits: this.dataBits
      });
      this.modbus.setTimeout(this.timeout);

    } catch (err) {
      console.error("Failed to connect to Modbus:", err.message);
      //throw new Error("Failed to connect to Modbus:", err.message)
    }
  }

  startReading() {
    if (!this.isReading) {
      this.isReading = true;
      this.readLoopPromise = new Promise((resolve, reject) => {
        const readLoop = async () => {
          while (this.isReading) {
            if (this.readInterrupt) {
              await this.sleep(100)
              continue
            }
            await this.sleep(1000)
            const currentTime = Math.floor(Date.now() / 1000)
            if (currentTime - this.prevTimeReading < 5) continue
            const meters = await Meter.findAll({
              where: {
                "active": 1
              }
            })
            for await (const meter of meters) {
              if (!this.isReading) break
              if (!this.readLock) {
                this.readLock = true;
                try {
                  let modbusRes;
                  let data = {}
                  data['meter_id'] = meter.id
                  this.modbus.setID(meter.rs485_no)
                  if (meter.sett_v1_addr && meter.sett_v1_dataLength && meter.sett_v1_dataType) {
                    modbusRes = await this.modbus.readHoldingRegisters(meter.sett_v1_addr, meter.sett_v1_dataLength)
                    data['v1'] = await utilities.convtArr2Num(modbusRes.data, meter.sett_v1_dataType)
                    data['v1'] = operation(meter.sett_v1_operation,meter.sett_v1_operationNumber,data['v1'])
                  }

                  if (meter.sett_v2_addr && meter.sett_v2_dataLength && meter.sett_v2_dataType) {
                    modbusRes = await this.modbus.readHoldingRegisters(meter.sett_v2_addr, meter.sett_v2_dataLength)
                    data['v2'] = await utilities.convtArr2Num(modbusRes.data, meter.sett_v2_dataType)
                    data['v2'] = operation(meter.sett_v2_operation,meter.sett_v2_operationNumber,data['v2'])
                  }

                  if (meter.sett_v3_addr && meter.sett_v3_dataLength && meter.sett_v3_dataType) {
                    modbusRes = await this.modbus.readHoldingRegisters(meter.sett_v3_addr, meter.sett_v3_dataLength)
                    data['v3'] = await utilities.convtArr2Num(modbusRes.data, meter.sett_v3_dataType)
                    data['v3'] = operation(meter.sett_v3_operation,meter.sett_v3_operationNumber,data['v3'])
                  }

                  if (meter.sett_vAvg_addr && meter.sett_vAvg_dataLength && meter.sett_vAvg_dataType) {
                    modbusRes = await this.modbus.readHoldingRegisters(meter.sett_vAvg_addr, meter.sett_vAvg_dataLength)
                    data['vAvg'] = await utilities.convtArr2Num(modbusRes.data, meter.sett_vAvg_dataType)
                    data['vAvg'] = operation(meter.sett_vAvg_operation,meter.sett_vAvg_operationNumber,data['vAvg'])
                  }

                  if (meter.sett_i1_addr && meter.sett_i1_dataLength && meter.sett_i1_dataType) {
                    modbusRes = await this.modbus.readHoldingRegisters(meter.sett_i1_addr, meter.sett_i1_dataLength)
                    data['i1'] = await utilities.convtArr2Num(modbusRes.data, meter.sett_i1_dataType)
                    data['i1'] = operation(meter.sett_i1_operation,meter.sett_i1_operationNumber,data['i1'])
                  }

                  if (meter.sett_i2_addr && meter.sett_i2_dataLength && meter.sett_i2_dataType) {
                    modbusRes = await this.modbus.readHoldingRegisters(meter.sett_i2_addr, meter.sett_i2_dataLength)
                    data['i2'] = await utilities.convtArr2Num(modbusRes.data, meter.sett_i2_dataType)
                    data['i2'] = operation(meter.sett_i2_operation,meter.sett_i2_operationNumber,data['i2'])
                  }

                  if (meter.sett_i3_addr && meter.sett_i3_dataLength && meter.sett_i3_dataType) {
                    modbusRes = await this.modbus.readHoldingRegisters(meter.sett_i3_addr, meter.sett_i3_dataLength)
                    data['i3'] = await utilities.convtArr2Num(modbusRes.data, meter.sett_i3_dataType)
                    data['i3'] = operation(meter.sett_i3_operation,meter.sett_i3_operationNumber,data['i3'])
                  }

                  if (meter.sett_iAvg_addr && meter.sett_iAvg_dataLength && meter.sett_iAvg_dataType) {
                    modbusRes = await this.modbus.readHoldingRegisters(meter.sett_iAvg_addr, meter.sett_iAvg_dataLength)
                    data['iAvg'] = await utilities.convtArr2Num(modbusRes.data, meter.sett_iAvg_dataType)
                    data['iAvg'] = operation(meter.sett_iAvg_operation,meter.sett_iAvg_operationNumber,data['iAvg'])
                  }

                  if (meter.sett_kWh_addr && meter.sett_kWh_dataLength && meter.sett_kWh_dataType) {
                    modbusRes = await this.modbus.readHoldingRegisters(meter.sett_kWh_addr, meter.sett_kWh_dataLength)
                    data['kWh'] = await utilities.convtArr2Num(modbusRes.data, meter.sett_kWh_dataType)
                    data['kWh'] = operation(meter.sett_kWh_operation,meter.sett_kWh_operationNumber,data['kWh'])
                  }

                  if (meter.sett_pf_addr && meter.sett_pf_dataLength && meter.sett_pf_dataType) {
                    modbusRes = await this.modbus.readHoldingRegisters(meter.sett_pf_addr, meter.sett_pf_dataLength)
                    data['pf'] = await utilities.convtArr2Num(modbusRes.data, meter.sett_pf_dataType)
                    data['pf'] = operation(meter.sett_pf_operation,meter.sett_pf_operationNumber,data['pf'])
                  }

                  if (meter.sett_freq_addr && meter.sett_freq_dataLength && meter.sett_freq_dataType) {
                    modbusRes = await this.modbus.readHoldingRegisters(meter.sett_freq_addr, meter.sett_freq_dataLength)
                    data['freq'] = await utilities.convtArr2Num(modbusRes.data, meter.sett_freq_dataType)
                    data['freq'] = operation(meter.sett_freq_operation,meter.sett_freq_operationNumber,data['freq'])
                  }

                  if (currentTime - this.prevTimeLogging > 60 * 15) {
                    this.prevTimeLogging = currentTime
                    await MeterLogging.create(data)

                  }
                  let date_time = new Date();
                  let date = ("0" + date_time.getDate()).slice(-2);
                  let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
                  let year = date_time.getFullYear();
                  let hours = date_time.getHours();
                  let minutes = date_time.getMinutes();
                  let seconds = date_time.getSeconds();
                  data['timestamp'] = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds
                  this.metersData[meter.id] = data

                } catch (err) {
                  console.error(err.message)
                  if (err.message === 'Timed out') {
                    console.error('Modbus connection timed out, reconnecting...');
                  } else if (err.message === 'Port Not Open') {
                    console.error('Port Not Open try to connect again');
                    try {
                      if (this.modbus.isOpen) {
                        await this.modbus.close();
                      }
                      await this.connect()
                    } catch (err) {
                      console.error(err)
                    }
                  } else {
                    console.error('Failed to read Modbus data:', err.message);
                    console.error(err)
                  }
                }
                this.prevTimeReading = Math.floor(Date.now() / 1000)
                this.readLock = false;
              }
            }
          }
          resolve();
        };
        readLoop().catch(reject);
      })
      //readLoop();
    }
  }
  async stopReading() {
    this.isReading = false;
    await this.readLoopPromise;
  }
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async updateConfig(port, baudRate, parity, dataBits, stopBits) {
    await this.stopReading()
    await this.closeConnection()
    this.port = port
    this.baudRate = parseInt(baudRate)
    this.parity = parity
    this.dataBits = dataBits
    this.stopBits = stopBits
    await this.connect()
  }
  async startInterruptReadding(_rs485_no, _addr, _dataLength, _dataType, _modbusFn) {
    this.stopReading()
    while (this.readLock) await this.sleep(100)
    this.readInterrupt = true
    let response = {}
    try {
      await this.sleep(10)
      this.modbus.setID(_rs485_no)
      let modbusRes;
      if(_modbusFn === 4)
        modbusRes = await this.modbus.readInputRegisters(_addr, _dataLength)
      else if(_modbusFn === 3)
        modbusRes = await this.modbus.readHoldingRegisters(_addr, _dataLength)
      const value = await utilities.convtArr2Num(modbusRes.data, _dataType)
      response = {
        status: true,
        message: value.toString()
      }
    } catch (err) {
      if (err.message === 'Timed out') {
        console.error('Modbus connection timed out');
        response = {
          status: false,
          message: 'Modbus connection timed out'
        }
      } else if (err.message === 'Port Not Open') {
        console.error('Port Not Open or not config');
        response = {
          status: false,
          message: 'Port Not Open or not config'
        }
      } else {
        console.error(err);
        response = {
          status: false,
          message: err.message ?? err
        }
      }
    }
    this.readInterrupt = false
    this.startReading()
    return response
  }

  async closeConnection() {
    try {
      if (this.modbus.isOpen) {
        await this.stopReading();
        await this.modbus.close()
      }
    } catch (err) {
      throw new Error('Failed to close Modbus connection:', err.message)
    }
  }

  getMeterValue(index) {
    try {
      return this.metersData[index]
    } catch (e) {
      throw new Error(e.message)
    }

  }
}

function operation(operation, number, data){
  let result = 0.0
  switch(operation){
    case 1: result = data + number; break;
    case 2: result = data - number; break;
    case 3: result = data * number; break;
    case 4: result = data / number; break;
  }
  return result
}

module.exports = ModbusRead