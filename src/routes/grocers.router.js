const express = require('express');
const router = express.Router();
const grocerController = require('../controllers/grocer.controller');
const { validate, ValidationError, Joi } = require('express-validation');

// Validation for grocer creation
const grocerCreationValidation = {
    body : Joi.object({
        grocer_name : Joi.string()
            .regex(/^[a-zA-Z]{1,10}[\s]{0,1}[a-zA-Z]{0,10}$/)
            .required(),
        document_id : Joi.number()
            .integer()
            .max(9999999999)
            .min(9999999)
            .required(),
        address : Joi.string()
            .regex(/^[a-zA-Z]{2,4}[\s]{0,1}[a-zA-Z]{0,20}[\s]{0,1}[0-9]{0,3}[\s]{0,1}#[\s]{0,1}[0-9]{1,3}[a-zA-Z]{0,3}[\s]{0,1}-[\s]{0,1}[0-9]{1,3}[a-zA-Z]{0,3}$/)
            .required(),
        email : Joi.string()
            .email()
            .required(),
        cellphone : Joi.number()
            .max(9999999999)
            .min(999999999)
            .required(),
        latitude : Joi.number()
            .required(),
        longitude : Joi.number()
            .required()
    }),
}

// Validation for grocer edition
const grocerUpdateValidation = {
    body : Joi.object({
        grocer_name : Joi.string()
            .regex(/^[a-zA-Z]{1,10}[\s]{0,1}[a-zA-Z]{0,10}$/)
            .required(),
        document_id : Joi.number()
            .integer()
            .max(9999999999)
            .min(9999999)
            .required(),
        address : Joi.string()
            .regex(/^[a-zA-Z]{2,4}[\s]{0,1}[a-zA-Z]{0,20}[\s]{0,1}[0-9]{0,3}[\s]{0,1}#[\s]{0,1}[0-9]{1,3}[a-zA-Z]{0,3}[\s]{0,1}-[\s]{0,1}[0-9]{1,3}[a-zA-Z]{0,3}$/)
            .required(),
        email : Joi.string()
            .email()
            .required(),
        cellphone : Joi.number()
            .max(9999999999)
            .min(999999999)
            .required(),
        latitude : Joi.number()
            .required(),
        longitude : Joi.number()
            .required()
    }),
}

// grocer routes
router.get('/grocers', grocerController.grocersGet);
router.post('/grocers/create', validate(grocerCreationValidation, {}, {}), grocerController.grocerCreate);
router.get('/grocers/:id', grocerController.GetByID);
router.delete('/grocers/delete/:id', grocerController.grocerDelete);
router.put('/grocers/edit/:id', validate(grocerUpdateValidation, {}, {}), grocerController.grocerEditById);


// see express-validation docs
router.use((err, req, res, next) => {
    if (err instanceof ValidationError) {
        return res.status(err.statusCode).json(err);
    }
    return res.status(500).json(err);
});

module.exports = router;