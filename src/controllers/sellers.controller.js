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

const Seller = require("../models/sellers");
const { Op } = require("sequelize");
const { findAll } = require("../models/sellers");

// max file size
const MAX_SIZE = 5 * 1024 * 1024;

exports.sellersGet = async (req, res) => {
  console.log("Viewing zone leaders.");
  try {
    let leaders = [];
    console.log(req.query);
    if (req.query.all) {
      leaders = await Seller.findAll();
      return res.json(leaders);
    }
    leaders = await Seller.findAll({
      where: { ...req.query },
    });
    return res.json(leaders);
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

exports.sellersUpdateById = async (req, res) => {
  try {
    console.log(req.params);
    console.log(req.body);
    console.log(req.files);

    let { id } = req.params;

    await Seller.update(
      { ...req.body, sellerType: "2" },
      { where: { id: id } }
    );

    const genBlobName = (originalName) => {
      const identifier = Math.random().toString().replace(/0\./, "");
      return `${identifier}-${originalName}`;
    };

    if (req.files.length > 0) {
      const sellerData = await Seller.findAll({ where: { id: id } });

      let correctFileSizes = true;
      for (let i = 0; i < req.files.length; i++) {
        correctFileSizes = correctFileSizes || req.files[i].size < MAX_SIZE;
      }

      if (!correctFileSizes) {
        return res.status(406).send("Archivos exceden maximo tamano");
      }

      let updatedBlobs = {};

      req.files.forEach((file) => {
        const blobName = genBlobName(
          `${
            file.fieldname
          }-${sellerData[0].name.trim()}-${sellerData[0].lastName.trim()}-${new Date().toISOString()}`
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
              console.log(error);
              return;
            }
            console.log("Se ha creado un nuevo blob para ", file.fieldname);
          }
        );
        updatedBlobs[`${file.fieldname}`] = blobName;
      });

      await Seller.update(updatedBlobs, { where: { id: id } });
    }

    // console.log(fileBlobKeys);

    res.json("Asesor actualizado correctamente");
  } catch (error) {
    console.log(error);
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

exports.sellerGetFilesById = async (req, res) => {
  const { id } = req.params;
  const { fileKey } = req.query;
  // console.log(fileKey);
  // console.log(id);

  try {
    console.log(`Trayendo ${fileKey} de asesor con id : ${id}`);
    const [{ [fileKey]: fileBlob }] = await Seller.findAll({
      attributes: [fileKey.toString()],
      where: {
        id: id,
      },
    });
    const stream = blobService.createReadStream(containerName, fileBlob);
    res.set({
      "Content-Disposition": `${fileBlob}.pdf`,
      "Content-Type": "application/pdf",
    });
    stream.pipe(res);
    // return res.json(fileBlob);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
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

    return leader[0].dataValues;

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

    let createdBlobs = {};

    req.files.forEach((file) => {
      const blobName = genBlobName(
        `${file.fieldname}-${name.trim()}-${lastName.trim()}`
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
            console.log(error);
            return;
          }
          console.log("Se ha creado un blob para ", file.fieldname);
        }
      );
      createdBlobs[`${file.fieldname}`] = blobName;
    });

    console.log(createdBlobs);

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
      imageUrl: createdBlobs["imageUrl"],
      contractImage: createdBlobs["contractImage"],
      documentImage: createdBlobs["documentImage"],
      rutImage: createdBlobs["rutImage"],
      bankCertification: createdBlobs["bankCertification"],
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

exports.zoneLeaderUpdateById = async (req, res) => {
  try {
    console.log(req.params);
    console.log(req.body);
    console.log(req.files);

    let { id } = req.params;

    await Seller.update(
      { ...req.body, leaderId: id, sellerType: "3" },
      { where: { id: id } }
    );

    const genBlobName = (originalName) => {
      const identifier = Math.random().toString().replace(/0\./, "");
      return `${identifier}-${originalName}`;
    };

    if (req.files.length > 0) {
      const sellerData = await Seller.findAll({ where: { id: id } });

      let correctFileSizes = true;
      for (let i = 0; i < req.files.length; i++) {
        correctFileSizes = correctFileSizes || req.files[i].size < MAX_SIZE;
      }

      if (!correctFileSizes) {
        return res.status(406).send("Archivos exceden maximo tamano");
      }

      let updatedBlobs = {};

      req.files.forEach((file) => {
        const blobName = genBlobName(
          `${
            file.fieldname
          }-${sellerData[0].name.trim()}-${sellerData[0].lastName.trim()}-${new Date()}`
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
              console.log(error);
              return;
            }
            console.log("Se ha creado un nuevo blob para ", file.fieldname);
          }
        );
        updatedBlobs[`${file.fieldname}`] = blobName;
      });

      await Seller.update(updatedBlobs, { where: { id: id } });
    }

    // console.log(fileBlobKeys);

    // console.log(req.files);
    // console.log(req.body);
    res.json("Líder actualizado correctamente");
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};
