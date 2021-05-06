//server
const express = require('express')
const cors = require('cors')
const pkg = require('../package.json')
const morgan = require('morgan')

const app = express()

//middlewares
app.use(cors())
app.set('pkg', pkg)
app.use(express())
app.use(morgan("dev"))

//router
app.use('/', (req, res) => {
res.json("welcome")
})

module.exports = app