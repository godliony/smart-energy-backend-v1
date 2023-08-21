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

//Admin
/* const AdminDeviceController = require('./controllers/admin/DeviceController')
const AdminAssetController = require('./controllers/admin/AssetController') */


const verifyJWT = require('./middleware/verifyJWT')
const ROLES_LIST = require('./config/roles_list')
const verifyRoles = require('./middleware/verifyRoles')

module.exports = (app) => {

    
    app.post('/auth/login', AuthController.handleLogin)
    app.get('/auth/refreshToken', AuthController.handleRefreshToken)
    app.get('/auth/logout', AuthController.handleLogout)
    app.post('/auth/register', AuthController.handleRegister)
    
    app.get('/currentTime', TimezoneController.currentTime)
    app.get('/kWhReportMonthly',MeterLoggingController.kWhReportMonthly)
    app.use(verifyJWT) 

    app.get('/role/:role_id', RoleController.show)
    app.post('/role',verifyRoles(ROLES_LIST.Admin), RoleController.create)
    app.put('/role/:role_id',verifyRoles(ROLES_LIST.Admin),RoleController.put)
    app.delete('/role/:role_id',verifyRoles(ROLES_LIST.Admin),RoleController.remove)
    app.post('/roles', RoleController.index)
    app.get('/roles', RoleController.showAll)

    app.get('/holiday/:holiday_id', HolidayController.show)
    app.post('/holiday',verifyRoles(ROLES_LIST.Admin), HolidayController.create)
    app.put('/holiday/:holiday_id',verifyRoles(ROLES_LIST.Admin),HolidayController.put)
    app.delete('/holiday/:holiday_id',verifyRoles(ROLES_LIST.Admin),HolidayController.remove)
    app.post('/holidays', HolidayController.index)
    app.get('/holiday', HolidayController.showAll)

    app.get('/meter/:id', MeterController.show)
    app.get('/meters', MeterController.showAll)
    app.post('/meters', MeterController.index)
    app.post('/meter',verifyRoles(ROLES_LIST.Admin), MeterController.create)
    app.put('/meter/:id',verifyRoles(ROLES_LIST.Admin), MeterController.put)
    app.delete('/meter/:id',verifyRoles(ROLES_LIST.Admin),MeterController.remove)

    app.get('/comport',verifyRoles(ROLES_LIST.Admin),Rs485Controller.comport)
    app.get('/rs485',verifyRoles(ROLES_LIST.Admin),Rs485Controller.index)
    app.post('/rs485/testRead',verifyRoles(ROLES_LIST.Admin),Rs485Controller.testRead)
    app.put('/rs485',verifyRoles(ROLES_LIST.Admin),Rs485Controller.put)

    app.get('/onPeakHour', MeterLoggingController.onPeakHour)

    app.get('/top5Consumption', MeterLoggingController.top5Consumption)

    app.get('/cost_kWh',Cost_kWhController.index)
    app.put('/cost_kWh',verifyRoles(ROLES_LIST.Admin),Cost_kWhController.put)

    app.get('/onPeak',OnPeakController.index)
    app.put('/onPeak',verifyRoles(ROLES_LIST.Admin),OnPeakController.put)

    app.get('/timezone',TimezoneController.index)
    app.put('/timezone',verifyRoles(ROLES_LIST.Admin),TimezoneController.put)

    app.get('/kWhEachMonthlyInYear',MeterLoggingController.kWhEachMonthlyInYear)
    app.get('/kWhEachDailyInMonth',MeterLoggingController.kWhEachDailyInMonth)
    app.get('/kWhEachHourlyInDay',MeterLoggingController.kWhEachHourlyInDay)
    
    app.get('/total_kWhLifeTime',MeterLoggingController.total_kWhLifeTime)
    app.get('/total_kWhYearlyDevice',MeterLoggingController.total_kWhYearlyDevice)
    app.get('/total_kWhMonthlyDevice',MeterLoggingController.total_kWhMonthlyDevice)
    app.get('/total_kWhDailyDevice',MeterLoggingController.total_kWhDailyDevice)


    app.get('/meter/:id/lastValue', MeterController.showMeterLastValue)

    

    
    //Admin Routes
/* 
    app.get('/admin/device',verifyRoles(ROLES_LIST.Admin), AdminDeviceController.index)

    app.get('/admin/assets',verifyRoles(ROLES_LIST.Admin), AdminAssetController.index)
    app.get('/admin/asset/:assetId',verifyRoles(ROLES_LIST.Admin), AdminAssetController.show)
    app.post('/admin/asset',verifyRoles(ROLES_LIST.Admin), AdminAssetController.create)
    app.put('/admin/asset/:assetId',verifyRoles(ROLES_LIST.Admin), AdminAssetController.put)
    app.delete('/admin/asset/:assetId',verifyRoles(ROLES_LIST.Admin), AdminAssetController.remove)



 */





    //Role
    


    // Create user
    //app.post('/user',verifyRoles(ROLES_LIST.Admin), UserController.create)
    app.post('/user',verifyRoles(8000), UserController.create)
    // Edit user
    //app.put('/user/:userId',verifyRoles(ROLES_LIST.Admin),UserController.put)
    app.put('/user/:user_id',verifyRoles(8000),UserController.put)
    // Delete user
    //app.delete('/user/:userId',verifyRoles(ROLES_LIST.Admin),UserController.remove)
    app.delete('/user/:user_id',verifyRoles(8000),UserController.remove)
    // Get user by id
    
    //app.get('/user/:userId',verifyRoles(ROLES_LIST.Admin),UserController.show)
    app.get('/user/:user_id',verifyRoles(8000, ROLES_LIST.User),UserController.show)
    //Below this line need jwtToken (Login)
    //app.use(verifyJWT) 
    // Get all user
    //app.get('/users',verifyRoles(ROLES_LIST.User),UserController.index)
    app.post('/users',verifyRoles(8000),UserController.index)
    app.put('/user/updateRole/:user_id',verifyRoles(8000),UserController.updateRole)
}