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
    },
    ownerName : {
        type : Sequalize.STRING,
    },
    documentType : {
        type : Sequalize.STRING,
    },
    documentId : {
        type : Sequalize.BIGINT,
        validate : {
            isDocument(value){
                if(value <= 99999){
                    throw new Error('El documento no es válido.');
                }
            }
        }
    },
    email : {
        type : Sequalize.STRING,
        validate : {
            isEmail : {
                msg : 'No es un email válido.'
            }
        }
    },
    phone : {
        type : Sequalize.BIGINT,
    },
    cellphone :{
        type :  Sequalize.BIGINT,
        validate : {
            isNumeric : true,
            isCellphone(value){
                if(2999999999 < value < 4000000000 ){
                    //throw new Error('El número de celular no es válido.');
                }
            }
        }
    },
    address : {
        type : Sequalize.STRING,
    },
    addressAdditionalInfo : {
        type : Sequalize.TEXT,
    },
    locality : {
        type : Sequalize.STRING,
    },
    neighborhood : {
        type : Sequalize.STRING,
    },
    zone : {
        type : Sequalize.INTEGER,
    },
    visitDay : {
        type : Sequalize.STRING,
    },
    businessType : {
        type : Sequalize.STRING,
    },
    sellerCreator : {
        type : Sequalize.INTEGER,
    },
    level : {
        type : Sequalize.STRING,
    },
    latitude : {
        type : Sequalize.FLOAT(11),
    },
    longitude : {
        type : Sequalize.FLOAT(11),
    }
});

module.exports = Grocers;