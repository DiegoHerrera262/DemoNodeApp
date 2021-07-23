// We define the columns for the grocer table
const databaseColumnArray = [
    "grocer_name",
    "owner_name",
    "user_id",
    "document_type",
    "document_id",
    "phone",
    "email",
    "cellphone",
    "address",
    "address_aditional_info",
    "neighborhood",
    "latitude",
    "longitude",
    "visit_day",
    "delivery_day",
    "bank_account",
    "locality",
    "business_type",
    "social_network_url",
    "created_at",
    "updated_at"
];

// Query for grocer creation
let createQuery = `INSERT INTO grocers (${databaseColumnArray[0]}`;
for (let i = 1; i < databaseColumnArray.length; i++) {
    createQuery = createQuery + `, ${databaseColumnArray[i]}`;
}
createQuery = createQuery + `) VALUES (@${databaseColumnArray[0]}`;
for (let i = 1; i < databaseColumnArray.length; i++) {
    createQuery = createQuery + `, @${databaseColumnArray[i]}`;
}
createQuery = createQuery + ")";

const databaseUpdateColumnArray = [
    "grocer_name",
    "owner_name",
    "user_id",
    "document_type",
    "document_id",
    "phone",
    "email",
    "cellphone",
    "address",
    "address_aditional_info",
    "neighborhood",
    "latitude",
    "longitude",
    "visit_day",
    "delivery_day",
    "bank_account",
    "locality",
    "business_type",
    "social_network_url",
    "updated_at"
];

// query for update grocer
let updateQuery = `UPDATE grocers SET ${databaseUpdateColumnArray[0]} = @${databaseUpdateColumnArray[0]}`;
for (let i = 1; i < databaseUpdateColumnArray.length; i++) {
    updateQuery = updateQuery + `, ${databaseUpdateColumnArray[i]} = @${databaseUpdateColumnArray[i]}`;
}
updateQuery = updateQuery + " WHERE id = @id";

// export validation queries
exports.grocerValidationQuery = "SELECT document_id, id FROM grocers WHERE (document_id = @document_id OR cellphone = @cellphone OR grocer_name = @grocer_name)" 
exports.getAllGrocers = "SELECT * FROM grocers";
exports.getGrocerById = "SELECT * FROM grocers WHERE id = @id";
exports.deleteGrocerById = "DELETE FROM grocers WHERE id = @id";
exports.updateGrocerById = updateQuery;
exports.createGrocer = createQuery;
