const Sequalize = require("sequelize");
const db = require("../data/database");

// Grocer model
const Grocers = db.define("grocers", {
  // Primary key to identify the Grocer
  id: {
    type: Sequalize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },

  //Grocer name
  grocerName: {
    type: Sequalize.STRING,
    unique: true,
    allowNull: false,
  },

  //Name of the grocer owner
  ownerName: {
    type: Sequalize.STRING,
    allowNull: false,
  },

  // Document type either CC or NIT
  documentType: {
    type: Sequalize.STRING,
    allowNull: false,
  },

  // number of the document
  documentId: {
    type: Sequalize.BIGINT,
    allowNull: false,
    unique: true,
    validate: {
      //Document number cannot be to short
      min: { args: 9999999, msg: "El documento de identidad no es válido" },
    },
  },

  // grocer email
  email: {
    type: Sequalize.STRING,
    allowNull: true,
    validate: {
      // Verify Is a valid email
      isEmail: { msg: "El email no es válido" },
    },
  },

  //grocer phone
  phone: {
    type: Sequalize.BIGINT,
    allowNull: false,
  },

  // grocer cellphone number
  cellphone: {
    type: Sequalize.BIGINT,
    unique: true,
    allowNull: false,
    validate: {
      // Validate if cellphone is valid in Colombia
      isNumeric: true,
      max: { args: 3999999999, msg: "El Número celular no es válido" },
      min: { args: 3000000000, msg: "El Número celular no es válido" },
    },
  },

  // grocer address
  address: {
    type: Sequalize.STRING,
    unique: true,
    allowNull: false,
  },

  // Additional information such as floor, grocer number or other
  addressAdditionalInfo: {
    type: Sequalize.TEXT,
    allowNull: true,
  },

  // Locality where the grocer is located
  locality: {
    type: Sequalize.STRING,
    allowNull: false,
  },

  // neighborhood where the grocer is located
  neighborhood: {
    type: Sequalize.STRING,
    allowNull: false,
  },

  // grocer zone according to superveci zones
  zone: {
    type: Sequalize.INTEGER,
    allowNull: false,
  },

  // weekday when the asesor should visit the grocer
  visitDay: {
    type: Sequalize.STRING,
    allowNull: true,
  },

  // what kind of grocer it is
  businessType: {
    type: Sequalize.STRING,
    allowNull: true,
  },

  // seller who bring the grocer to superveci
  sellerCreator: {
    type: Sequalize.INTEGER,
    allowNull: true,
  },

  // grocer level according to superveci hierarchy
  level: {
    type: Sequalize.STRING,
    defaultValue: "Vecino novato",
    allowNull: false,
  },

  // geolocalization information
  latitude: {
    type: Sequalize.FLOAT(11),
    allowNull: false,
  },
  longitude: {
    type: Sequalize.FLOAT(11),
    allowNull: false,
  },

  // client statuses
  // 0 = active client, 1 = inactive
  status: {
    type: Sequalize.INTEGER,
    defaultValue: 0,
  },
});

module.exports = Grocers;
