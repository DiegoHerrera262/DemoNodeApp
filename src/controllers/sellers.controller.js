// Connection to azure database
const dataBase = require("../data/database");
const sql = require("mssql");
const _ = require("underscore");
const fs = require("fs");

// Connection to azure blob storage
const config = require("../config");
const azureStorage = require("azure-storage");
const blobService = azureStorage.createBlobService();
const containerName = "sellers";

// config stream for ease of use
const getStream = require("into-stream");

const Seller = require("../models/Sellers");
const { Op } = require("sequelize");

// max file size
const MAX_SIZE = 5 * 1024 * 1024;

exports.sellersGet = async (req, res) => {
  console.log("Viewing zone leaders.");
  try {
    let leaders = [];
    console.log(req.query);
    if (req.query.all) {
      leaders = await Seller.findAll();
    } else {
      leaders = await Seller.findAll({
        where: {
          sellerType: "2",
        },
      });
    }
    res.json(leaders);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.sellersCreate = async (req, res) => {
  try {
    console.log(req.body);

    const {
      name,
      lastName,
      cellphone,
      documentType,
      documentId,
      leaderId,
      address,
      sellerCode,
      email,
      zoneId,
      contractExpires,
    } = req.body;

    console.log(req.body);

    const matches = await Seller.findAll({
      where: {
        [Op.or]: [
          { documentId: documentId },
          { cellphone: cellphone.toString() },
          { sellerCode: sellerCode.toString() },
          { email: email },
        ],
      },
    });

    console.log(matches);

    if (matches.length > 0) {
      console.log("Asesor ya fue registrado");
      return res.status(406).send("Asesor ya fue registrado");
    }

    const genBlobName = (originalName) => {
      const identifier = Math.random().toString().replace(/0\./, "");
      return `${identifier}-${originalName}`;
    };

    let correctFileSizes = true;
    for (let i = 0; i < req.files.length; i++) {
      correctFileSizes = correctFileSizes || req.files[i].size < MAX_SIZE;
    }

    if (!correctFileSizes) {
      return res.status(406).send("Archivos exceden maximo tamano");
    }

    const fileBlobKeys = _.object(
      req.files.map((file, i) => {
        const nameKeys = [
          "contractDocument",
          "documentPhoto",
          "rutDocument",
          "profileImage",
          "bankCertification",
        ];
        const blobName = genBlobName(
          `${nameKeys[i]}-${name.trim()}-${lastName.trim()}`
        );
        const stream = getStream(file.buffer);
        const streamLength = file.buffer.length;

        blobService.createBlockBlobFromStream(
          containerName,
          blobName,
          stream,
          streamLength,
          (err) => {
            if (err) {
              console.error(err);
              return;
            }
            console.log("Subida de archivo exitosa");
          }
        );

        return [file.fieldname, blobName];
      })
    );

    console.log(fileBlobKeys);

    const leader = await Seller.create({
      name: name,
      lastName: lastName,
      cellphone: cellphone,
      documentType: documentType,
      documentId: documentId.toString(),
      status: true,
      address: address,
      sellerCode: sellerCode.toString(),
      email: email,
      zoneId: zoneId.toString(),
      sellerType: "2",
      leaderId: leaderId,
      contractExpires: contractExpires,
      imageUrl: fileBlobKeys["imageUrl"],
      contractImage: fileBlobKeys["contractImage"],
      documentImage: fileBlobKeys["documentImage"],
      rutImage: fileBlobKeys["rutImage"],
      bankCertification: fileBlobKeys["bankCertification"],
    });

    res.send("Asesor creado correctamente");
  } catch (error) {
    if (error.errors) {
      const { errors } = error;
      const message = errors[0].value + " : " + errors[0].type;
      console.log(message);
      res.status(406).send(message);
    }
    console.log(error.message);
    res.status(500).send(error.message);
  }
};

exports.sellersDelete = async (req, res) => {
  const { id } = req.params;
  console.log("Deleting zone leader with id: ", id);
  try {
    const leaderData = await Seller.findAll({
      where: {
        id: id,
      },
    });

    console.log(leaderData[0].dataValues);

    const {
      contractImage,
      documentImage,
      rutImage,
      bankCertification,
      imageUrl,
    } = leaderData[0].dataValues;

    const fileBlobs = [
      contractImage,
      documentImage,
      rutImage,
      bankCertification,
      imageUrl,
    ];

    fileBlobs.map((blobName) => {
      blobService.deleteBlobIfExists(containerName, blobName, (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("Archivo borrado correctamente.");
      });
    });

    const deletedLeader = await Seller.destroy({
      where: {
        id: id,
      },
    });

    res.json(`Deleted zone leader with ID : ${id}`);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.zoneLeadersGet = async (req, res) => {
  console.log("Trayendo líderes de zona.");
  try {
    const leaders = await Seller.findAll({
      where: {
        sellerType: "3",
      },
    });
    res.json(leaders);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.zoneLeaderGetById = async (req, res) => {
  const { id } = req.params;
  console.log("Viewing zone leader with id: ", id);
  try {
    const leader = await Seller.findAll({
      where: {
        id: id,
        sellerType: "3",
      },
    });

    const {
      imageUrl,
      contractImage,
      documentImage,
      bankCertification,
      rutImage,
    } = leader[0].dataValues;

    const fileBlobs = [
      imageUrl,
      contractImage,
      documentImage,
      bankCertification,
      rutImage,
    ];

    const fileStreams = fileBlobs.map((blob) => {
      return blobService.createReadStream(containerName, blob);
    });

    /*
    fileStreams.forEach((stream) => {
      stream.pipe(res);
    });
    */

    fileStreams[4].pipe(res);

    // res.json(leader);
  } catch (error) {
    console.log(error);
    if (error.errors) {
      console.log(error.errors[0]);
    }
    res.status(500).send(error.message);
  }
};

exports.zoneLeadersCreate = async (req, res) => {
  try {
    console.log(req.body);

    const {
      name,
      lastName,
      cellphone,
      documentType,
      documentId,
      address,
      sellerCode,
      email,
      zoneId,
      contractExpires,
    } = req.body;

    console.log(req.body);

    const matches = await Seller.findAll({
      where: {
        [Op.or]: [
          { documentId: documentId },
          { cellphone: cellphone.toString() },
          { sellerCode: sellerCode.toString() },
          { email: email },
        ],
      },
    });

    console.log(matches);

    if (matches.length > 0) {
      console.log("Líder ya fue registrado");
      return res.status(406).send("Líder ya fue registrado");
    }

    const genBlobName = (originalName) => {
      const identifier = Math.random().toString().replace(/0\./, "");
      return `${identifier}-${originalName}`;
    };

    let correctFileSizes = true;
    for (let i = 0; i < req.files.length; i++) {
      correctFileSizes = correctFileSizes || req.files[i].size < MAX_SIZE;
    }

    if (!correctFileSizes) {
      return res.status(406).send("Archivos exceden maximo tamano");
    }

    const fileBlobKeys = _.object(
      req.files.map((file, i) => {
        const nameKeys = [
          "contractDocument",
          "documentPhoto",
          "rutDocument",
          "profileImage",
          "bankCertification",
        ];
        const blobName = genBlobName(
          `${nameKeys[i]}-${name.trim()}-${lastName.trim()}`
        );
        const stream = getStream(file.buffer);
        const streamLength = file.buffer.length;

        blobService.createBlockBlobFromStream(
          containerName,
          blobName,
          stream,
          streamLength,
          (err) => {
            if (err) {
              console.error(err);
              return;
            }
            console.log("Subida de archivo exitosa");
          }
        );

        return [file.fieldname, blobName];
      })
    );

    console.log(fileBlobKeys);

    const leader = await Seller.create({
      name: name,
      lastName: lastName,
      cellphone: cellphone,
      documentType: documentType,
      documentId: documentId.toString(),
      status: true,
      address: address,
      sellerCode: sellerCode.toString(),
      email: email,
      zoneId: zoneId.toString(),
      sellerType: "3",
      contractExpires: contractExpires,
      imageUrl: fileBlobKeys["imageUrl"],
      contractImage: fileBlobKeys["contractImage"],
      documentImage: fileBlobKeys["documentImage"],
      rutImage: fileBlobKeys["rutImage"],
      bankCertification: fileBlobKeys["bankCertification"],
    });

    const [leaderCol] = await Seller.findAll({
      where: {
        documentId: documentId,
      },
    });

    const id = leaderCol.id;

    const leaderIdUpdate = await Seller.update(
      {
        leaderId: id,
      },
      {
        where: {
          id: id,
        },
      }
    );

    res.send("Líder creado correctamente");
  } catch (error) {
    if (error.errors) {
      const { errors } = error;
      const message = errors[0].value + " : " + errors[0].type;
      console.log(message);
      res.status(406).send(message);
    }
    console.log(error.message);
    res.status(500).send(error.message);
  }
};

exports.zoneLeaderEditById = async (req, res) => {
  const { id } = req.params;
  console.log("Editing zone leader with id: ", id);
  try {
    const pool = await dataBase();

    const {
      name,
      last_name,
      documentId,
      address,
      leader_code,
      email,
      cellphone,
      zone_id,
      endContractDate,
      documentPhoto,
      rutDocument,
      contractDocument,
      profileImage,
      bankCertification,
    } = req.body;

    // validate if user is already registered
    const prevRegisters = await pool
      .request()
      .input("document", sql.VarChar, documentId.toString())
      .input("cellphone", sql.VarChar, cellphone.toString())
      .input("seller_code", sql.VarChar, leader_code.toString())
      .query(zoneLeaderValidationQuery);

    let thereIsMatch = false;
    for (let i = 0; i < prevRegisters.recordset.length; i++) {
      if (prevRegisters.recordset[i]["id"] !== parseInt(id)) {
        thereIsMatch = true;
        break;
      }
    }

    if (thereIsMatch) {
      return res.status(406).send("Datos ya fueron registrados");
    }

    const today = new Date();

    await pool
      .request()
      .input("id", sql.Int, id)
      .input("name", sql.VarChar, name.toString())
      .input("last_name", sql.VarChar, last_name.toString())
      .input("cellphone", sql.VarChar, cellphone.toString())
      .input("document_type", sql.Char, "1")
      .input("document", sql.VarChar, documentId.toString())
      .input("status", sql.Bit, 1)
      .input("address", sql.VarChar, address)
      .input("image_url", sql.VarChar, profileImage)
      .input("seller_code", sql.VarChar, leader_code.toString())
      .input("seller_type", sql.Char, "3")
      .input("contract_expires", sql.Date, endContractDate)
      .input("contract_image", sql.VarChar, contractDocument)
      .input("document_image", sql.VarChar, documentPhoto)
      .input("rut_image", sql.VarChar, rutDocument)
      .input("bank_certification", sql.VarChar, bankCertification)
      .input("email", sql.VarChar, email)
      .input("zone_id", sql.Int, zone_id.toString())
      .input("updated_at", sql.Date, today)
      .query(updateZoneLeaderById);

    res.json(req.body);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
