const express = require('express');
const router = express.Router();
const sellersController = require('../controllers/sellers.controller');
const { validate, ValidationError, Joi } = require('express-validation');

// validation schema for zone leader creation
const zoneLeaderCreationValidation = {
    body : Joi.object({
        name : Joi.string()
            .regex(/^[a-zA-Z]{1,10}[\s]{0,1}[a-zA-Z]{0,10}$/)
            .required(),
        last_name : Joi.string()
            .regex(/^[a-zA-Z]{1,10}[\s]{0,1}[a-zA-Z]{0,10}$/)
            .required(),
        documentId : Joi.number()
            .integer()
            .max(9999999999)
            .min(9999999)
            .required(),
        address : Joi.string()
            .regex(/^[a-zA-Z]{2,4}[\s]{0,1}[a-zA-Z]{0,20}[\s]{0,1}[0-9]{0,3}[\s]{0,1}#[\s]{0,1}[0-9]{1,3}[a-zA-Z]{0,3}[\s]{0,1}-[\s]{0,1}[0-9]{1,3}[a-zA-Z]{0,3}$/)
            .required(),
        leader_code : Joi.number()
            .integer()
            .max(999)
            .min(100),
        email : Joi.string()
            .email()
            .required(),
        cellphone : Joi.number()
            .max(9999999999)
            .min(999999999)
            .required(),
        zone_id : Joi.number()
            .integer(),
        endContractDate : Joi.date()
            .greater('now')
            .required(),
        documentPhoto : Joi.any(),
        rutDocument : Joi.any(),
        contractDocument : Joi.any(),
        profileImage : Joi.any(),
        bankCertification : Joi.any()
    }),
}

// validation schema for zone leader edition
const zoneLeaderUpdateValidation = {
    body : Joi.object({
        name : Joi.string()
            .regex(/^[a-zA-Z]{1,10}[\s]{0,1}[a-zA-Z]{0,10}$/),
        last_name : Joi.string()
            .regex(/^[a-zA-Z]{1,10}[\s]{0,1}[a-zA-Z]{0,10}$/),
        documentId : Joi.number()
            .integer()
            .max(9999999999)
            .min(9999999),
        address : Joi.string()
            .regex(/^[a-zA-Z]{2,4}[\s]{0,1}[a-zA-Z]{0,20}[\s]{0,1}[0-9]{0,3}[\s]{0,1}#[\s]{0,1}[0-9]{1,3}[a-zA-Z]{0,3}[\s]{0,1}-[\s]{0,1}[0-9]{1,3}[a-zA-Z]{0,3}$/),
        leader_code : Joi.number()
            .integer()
            .max(999)
            .min(100),
        email : Joi.string()
            .email(),
        cellphone : Joi.number()
            .max(9999999999)
            .min(999999999),
        zone_id : Joi.number()
            .integer(),
        endContractDate : Joi.date()
            .greater('now'),
        documentPhoto : Joi.any(),
        rutDocument : Joi.any(),
        contractDocument : Joi.any(),
        profileImage : Joi.any(),
        bankCertification : Joi.any()
    }),
}

// zone leaders routes
router.get('/lideres', sellersController.zoneLeadersGet);
router.post('/lideres', validate(zoneLeaderCreationValidation, {}, {}), sellersController.zoneLeadersCreate);
router.get('/lideres/:id', sellersController.zoneLeaderGetById);
router.delete('/lideres/:id', sellersController.zoneLeadersDelete);
router.put('/lideres/:id', validate(zoneLeaderUpdateValidation, {}, {}), sellersController.zoneLeaderEditById);


// see express-validation docs
router.use((err, req, res, next) => {
    if (err instanceof ValidationError) {
        return res.status(err.statusCode).json(err);
    }
    return res.status(500).json(err);
});

module.exports = router;