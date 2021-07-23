const Suppliers = require("../models/Suppliers");


// Method for getting suppliers from DB
exports.suppliersGet = async (req, res) => {

  try {

    console.log(req.params.filter)

    filter = req.params.filter;

    console.log(filter);

    const supplier = await Suppliers.findAll();

    res.json(supplier);


  } catch (error) {
    res.status(500).send(error.message);
  }
}

// Method for getting an specific supplier
exports.supplierGetById = async (req, res) => {

  const id = req.params.id;
  try {
    const supplier = await Suppliers.findOne({
      where: {
        id: id
      }
    });
    res.json(supplier);

  } catch (error) {
    res.status(500).send(error.message);
  }
}

// Method to create a supplier
exports.supplierCreate = async (req, res) => {

  try {
    const {
      name,
      documentType,
      documentId,
      cellphone,
      phone,
      email,
      address,
      addressAdditionalInfo,
      neighborhood,
      locality,
      city,
      siigoId
    } = req.body;

    const matches = Suppliers.findAll({
      where: {
        documentId: documentId,
        cellphone: cellphone,
        name: name
      },
    });

    const supplier = await Suppliers.create({
        name,
        documentType,
        documentId,
        cellphone,
        phone,
        email,
        address,
        addressAdditionalInfo,
        neighborhood,
        locality,
        city,
        siigoId 
    });


    console.log('creado con exito');

    res.status(200).send('creado con exito');
  } catch (error) {

    console.log(error)
    console.log('Error en la creación, ' + error.errors[0].type + '. ' + error.errors[0].message + ' en el valor "' + error.errors[0].value + '"');
    res.status(450).send('Error en la creación, ' + error.errors[0].type + '. ' + error.errors[0].message + ' en el valor "' + error.errors[0].value + '"');
  }

};
// Method to update a grocer
exports.supplierUpdate = async (req, res) => {
  console.log(req.body);
  try {

    const {
        name,
        documentType,
        documentId,
        cellphone,
        phone,
        email,
        address,
        addressAdditionalInfo,
        neighborhood,
        locality,
        city,
        status
    } = req.body;


    await Suppliers.update({
        name,
        documentType,
        documentId,
        cellphone,
        phone,
        email,
        address,
        addressAdditionalInfo,
        neighborhood,
        locality,
        city,
        status
    }, {
      where: {
        id: req.params.id
      }
    });


    console.log('actualizado con exito');

    res.status(200).send('actualizado con exito');
  } catch (error) {

    console.log(error);

    console.log('Error en la actualización ' + error.errors[0].type + ' en el valor ' + error.errors[0].value)
    res.status(450).send('Error en la actualización ' + error.errors[0].type + ' en el valor ' + error.errors[0].value);
  }

};

// Method to delete a supplier
exports.supplierDelete = async (req, res) => {
  console.log(parseInt(req.params.id));
  const id = parseInt(req.params.id);


  try {
    console.log(id);

    await Suppliers.destroy({
      where: {
        id: id
      }
    });

    console.log('eliminado con exito');

    res.status(200).send('Eliminado con exito');
  } catch (error) {

    console.log(error);

    res.status(450).send('No fue posible eliminar el proveedor');
  }

};

