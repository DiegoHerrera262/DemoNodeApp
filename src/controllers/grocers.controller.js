const Grocers = require("../models/Grocers");

// Metodo de formulario para creacion de cliente
exports.grocerForm = (req, res) => {
  res.render("grocerCreate", {
    pageName: "Creación de cliente",
  });
};

// Metodo para incersión de cliente en db
exports.grocerCreate = async (req, res) => {
  const {
    grocerName,
    ownerName,
    documentType,
    documentId,
    cellphone,
    phone,
    email,
    address,
    neighborhood,
    latitude,
    longitude,
    sellerCreator,
    moreAdditionalInformation,
  } = req.body;

  /*
    // Accediendo a los datos del formulario
    const grocerName = req.body.grocerName;
    const ownerName = req.body.ownerName;
    const documentType = req.body.documentType;
    const documentId = req.body.documentId;
    const cellphone = req.body.cellphone;
    const phone = req.body.phone;
    const email = req.body.email;
    const address = req.body.address;
    const additionalInfo = req.body.momoreAddressInformation;
    const neighborhood = req.body.neighborhood;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    */

  let errors = [];

  if (documentId < 99999) {
    errors.push({ text: "Documento inválido" });
  }

  if (errors.length > 0) {
    res.render("grocerCreate", {
      PageName: "Creación de cliente",
      errors,
    });
  } else {
    const grocer = await Grocers.create({
      grocerName,
      ownerName,
      documentType,
      documentId,
      cellphone,
      phone,
      email,
      address,
      moreAdditionalInformation,
      neighborhood,
      latitude,
      longitude,
      sellerCreator,
    });
    res.redirect("/grocerDetail");
  }
};
