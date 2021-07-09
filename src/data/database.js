const {Sequelize} = require('sequelize')
const sequelize = new Sequelize('superveci-dev', 'superveci-dev', '12345678Sv',{
  dialect:'mssql',
  host:'superveci-dev.database.windows.net',
})
    
//test connection
const test = async() => {
try {
    await sequelize.authenticate()
    console.log('successful connection')
} catch (error) {
    console.log('Failed connection')
}
}
test()