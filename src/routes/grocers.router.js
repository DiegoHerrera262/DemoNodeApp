const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const grocersController = require("../controllers/grocers.controller");

// route for creating view
router.get("/grocer/create", grocersController.grocerForm);
router.post("/grocer/create", upload.any(), grocersController.grocerCreate);

module.exports = router;
