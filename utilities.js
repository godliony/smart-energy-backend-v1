const fs = require('fs').promises;

module.exports = {
  convtArr2Num(_data, _dataType) {
    return new Promise((resolve, reject) => {
      {
        try {
          switch (_dataType) {
            case 1: //int16
              view = new DataView(new ArrayBuffer(2))
              _data.forEach(function (b, i) {
                view.setInt16(i * 2, b);
              })
              return resolve(view.getInt16(0))
            case 2: //unsigned int16
              view = new DataView(new ArrayBuffer(2))
              _data.forEach(function (b, i) {
                view.setInt16(i * 2, b);
              })
              return resolve(view.getUint16(0))
            case 3: //int32
              view = new DataView(new ArrayBuffer(4))
              _data.forEach(function (b, i) {
                view.setInt16(i * 2, b);
              })
              return resolve(view.getUint32(0))
            case 4: //unsigned int32
              view = new DataView(new ArrayBuffer(4))
              _data.forEach(function (b, i) {
                view.setInt16(i * 2, b);
              })
              return resolve(view.getUint32(0))
            case 5: // int64
               /* view = new DataView(new ArrayBuffer(8))
              _data.forEach(function (b, i) {
                view.setInt16(i * 2, b);
              }) 
              return resolve(view.getBigInt64(0)) */
              const number = _data[0]*281474976710656 + _data[1]*4294967296 + _data[2]*65536 + _data[3]
              return resolve(Number(number))
            case 6: // unsigned int64
              view = new DataView(new ArrayBuffer(8))
              _data.forEach(function (b, i) {
                view.setInt16(i * 2, b);
              })
              return resolve(view.getBigUint64(0))
            case 7: // Float32
              view = new DataView(new ArrayBuffer(4))
              _data.forEach(function (b, i) {
                view.setInt16(i * 2, b);
              })
              return resolve(view.getFloat32(0))
            case 8: // Float64
              view = new DataView(new ArrayBuffer(8))
              _data.forEach(function (b, i) {
                view.setInt16(i * 2, b);
              })
              return resolve(view.getFloat64(0))
          }
        } catch (e) {
          reject('Chagne type error!')
        }
      }
    })
  },

  async readJSONFile(file) {
    try {
      const data = await fs.readFile(file, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      throw new Error(`Error reading JSON file: ${file} - ${err}`);
    }
  },
  async  writeJSONFile(file, data) {
    try {
      await fs.writeFile(file, JSON.stringify(data));
      return data
    } catch (err) {
      throw new Error(`Error writing JSON file: ${file} - ${err}`);
    }
  }
}