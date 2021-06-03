const sql = require('mssql')

const dbSettings ={
     user:'superveci-dev',
     password:'12345678Sv',
     server:'superveci-dev.database.windows.net',
     database:'superveci-dev',
     options:{
         encrypt: true,
         trustServerCertificate:true   
     }
 }
const getCoonection = async () =>{
try {
const pool= await sql.connect(dbSettings)
return pool   
} catch (error) {
    console.error(error)
}
 }
 getCoonection()
