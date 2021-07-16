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
    addressAdditionalInfo,
  } = req.body;

  console.log(req.body);



  let errors = [];

  // if (documentId < 99999) {
  //   errors.push({ text: "Documento inválido" });
  // }

  // if (errors.length > 0) {
  //   res.render("grocerCreate", {
  //     PageName: "Creación de cliente",
  //     errors,
  //   });
  // } else {
    const grocer = await Grocers.create({
      grocerName,
      ownerName,
      documentType,
      documentId,
      cellphone,
      phone,
      email,
      address,
      addressAdditionalInfo,
      neighborhood,
      latitude,
      longitude,
      sellerCreator,
    });
    console.log('creado con exito');
  // }
};
