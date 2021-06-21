const dataBase = require('../data/database');
const sql = require('mssql');
const { 
    getAllZoneLeaders,
    getZoneLeaderById,
    deleteZoneLeaderById,
    updateZoneLeaderById,
    zoneLeaderValidationQuery, 
    createNewZoneLeader
} = require('../data/sellers.queries');

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
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.zoneLeadersCreate = async (req, res) => {
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

    const today = new Date();

    try {
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
            .input("status", sql.Bit, 1)
            .input("address", sql.VarChar, address)
            .input("image_url", sql.VarChar, profileImage)
            .input("seller_code", sql.VarChar, leader_code.toString())
            .input("seller_type", sql.Char, "3")
            .input("contract_expires", sql.Date, endContractDate)
            .input("contract_image", sql.VarChar, contractDocument)
            .input("document_image", sql.VarChar, documentPhoto)
            .input("rut_image", sql.VarChar, rutDocument)
            .input("email", sql.VarChar, email)
            .input("zone_id", sql.Int, zone_id.toString())
            .input("bank_certification", sql.VarChar, bankCertification)
            .input("created_at", sql.Date, today)
            .input("updated_at", sql.Date, today)
            .query(createNewZoneLeader);

        res.json(req.body);
    } catch (error) {
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
        await pool.request()
            .input("id", sql.Int, id)
            .query(deleteZoneLeaderById);
        res.json(`Deleted zone leader with ID : ${id}`);
    } catch (error) {
        res.status(500).send(error.message);
    }
}