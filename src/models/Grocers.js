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
        default : null
    },
    ownerName : {
        type : Sequalize.STRING,
        default : null,
        validate : {
            isAlpha : {
                msg : 'No es un nombre válido'
            }
        }
    },
    documentType : {
        type : Sequalize.STRING,
        validate :{
            allowNull: false
        }
    },
    documentId : {
        type : Sequalize.INTEGER,
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
        type : Sequalize.INTEGER,
        default : null
    },
    cellphone :{
        type :  Sequalize.INTEGER,
        validate : {
            isNumeric : true,
            isCellphone(value){
                if(2999999999 < value < 4000000000 ){
                    throw new Error('El número de celular no es válido.');
                }
            }
        }
    },
    address : {
        type : Sequalize.STRING,
        default : null
    },
    moreAddressInformation : {
        type : Sequalize.TEXT,
        default : null
    },
    locality : {
        type : Sequalize.STRING,
        default : null
    },
    neighborhood : {
        type : Sequalize.STRING,
        default : null
    },
    zone : {
        type : Sequalize.STRING,
        default : null
    },
    visitDay : {
        type : Sequalize.STRING,
        default : null
    },
    businessType : {
        type : Sequalize.STRING,
        default : null
    },
    sellerCreator : {
        type : Sequalize.INTEGER,
        default : null
    },
    level : {
        type : Sequalize.STRING,
        default : null
    },
    latitude : {
        type : Sequalize.FLOAT(11),
        default : null
    },
    longitude : {
        type : Sequalize.FLOAT(11),
        default : null
    }
});

module.exports = Grocers;