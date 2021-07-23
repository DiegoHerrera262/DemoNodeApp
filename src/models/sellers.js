const { DataTypes } = require("sequelize");
const sequelize = require("../data/database");

const Seller = sequelize.define(
  "sellers",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        is: /^[a-zA-Z]{1,10}[\s]{0,1}[a-zA-Z]{0,10}$/i,
      },
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        is: /^[a-zA-Z]{1,10}[\s]{0,1}[a-zA-Z]{0,10}$/i,
      },
    },
    cellphone: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
      validate: {
        min: { args: 3000000000, msg: "El móvil no es válido en Colombia" },
        max: {
          args: 3999999999,
          msg: "El móvil no es válido en Colombia",
        },
      },
    },
    documentType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    documentId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
      validate: {
        min: {
          args: 9999999,
          msg: "El documento de identidad no es válido en Colombia",
        },
        max: {
          args: 9999999999,
          msg: "El documento de identidad no es válido en Colombia",
        },
      },
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    address: {
      type: DataTypes.STRING(70),
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING(70),
      allowNull: true,
    },
    sellerCode: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: "El email no es válido" },
      },
    },
    zoneId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sellerType: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    contractExpires: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    contractImage: {
      type: DataTypes.STRING(70),
      allowNull: true,
      unique: true,
    },
    documentImage: {
      type: DataTypes.STRING(70),
      allowNull: true,
      unique: true,
    },
    rutImage: {
      type: DataTypes.STRING(70),
      allowNull: true,
      unique: true,
    },
    bankCertification: {
      type: DataTypes.STRING(70),
      allowNull: true,
      unique: true,
    },
    leaderId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Seller;
