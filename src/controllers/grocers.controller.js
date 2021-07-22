const Grocers = require("../models/Grocers");
const { Op } = require("sequelize");
//const Orders = require("../models/Orders");


// Method for getting grocers from DB
exports.grocerGet = async (req, res) => {

  try {
    // filters
    // 0 =  no filter
    // 1 = asesor filterId
    // 2 = zone filterId  
    // 3 = level filter
    // 4 = date fitler
    // 5 = status filter
    
    filter = req.query
    console.log(filter);

    if (filter) {
      if(filter.endDate && filter.startDate){
        grocers = await Grocers.findAll({
          where: {
            createdAt: {
              [Op.between]: [filter.dateFrom, filter.dateTo]
            }
          }
        });
      }
      else{
        grocers = await Grocers.findAll({
          where: filter
        });
      }
    }
    else{
      grocers = await Grocers.findAll();
    }
   
    res.json(grocers);


  } catch (error) {
    res.status(500).send(error.message);
  }
}

// Method for getting an specific grocer
exports.grocerGetById = async (req, res) => {

  const id = req.params.id;
  try {
    const grocer = await Grocers.findOne({
      where: {
        id: id
      }
    });
    res.json(grocer);

  } catch (error) {
    res.status(500).send(error.message);
  }
}

// Method to create a grocer
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

    // if (error.status) {
    //   if (error.status === 400) {
    //     return res.status(400).send('Error en el ingreso de datos, comuníquese con soporte técnico');
    //   }
    //   if (error.status.parseInt() === 406) {
    //     return res.status(406).send('Datos incorrectos: ' + error.message);
    //   }
    //   if (error.status.parseInt() === 500) {
    //     return res.status(500).send(error.message);
    //   }
    // }
    console.log(error)
    console.log('Error en la creación, ' + error.errors[0].type + '. ' + error.errors[0].message + ' en el valor "' + error.errors[0].value + '"');
    res.status(450).send('Error en la creación, ' + error.errors[0].type + '. ' + error.errors[0].message + ' en el valor "' + error.errors[0].value + '"');
  }

};
// Method to update a grocer
exports.grocerUpdate = async (req, res) => {
  console.log(req.body);
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
    if (documentId < 999999) {
      res.status(406).send('El documento es inválido');
    }

    if (!(2999999999 < cellphone < 4000000000)) {
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
      sellerCreator
    }, {
      where: {
        id: req.params.id
      }
    });


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

// Method to delete a grocer
exports.grocerDelete = async (req, res) => {
  console.log(parseInt(req.params.id));
  const id = parseInt(req.params.id);


  try {
    console.log(id);

    await Grocers.destroy({
      where: {
        id: id
      }
    });

    console.log('eliminado con exito');

    res.status(200).send('Eliminado con exito');
  } catch (error) {

    console.log(error);

    res.status(450).send('No fue posible eliminar el cliente');
  }

};

exports.grocerLevel = async (req, res) => {
  try {

    const id = req.params.id;

      const grocer = await Grocers.findOne({
        where: {
          id: id
        }
      });
    endDate = new Date.today();
    startDate = new Date.today();
    startDate.setDate(startDate.getDate() - 30);

    console.log(endDate.toFormat('YYYY-MM-DD'),startDate.toFormat('YYYY-MM-DD'));


    res.json(grocers);
    
    // grocerOrders = await Orders.count({
    //   where : {
    //     createdAt: {
    //       [Op.between]: [startDate, endDate]
    //     }
    // }
    // });

    if(grocerOrders <= 5){
      level = 'Vecino novato'
      await Grocers.update({
        level
      }, {
        where: {
          id: req.params.id
        }
      });
    }
    if(5 < grocerOrders < 11){
      level = 'Vecino fiel'
      await Grocers.update({
        level
      }, {
        where: {
          id: req.params.id
        }
      });
    }
    if(10 < grocerOrders ){
      level = 'Vecino pro'
      await Grocers.update({
        level
      }, {
        where: {
          id: req.params.id
        }
      });
    }
    
  } catch (error) {
    console.log(error);

    res.status(450).send('No fue posible asignar nivel del cliente');
  }
}