const Grocers = require("../models/Grocers");


// Metodo para llamar todos los tenderos
exports.grocerGet = async (req, res) => {
  try {
    const grocers = await Grocers.findAll();

    res.json(grocers);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

// Metodo para llamar cliente por Id
exports.grocerGetById = async (req, res) => {

  const id = req.params.id;
  try {
    const grocer = await Grocers.findOne({
      where: {
        id : id
      }
    });
    res.json(grocer);

  } catch (error) {
    res.status(500).send(error.message);
  }
}

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

    const matches = Grocers.findAll({
      where: {
        documentId: documentId,
        cellphone: cellphone,
        grocerName: grocerName
      },
    });
    if (matches.length > 0) {
      return res.status(406).send("Cliente ya fue registrado");
    }

    console.log(req.body);
    if(documentId < 999999){
      res.status(406).send('El documento es inválido');
    }

    if( !(2999999999 < cellphone < 4000000000)){
      res.status(406).send('El número de celular es inválido');
    }


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

    console.log(error);
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

exports.grocerUpdate = async (req, res) => {
  console.log(req.body);
  try {

    grocers = await Grocers.findAll();
    

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
    if(documentId < 999999){
      res.status(406).send('El documento es inválido');
    }

    if( !(2999999999 < cellphone < 4000000000)){
      res.status(406).send('El número de celular es inválido');
    }


    await Grocers.update({
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
      sellerCreator},
      {where: { id: req.params.id}}
    );


    console.log('actualizado con exito');

    res.status(200).send('actualizado con exito');
  } catch (error) {

    console.log(error);
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

exports.grocerDelete = async (req, res) => {
  console.log(parseInt(req.params.id));
  const id = parseInt(req.params.id);


  try {
    console.log(id);

    await Grocers.destroy({
      where: {
        id : id
      }
    });

    console.log('eliminado con exito');

    res.status(200).send('Eliminado con exito');
  } catch (error) {

    console.log(error);

    res.status(450).send('No fue posible eliminar el cliente');
  }
  
};