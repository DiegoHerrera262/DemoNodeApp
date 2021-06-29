const getConnection = require ('../data/database.js')

 const getProduts= async(req, res) => {
 const pool= await getConnection()
 const result = await pool.request().query('SELECT * FROM products')
 console.log(result)
 res.json(result.recorset)
}

 const createNewProducts = async (req, res) => {
 const {name,
     descriptions,
      code, 
      cost} = req.body
 console.log(name, descriptions, code, cost)
 res.json('new product')
 }  
 module.exports= [getProduts, createNewProducts]
 