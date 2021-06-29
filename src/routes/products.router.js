const { Router } = require ('express')
const getProducts = require('../controllers/products.controller')
const createNewProducts= require ('../controllers/products.controller.js')

const router= Router()

  router.get('/products', getProducts)
  router.post('/products', createNewProducts)
  router.get('/products',)
  router.delete('/products',)
  router.put('/products',)

 module.exports= router