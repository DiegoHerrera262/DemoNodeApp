const Sequalize = require('sequelize');
const db = require('../data/database');

// Suppliers model
const Suppliers = db.define('suppliers', {
    // Primary key to identify the Supplier
    id: {
        type: Sequalize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    //Supplier name
    name: {
        type: Sequalize.STRING,
        unique: true,
        allowNull: false
    },


    // Document type either CC or NIT
    documentType: {
        type: Sequalize.STRING,
        allowNull: false
    },

    // number of the document
    documentId: {
        type: Sequalize.BIGINT,
        allowNull: false,
        unique: true,
        validate: {
            //Document number cannot be to short
            min: {
                args: 9999999,
                msg: 'El documento de identidad no es valido'
            }
        }
    },

    // supplier email
    email: {
        type: Sequalize.STRING,
        allowNull: true,
        validate: {
            // Verificate Is a valid email
            isEmail: {
                msg: 'El email no es valido'
            }
        }
    },

    //Supplier phone
    phone: {
        type: Sequalize.BIGINT,
        allowNull: true,
    },

    // supplier cellphone number
    cellphone: {
        type: Sequalize.BIGINT,
        unique: true,
        allowNull: true,
        validate: {
            // Validate if cellphone is valid in Colombia
            isNumeric: true,
            max: {
                args: 3999999999,
                msg: 'El Número celular no es válido'
            },
            min: {
                args: 3000000000,
                msg: 'El Número celular no es válido'
            }
        }
    },

    // supplier address
    address: {
        type: Sequalize.STRING,
        unique: true,
        allowNull: false,
    },

    // Additional information such as floor, supplier number or other
    addressAdditionalInfo: {
        type: Sequalize.TEXT,
        allowNull: true
    },
    // supplier zone according to superveci zones
    city: {
        type: Sequalize.STRING,
        allowNull: false,
    },

    // Locality where the supplier is located
    locality: {
        type: Sequalize.STRING,
        allowNull: false,
    },

    // neighborhood where the supplier is located
    neighborhood: {
        type: Sequalize.STRING,
        allowNull: false,
    },



    // siigoId of the supplier
    siigoId: {
        type: Sequalize.INTEGER,
        allowNull: true,
        unique: true,
        defaultValue: null
    },

    // supplier statuses
    // 0 = active client, 1 = inactive
    status: {
        type: Sequalize.INTEGER,
        defaultValue: 0
    }
});

module.exports = Suppliers;