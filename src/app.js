//server
const express = require('express')
const cors = require('cors')
const pkg = require('../package.json')
const morgan = require('morgan')
const productsRoutes = require('../src/routes/products.router')


const app = express()

//middlewares
app.use(cors())
app.set('pkg', pkg)
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(morgan("dev"))

//router
//app.use('/', (req, res) => {
//res.json("welcome")
//})
app.use(productsRoutes)
module.exports = app