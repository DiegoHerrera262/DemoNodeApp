const Sequalize = require('sequelize');

const db = require('../data/database');

const Grocers = db.define('grocers',{
    id : {
        type: Sequalize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    grocer_name : Sequalize.STRING,
    owner_name : Sequalize.STRING,
    document_type : Sequalize.STRING,
    document_id : Sequalize.INTEGER,
    email : Sequalize.STRING,
    phone : Sequalize.INTEGER,
    cellphone : Sequalize.INTEGER,
    address : Sequalize.STRING,
    module : Sequalize.TEXT,
    locality : Sequalize.STRING,
    neighborhood : Sequalize.STRING,
    visit_day : Sequalize.STRING,
    business_type : Sequalize.STRING,
    seller_id : Sequalize.INTEGER,
    latitude : Sequalize.FLOAT(11),
    longitude : Sequalize.FLOAT(11),
    created_at : Sequalize.DATE,
    updated_at : Sequalize.DATE


});