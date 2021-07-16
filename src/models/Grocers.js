const Sequalize = require('sequelize');
const db = require('../data/database');

const Grocers = db.define('grocers',{
    Id : {
        type: Sequalize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    grocerName : {
        type : Sequalize.STRING,
        unique :  true
    },
    ownerName : {
        type : Sequalize.STRING,
    },
    documentType : {
        type : Sequalize.STRING,
    },
    documentId : {
        type : Sequalize.BIGINT,
        unique :  true
    },
    email : {
        type : Sequalize.STRING
    },
    phone : {
        type : Sequalize.BIGINT,
    },
    cellphone :{
        type :  Sequalize.BIGINT,
        unique :  true
    },
    address : {
        type : Sequalize.STRING,
        unique :  true
    },
    addressAdditionalInfo : {
        type : Sequalize.TEXT
    },
    locality : {
        type : Sequalize.STRING
    },
    neighborhood : {
        type : Sequalize.STRING
    },
    zone : {
        type : Sequalize.INTEGER
    },
    visitDay : {
        type : Sequalize.STRING
    },
    businessType : {
        type : Sequalize.STRING
    },
    sellerCreator : {
        type : Sequalize.INTEGER
    },
    level : {
        type : Sequalize.STRING
    },
    latitude : {
        type : Sequalize.FLOAT(11)
    },
    longitude : {
        type : Sequalize.FLOAT(11)
    }
});

module.exports = Grocers;