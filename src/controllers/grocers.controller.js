const dataBase = require('../data/database');
const sql = require('mssql');
const { 
    getAllGrocers,
    getGrocerById,
    deleteGrocerById,
    updateGrocerById,
    grocerValidationQuery, 
    createGrocer
} = require('../data/grocers.queries');

exports.grocersGet = async (req, res) => {
    console.log('Getting all grocers.');
    try {
        const pool = await dataBase();
        const result =  await pool.request().query(getAllGrocers);
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.grocerGetById = async (req, res) => {
    const {id} = req.params; 
    console.log('Search grocer by id: ', id);
    try {
        const pool = await dataBase();
        const result =  await pool.request()
            .input("id", sql.Int, id)
            .query(getGrocerById);
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.grocerCreate = async (req, res) => {
    const {name, 
        grocer_name,
        owner_name,
        user_id,
        document_type,
        document_id,
        phone,
        email,
        cellphone,
        address,
        address_aditional_info,
        neighborhood,
        latitude,
        longitude,
        visit_day,
        delivery_day,
        bank_account,
        locality,
        business_type,
        social_network_url
    } = req.body;

    const today = new Date.now();


    try {
        const pool = await dataBase();

        // validate if user is already registered
        const prevRegisters = await pool.request()
            .input("document_id", sql.VarChar, document_id.toString())
            .input("cellphone", sql.VarChar, cellphone.toString())
            .input("grocer_name", sql.VarChar, grocer_name.toString())
            .query(grocerValidationQuery);

        if (prevRegisters.recordset.length > 0) {
            return res.status(406).send("Ya hay una tienda registrada.");
        }

        await pool.request()
            .input("grocer_name", sql.VarChar, name.toString())
            .input("owner_name", sql.VarChar, owner_name.toString())
            .input("uder_id", sql.VarChar, user_id.toString())
            .input("document_type", sql.Char, document_type.toString())
            .input("document_id", sql.VarChar, document_id.toString())
            .input("phone", sql.VarChar, phone.toString())
            .input("email", sql.VarChar, email.toString())
            .input("cellphone", sql.VarChar, cellphone.toString())
            .input("address", sql.VarChar, address)
            .input("address_aditional_info", sql.VarChar, address_aditional_info.toString())
            .input("neighborhood", sql.VarChar, neighborhood.toString())
            .input("latitude", sql.Decimal, latitude)
            .input("longitude", sql.Decimal, longitude)
            .input("visit_day", sql.VarChar, visit_day)
            .input("delivery_day", sql.VarChar, delivery_day)
            .input("bank_account", sql.VarChar, bank_account)
            .input("locality", sql.VarChar, locality)
            .input("business_type", sql.VarChar, business_type.toString())
            .input("social_network_url", sql.VarChar, social_network_url.toString())
            .input("created_at", sql.DateTime, today)
            .input("updated_at", sql.DateTime, today)
            .query(createGrocer);

        res.json(req.body);
    } catch (error) {
        res.status(500).send(error.message)
    } 
};

exports.grocerEditById = async (req, res) => {
    const {id} = req.params;
    console.log('Editing zone leader with id: ', id);
    try {
        const pool = await dataBase();
        
        const {grocer_name,
            owner_name,
            user_id,
            document_type,
            document_id,
            phone,
            email,
            cellphone,
            address,
            address_aditional_info,
            neighborhood,
            latitude,
            longitude,
            visit_day,
            delivery_day,
            bank_account,
            locality,
            business_type,
            social_network_url
        } = req.body;

        // validate if user is already registered
        const prevRegisters = await pool.request()
            .input("document_id", sql.VarChar, document_id.toString())
            .input("cellphone", sql.VarChar, cellphone.toString())
            .input("grocer_name", sql.VarChar, grocer_name.toString())
            .query(grocerValidationQuery);

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

        const today =  new Date.now();

        await pool.request()
            .input("grocer_name", sql.VarChar, name.toString())
            .input("owner_name", sql.VarChar, owner_name.toString())
            .input("uder_id", sql.VarChar, user_id.toString())
            .input("document_type", sql.Char, document_type.toString())
            .input("document_id", sql.VarChar, document_id.toString())
            .input("phone", sql.VarChar, phone.toString())
            .input("email", sql.VarChar, email.toString())
            .input("cellphone", sql.VarChar, cellphone.toString())
            .input("address", sql.VarChar, address)
            .input("address_aditional_info", sql.VarChar, address_aditional_info.toString())
            .input("neighborhood", sql.VarChar, neighborhood.toString())
            .input("latitude", sql.Decimal, latitude)
            .input("longitude", sql.Decimal, longitude)
            .input("visit_day", sql.VarChar, visit_day)
            .input("delivery_day", sql.VarChar, delivery_day)
            .input("bank_account", sql.VarChar, bank_account)
            .input("locality", sql.VarChar, locality)
            .input("business_type", sql.VarChar, business_type.toString())
            .input("social_network_url", sql.VarChar, social_network_url.toString())
            .input("updated_at", sql.DateTime, today)
            .query(updateGrocerById);

        res.json(req.body);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.grocerDelete = async (req, res) => {
    const {id} = req.params; 
    console.log('Deleting grocer with id: ', id);
    try {
        const pool = await dataBase();
        await pool.request()
            .input("id", sql.Int, id)
            .query(deleteGrocerById);
        res.json(`Deleted grocer with ID : ${id}`);
    } catch (error) {
        res.status(500).send(error.message);
    }
}