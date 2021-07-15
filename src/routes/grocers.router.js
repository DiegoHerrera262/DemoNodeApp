const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const grocersController = require("../controllers/grocers.controller");

// route for creating view
router.get("/grocer/create", grocersController.grocerForm);

// route for creating grocer from web app
router.post("/grocer/create", upload.any(), grocersController.grocerCreate);

module.exports = router;
