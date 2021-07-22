const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const grocersController = require("../controllers/grocers.controller");


// route for creating grocer from web app
router.post("/grocer/create", upload.any(), grocersController.grocerCreate);
router.get("/grocers/filterId=:filterId&sellerCreatorId=:sellerCreatorId&zone=:zone&level=:level&dateFrom=:dateFrom&dateTo=:dateTo&status=:status", grocersController.grocerGet);
router.get("/grocer/:id", grocersController.grocerGetById);
router.put("/grocer/:id", grocersController.grocerUpdate);
router.put("/grocerLevel/:id", grocersController.grocerLevel);
router.delete("/grocer/:id", grocersController.grocerDelete);


module.exports = router;
