const Sequalize = require('sequelize');
const db = require('../data/database');

const Grocers = db.define('grocers',{
    id : {
        type: Sequalize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    grocerName : {
        type : Sequalize.STRING,
        unique :  true,
        allowNull: false
    },
    ownerName : {
        type : Sequalize.STRING,
        allowNull: false
    },
    documentType : {
        type : Sequalize.STRING,
        allowNull: false
    },
    documentId : {
        type : Sequalize.BIGINT,
        allowNull: false,
        unique :  true
    },
    email : {
        type : Sequalize.STRING,
        allowNull: true,
        validate : {
            isEmail : {msg: 'El email no es valido'}
        }
    },
    phone : {
        type : Sequalize.BIGINT,
        allowNull: false,
    },
    cellphone :{
        type :  Sequalize.BIGINT,
        unique :  true,
        allowNull: false,
    },
    address : {
        type : Sequalize.STRING,
        unique :  true,
        allowNull: false,
    },
    addressAdditionalInfo : {
        type : Sequalize.TEXT,
        allowNull: true
    },
    locality : {
        type : Sequalize.STRING,
        allowNull: false,
    },
    neighborhood : {
        type : Sequalize.STRING,
        allowNull: false,
    },
    zone : {
        type : Sequalize.INTEGER,
        allowNull: false,
    },
    visitDay : {
        type : Sequalize.STRING,
        allowNull: true,
    },
    businessType : {
        type : Sequalize.STRING,
        allowNull: true
    },
    sellerCreator : {
        type : Sequalize.INTEGER,
        allowNull: true,
    },
    level : {
        type : Sequalize.STRING,
        defaultValue: "Vecino novato",
        allowNull: false,
    },
    latitude : {
        type : Sequalize.FLOAT(11),
        allowNull: false
    },
    longitude : {
        type : Sequalize.FLOAT(11),
        allowNull: false,
    }
});

module.exports = Grocers;