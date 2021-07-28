const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const sellersController = require("../controllers/sellers.controller");
const { validate, ValidationError, Joi } = require("express-validation");

// validation schema for zone leader creation
const zoneLeaderCreationValidation = {
  body: Joi.object({
    name: Joi.string().regex(/^[a-zA-ZÁÉÍÓÚáéíóúñ\s]{1,50}$/),
    lastName: Joi.string().regex(/^[a-zA-ZÁÉÍÓÚáéíóúñ\s]{1,50}$/),
    documentType: Joi.string(),
    documentId: Joi.number().integer().max(9999999999).min(9999999),
    address: Joi.string().regex(/^[0-9a-zA-ZÁÉÍÓÚáéíóúñ,.#\s-]{0,100}$/),
    sellerCode: /^[A-Z]{3,4}[0-9]{3}$/,
    email: Joi.string().email(),
    cellphone: Joi.number().max(9999999999).min(999999999),
    zoneId: Joi.number().integer(),
    contractExpires: Joi.date().greater("now"),
    documentImage: Joi.any(),
    rutImage: Joi.any(),
    contractImage: Joi.any(),
    imageUrl: Joi.any(),
    bankCertification: Joi.any(),
  }),
};

// validation schema for zone leader edition
const zoneLeaderUpdateValidation = {
  body: Joi.object({
    name: Joi.string().regex(/^[a-zA-ZÁÉÍÓÚáéíóúñ\s]{1,50}$/),
    lastName: Joi.string().regex(/^[a-zA-ZÁÉÍÓÚáéíóúñ\s]{1,50}$/),
    documentType: Joi.string(),
    documentId: Joi.number().integer().max(9999999999).min(9999999),
    address: Joi.string().regex(/^[0-9a-zA-ZÁÉÍÓÚáéíóúñ,.#\s-]{0,100}$/),
    sellerCode: Joi.number().integer().max(999).min(100),
    email: Joi.string().email(),
    cellphone: Joi.number().max(9999999999).min(999999999),
    zoneId: Joi.number().integer(),
    contractExpires: Joi.date().greater("now"),
    documentImage: Joi.any(),
    rutImage: Joi.any(),
    contractImage: Joi.any(),
    imageUrl: Joi.any(),
    bankCertification: Joi.any(),
  }),
};

// sellers routes
router.get("/sellers", sellersController.sellersGet);
router.get("/sellers/files/:id", sellersController.sellerGetFilesById);
router.post("/sellers", upload.any(), sellersController.sellersCreate);
router.put("/sellers/:id", upload.any(), sellersController.sellersUpdateById);
router.delete("/sellers/:id", sellersController.sellersDelete);

// zone leaders routes
router.get("/leaders", sellersController.zoneLeadersGet);
router.post(
  "/leaders",
  upload.any(),
  validate(zoneLeaderCreationValidation, {}, {}),
  sellersController.zoneLeadersCreate
);
router.put(
  "/leaders/:id",
  upload.any(),
  sellersController.zoneLeaderUpdateById
);

// see express-validation docs
router.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    console.log(err.message);
    console.log(err.details.body[0].message);
    return res.status(err.statusCode).send(err.details.body[0].message);
  }
  return res.status(500).send(err.message);
});

module.exports = router;
