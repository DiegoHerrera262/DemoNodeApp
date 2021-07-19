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
    },
    cellphone: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
    },
    documentType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    documentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
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
    },
    zoneId: {
      type: DataTypes.STRING(30),
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
