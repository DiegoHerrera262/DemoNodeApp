const app  = require ('./app')
const config  = require('./config')
const express = require ('express')

app.listen(config.port, () => {
    console.log('server on port:' + config.port)
    })
    