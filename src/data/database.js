const sql = require('mssql');

const dbSettings ={
     user:'superveci-dev',
     password:'12345678Sv',
     server:'superveci-dev.database.windows.net',
     database:'superveci-dev',
     options:{
         encrypt: true,
         trustServerCertificate:true   
     }
 };

const getConnection = async () =>{
    try {
        const pool= await sql.connect(dbSettings);
        // const result = await pool.request().query('SELECT * FROM users');
        // console.log(result);
        return pool;
    } catch (error) {
        console.error(error);
        return undefined;
    }
 }

module.exports = getConnection;
