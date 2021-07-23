const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const supplierController = require("../controllers/suppliers.controller");


// route for creating grocer from web app
router.post("/supplier/create", upload.any(), supplierController.supplierCreate);
router.get("/suppliers", supplierController.suppliersGet);
router.get("/supplier/:id", supplierController.supplierGetById);
router.put("/supplier/:id", supplierController.supplierUpdate);
router.delete("/supplier/:id", supplierController.supplierDelete);


module.exports = router;