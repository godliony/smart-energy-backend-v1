const AuthController = require('./controllers/AuthController')
const UserController = require('./controllers/admin/UserController')
const RoleController = require('./controllers/RoleController')
const MeterController = require('./controllers/MeterController')
const Rs485Controller = require('./controllers/Rs485Controller')
const MeterLoggingController = require('./controllers/MeterLoggingController')
const TimezoneController = require('./controllers/TimezoneController')
const OnPeakController = require('./controllers/OnPeakController')
const Cost_kWhController = require('./controllers/Cost_kWhController')
const HolidayController = require('./controllers/HolidayController')

const express = require('express');

//Admin
/* const AdminDeviceController = require('./controllers/admin/DeviceController')
const AdminAssetController = require('./controllers/admin/AssetController') */


const verifyJWT = require('./middleware/verifyJWT')
const ROLES_LIST = require('./config/roles_list')
const verifyRoles = require('./middleware/verifyRoles')

module.exports = (app) => {

    var clientPath = '../client/dist'
    app.use('/',express.static(clientPath))
    app.use('/login',express.static(clientPath))
    app.use('/register',express.static(clientPath))
    app.use('/dashboard',express.static(clientPath))
    app.use('/dashboard/customer',express.static(clientPath))
    app.use('/dashboard/role',express.static(clientPath))
    app.use('/dashboard/meter',express.static(clientPath))
    app.use('/dashboard/setting/electric',express.static(clientPath))
    app.use('/dashboard/setting/holiday',express.static(clientPath))
    app.use('/dashboard/setting/hardware',express.static(clientPath))
    app.use('/dashboard/overall',express.static(clientPath))
    app.use('/dashboard/realtime',express.static(clientPath))
    app.use('/dashboard/Single',express.static(clientPath))
    app.use('/dashboard/Compare',express.static(clientPath))
    app.use('/dashboard/export_meter_data',express.static(clientPath))
    app.use('/dashboard/Report',express.static(clientPath))
    
    
    app.post('/api/auth/login', AuthController.handleLogin)
    app.get('/api/auth/refreshToken', AuthController.handleRefreshToken)
    app.get('/api/auth/logout', AuthController.handleLogout)
    app.post('/api/auth/register', AuthController.handleRegister)
    
    app.get('/api/currentTime', TimezoneController.currentTime)
    app.get('/api/kWhReportMonthly',MeterLoggingController.kWhReportMonthly)

    app.post('/api/meter/raw-data',MeterLoggingController.index)
    app.post('/api/meter/raw-data-csv',MeterLoggingController.raw_data_csv)
    app.use(verifyJWT) 

    app.get('/api/role/:role_id', RoleController.show)
    app.post('/api/role',verifyRoles(ROLES_LIST.Admin), RoleController.create)
    app.put('/api/role/:role_id',verifyRoles(ROLES_LIST.Admin),RoleController.put)
    app.delete('/api/role/:role_id',verifyRoles(ROLES_LIST.Admin),RoleController.remove)
    app.post('/api/roles', RoleController.index)
    app.get('/api/roles', RoleController.showAll)

    app.get('/api/holiday/:holiday_id', HolidayController.show)
    app.post('/api/holiday',verifyRoles(ROLES_LIST.Admin), HolidayController.create)
    app.put('/api/holiday/:holiday_id',verifyRoles(ROLES_LIST.Admin),HolidayController.put)
    app.delete('/api/holiday/:holiday_id',verifyRoles(ROLES_LIST.Admin),HolidayController.remove)
    app.post('/api/holidays', HolidayController.index)
    app.get('/api/holiday', HolidayController.showAll)

    app.get('/api/meter/:id', MeterController.show)
    app.get('/api/meters', MeterController.showAll)
    app.post('/api/meters', MeterController.index)
    app.post('/api/meter',verifyRoles(ROLES_LIST.Admin), MeterController.create)
    app.put('/api/meter/:id',verifyRoles(ROLES_LIST.Admin), MeterController.put)
    app.delete('/api/meter/:id',verifyRoles(ROLES_LIST.Admin),MeterController.remove)

    app.get('/api/comport',verifyRoles(ROLES_LIST.Admin),Rs485Controller.comport)
    app.get('/api/rs485',verifyRoles(ROLES_LIST.Admin),Rs485Controller.index)
    app.post('/api/rs485/testRead',verifyRoles(ROLES_LIST.Admin),Rs485Controller.testRead)
    app.put('/api/rs485',verifyRoles(ROLES_LIST.Admin),Rs485Controller.put)

    app.get('/api/onPeakHour', MeterLoggingController.onPeakHour)

    app.get('/api/top5Consumption', MeterLoggingController.top5Consumption)

    app.get('/api/cost_kWh',Cost_kWhController.index)
    app.put('/api/cost_kWh',verifyRoles(ROLES_LIST.Admin),Cost_kWhController.put)

    app.get('/api/onPeak',OnPeakController.index)
    app.put('/api/onPeak',verifyRoles(ROLES_LIST.Admin),OnPeakController.put)

    app.get('/api/timezone',TimezoneController.index)
    app.put('/api/timezone',verifyRoles(ROLES_LIST.Admin),TimezoneController.put)

    app.get('/api/kWhEachMonthlyInYear',MeterLoggingController.kWhEachMonthlyInYear)
    app.get('/api/kWhEachDailyInMonth',MeterLoggingController.kWhEachDailyInMonth)
    app.get('/api/kWhEachHourlyInDay',MeterLoggingController.kWhEachHourlyInDay)
    
    app.get('/api/total_kWhLifeTime',MeterLoggingController.total_kWhLifeTime)
    app.get('/api/total_kWhYearlyDevice',MeterLoggingController.total_kWhYearlyDevice)
    app.get('/api/total_kWhMonthlyDevice',MeterLoggingController.total_kWhMonthlyDevice)
    app.get('/api/total_kWhDailyDevice',MeterLoggingController.total_kWhDailyDevice)

    

    app.get('/api/meter/:id/lastValue', MeterController.showMeterLastValue)
    app.post('/api/meter/lastValue', MeterController.showMultipleMeterLastValue)


    

    
    //Admin Routes
/* 
    app.get('/api/admin/device',verifyRoles(ROLES_LIST.Admin), AdminDeviceController.index)

    app.get('/api/admin/assets',verifyRoles(ROLES_LIST.Admin), AdminAssetController.index)
    app.get('/api/admin/asset/:assetId',verifyRoles(ROLES_LIST.Admin), AdminAssetController.show)
    app.post('/api/admin/asset',verifyRoles(ROLES_LIST.Admin), AdminAssetController.create)
    app.put('/api/admin/asset/:assetId',verifyRoles(ROLES_LIST.Admin), AdminAssetController.put)
    app.delete('/api/admin/asset/:assetId',verifyRoles(ROLES_LIST.Admin), AdminAssetController.remove)



 */





    //Role
    


    // Create user
    //app.post('/api/user',verifyRoles(ROLES_LIST.Admin), UserController.create)
    app.post('/api/user',verifyRoles(8000), UserController.create)
    // Edit user
    //app.put('/api/user/:userId',verifyRoles(ROLES_LIST.Admin),UserController.put)
    app.put('/api/user/:user_id',verifyRoles(8000),UserController.put)
    // Delete user
    //app.delete('/api/user/:userId',verifyRoles(ROLES_LIST.Admin),UserController.remove)
    app.delete('/api/user/:user_id',verifyRoles(8000),UserController.remove)
    // Get user by id
    
    //app.get('/api/user/:userId',verifyRoles(ROLES_LIST.Admin),UserController.show)
    app.get('/api/user/:user_id',verifyRoles(8000, ROLES_LIST.User),UserController.show)
    //Below this line need jwtToken (Login)
    //app.use(verifyJWT) 
    // Get all user
    //app.get('/api/users',verifyRoles(ROLES_LIST.User),UserController.index)
    app.post('/api/users',verifyRoles(8000),UserController.index)
    app.put('/api/user/updateRole/:user_id',verifyRoles(8000),UserController.updateRole)
}