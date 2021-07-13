const Sequalize = require('sequelize');

const db = require('../data/database');

const Grocers = db.define('grocers',{
    id : {
        type: Sequalize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    grocerName : Sequalize.STRING,
    ownerName : Sequalize.STRING,
    documentType : Sequalize.STRING,
    documentId : Sequalize.INTEGER,
    email : Sequalize.STRING,
    phone : Sequalize.INTEGER,
    cellphone : Sequalize.INTEGER,
    address : Sequalize.STRING,
    moreAddressInformation : Sequalize.TEXT,
    locality : Sequalize.STRING,
    neighborhood : Sequalize.STRING,
    zone : Sequalize.STRING,
    visitDay : Sequalize.STRING,
    businessType : Sequalize.STRING,
    sellerCreator : Sequalize.INTEGER,
    level : Sequalize.STRING,
    latitude : Sequalize.FLOAT(11),
    longitude : Sequalize.FLOAT(11),
});

module.exports = Grocers;