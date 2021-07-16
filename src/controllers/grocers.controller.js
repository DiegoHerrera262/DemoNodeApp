const Grocers = require("../models/Grocers");

// Metodo de formulario para creacion de cliente
exports.grocerForm = (req, res) => {
  res.render("grocerCreate", {
    pageName: "Creación de cliente",
  });
};

// Metodo para incersión de cliente en db
exports.grocerCreate = async (req, res) => {

  try {
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
      locality,
      zone,
      latitude,
      longitude,
      sellerCreator,
      addressAdditionalInfo,
    } = req.body;

    console.log(req.body);

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
      locality,
      zone,
      neighborhood,
      latitude,
      longitude,
      sellerCreator,
    });


    console.log('creado con exito');

    res.status(200).send('creado con exito');
  } catch (error) {

    
    if (error.status) {
      if (error.status === 400) {
        return res.status(400).send('Error en el ingreso de datos, comuníquese con soporte técnico');
      }
      if (error.status.parseInt() === 406) {
        return res.status(406).send('Datos incorrectos: ' + error.message);
      }
      if (error.status.parseInt() === 500) {
        return res.status(500).send(error.message);
      }
    }
    console.log('Error en la creación ' + error.errors[0].type + ' en el valor ' + error.errors[0].value)
    res.status(450).send('Error en la creación ' + error.errors[0].type + ' en el valor ' + error.errors[0].value);
  }
  
};

exports.grocerGet = async (req, res) => {
  
}