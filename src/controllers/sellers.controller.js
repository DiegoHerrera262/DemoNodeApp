// Connection to azure database
const dataBase = require('../data/database');
const sql = require('mssql');
const _ = require('underscore');
const fs = require('fs');

// Connection to azure blob storage
const config = require('../config');
const azureStorage = require('azure-storage');
const blobService = azureStorage.createBlobService();
const containerName = 'sellers';
// config stream for ease o use
const getStream = require('into-stream');

// queries to database
const { 
    getAllZoneLeaders,
    getZoneLeaderById,
    deleteZoneLeaderById,
    updateZoneLeaderById,
    zoneLeaderValidationQuery, 
    createNewZoneLeader
} = require('../data/sellers.queries');

// max file size
const MAX_SIZE = 5 * 1024 * 1024;

exports.zoneLeadersGet = async (req, res) => {
    console.log('Viewing zone leaders.');
    try {
        const pool = await dataBase();
        const result =  await pool.request().query(getAllZoneLeaders);
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.zoneLeaderGetById = async (req, res) => {
    const {id} = req.params; 
    console.log('Viewing zone leader with id: ', id);
    try {
        const pool = await dataBase();
        const result =  await pool.request()
            .input("id", sql.Int, id)
            .query(getZoneLeaderById);
        const { image_url } = result.recordset[0];

        const writeStream = fs.createWriteStream(`${image_url}.png`);
        blobService.getBlobToLocalFile(containerName, image_url, `${image_url}.png`, (err, serverBlob) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(serverBlob);
            });


        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.zoneLeadersCreate = async (req, res) => {
    
    try {

        const genBlobName = (originalName) => {
            const identifier = Math.random().toString().replace(/0\./, '');
            return `${identifier}-${originalName}`
        }
        
        const {name, 
            last_name, 
            documentId, 
            address, 
            leader_code, 
            email,
            cellphone,
            zone_id,
            endContractDate
        } = req.body;

        let correctFileSizes = true;
        for (let i = 0; i < req.files.length; i++){
            correctFileSizes = correctFileSizes || req.files[i].size < MAX_SIZE;
        }

        if (!correctFileSizes) {
            return res.status(406).send('Archivos exceden maximo tamano');
        }

        const fileBlobKeys = _.object(req.files.map((file, i) => {
            const nameKeys = [
                'contractDocument',
                'documentPhoto',
                'rutDocument',
                'profileImage',
                'bankCertification'
            ];
            const blobName = genBlobName(`${nameKeys[i]}-${name}-${last_name}`);
            const stream = getStream(file.buffer);
            const streamLength = file.buffer.length;

            blobService.createBlockBlobFromStream(containerName, blobName, stream, streamLength, err => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log('Subida de archivo exitosa');
            });

            return [file.fieldname, blobName]
        }));

        console.log(fileBlobKeys);

        const today = new Date();

        const pool = await dataBase();

        // validate if user is already registered
        const prevRegisters = await pool.request()
            .input("document", sql.VarChar, documentId.toString())
            .input("cellphone", sql.VarChar, cellphone.toString())
            .input("seller_code", sql.VarChar, leader_code.toString())
            .query(zoneLeaderValidationQuery);

        if (prevRegisters.recordset.length > 0) {
            return res.status(406).send("Líder ya fue registrado");
        }

        await pool.request()
            .input("name", sql.VarChar, name.toString())
            .input("last_name", sql.VarChar, last_name.toString())
            .input("cellphone", sql.VarChar, cellphone.toString())
            .input("document_type", sql.Char, '1')
            .input("document", sql.VarChar, documentId.toString())
            .input("email", sql.VarChar, email)
            .input("zone_id", sql.Int, zone_id.toString())
            .input("status", sql.Bit, 1)
            .input("address", sql.VarChar, address)
            .input("created_at", sql.Date, today)
            .input("updated_at", sql.Date, today)
            .input("seller_code", sql.VarChar, leader_code.toString())
            .input("seller_type", sql.Char, "3")
            .input("contract_expires", sql.Date, endContractDate)
            .input("contract_image", sql.VarChar, fileBlobKeys['contractDocument'])
            .input("document_image", sql.VarChar, fileBlobKeys['documentPhoto'])
            .input("rut_image", sql.VarChar, fileBlobKeys['rutDocument'])
            .input("bank_certification", sql.VarChar, fileBlobKeys['bankCertification'])
            .input("image_url", sql.VarChar, fileBlobKeys['profileImage'])
            .query(createNewZoneLeader);

        res.json(req.body);
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
    
};

exports.zoneLeaderEditById = async (req, res) => {
    const {id} = req.params;
    console.log('Editing zone leader with id: ', id);
    try {
        const pool = await dataBase();
        
        const {name, 
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
            bankCertification
        } = req.body;

        // validate if user is already registered
        const prevRegisters = await pool.request()
            .input("document", sql.VarChar, documentId.toString())
            .input("cellphone", sql.VarChar, cellphone.toString())
            .input("seller_code", sql.VarChar, leader_code.toString())
            .query(zoneLeaderValidationQuery);

        let thereIsMatch = false;
        for (let i = 0; i < prevRegisters.recordset.length; i++){
            if (prevRegisters.recordset[i]['id'] !== parseInt(id)) {
                thereIsMatch = true;
                break;
            }
        }

        if (thereIsMatch) {
            return res.status(406).send("Datos ya fueron registrados");
        }

        const today = new Date();

        await pool.request()
            .input("id", sql.Int, id)
            .input("name", sql.VarChar, name.toString())
            .input("last_name", sql.VarChar, last_name.toString())
            .input("cellphone", sql.VarChar, cellphone.toString())
            .input("document_type", sql.Char, '1')
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

exports.zoneLeadersDelete = async (req, res) => {
    const {id} = req.params; 
    console.log('Deleting zone leader with id: ', id);
    try {
        const pool = await dataBase();

        // delete block blobs from azure
        const result = await pool.request()
            .input("id", sql.Int, id)
            .query(getZoneLeaderById);
        
        const {
            contract_image,
            document_image,
            rut_image,
            bank_certification,
            image_url
        } = result.recordset[0];

        const fileBlobs = [
            contract_image,
            document_image,
            rut_image,
            bank_certification,
            image_url
        ]

        console.log(fileBlobs)

        fileBlobs.map(blobName => {
            blobService.deleteBlobIfExists(containerName, blobName, err => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log('Archivo borrado correctamente');
            });
        })
        
        await pool.request()
            .input("id", sql.Int, id)
            .query(deleteZoneLeaderById);
        
        res.json(`Deleted zone leader with ID : ${id}`);
    } catch (error) {
        res.status(500).send(error.message);
    }
}