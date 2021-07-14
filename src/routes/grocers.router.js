const express = require ('express');
const router = express.Router();

const grocersController = require ('../controllers/grocers.controller');

module.exports = function(){
    // ruta para la vista de creacion de cliente
    router.get('/grocerCreate', grocersController.grocerForm);

    // ruta para inserción de un nuevo cliente
    router.post('/grocerCreate', grocersController.grocerCreate);

    


    return router;
}