const express = require ('express')
const cors = require('cors')
const bodyParser = require ('body-parser')
const config = require ('./config')

const app = express()
app.use(cors())
app.use(bodyParser.json())

 module.exports = app

