const databaseColumnArray = [
    "name",
    "last_name",
    "cellphone",
    "document_type",
    "document",
    "status",
    "address",
    "image_url",
    "email",
    "zone_id",
    "seller_code",
    "seller_type",
    "contract_expires",
    "contract_image",
    "document_image",
    "rut_image",
    "bank_certification",
    "created_at",
    "updated_at"
];

// build creation query
let createQuery = `INSERT INTO sellers (${databaseColumnArray[0]}`;
for (let i = 1; i < databaseColumnArray.length; i++) {
    createQuery = createQuery + `, ${databaseColumnArray[i]}`;
}
createQuery = createQuery + `) VALUES (@${databaseColumnArray[0]}`;
for (let i = 1; i < databaseColumnArray.length; i++) {
    createQuery = createQuery + `, @${databaseColumnArray[i]}`;
}
createQuery = createQuery + "); " + 'UPDATE sellers SET leader_id = id WHERE seller_type = 3 AND document = @document;';

const databaseUpdateColumnArray = [
    "name",
    "last_name",
    "cellphone",
    "document_type",
    "document",
    "status",
    "address",
    "image_url",
    "email",
    "zone_id",
    "seller_code",
    "seller_type",
    "contract_expires",
    "contract_image",
    "document_image",
    "rut_image",
    "bank_certification",
    "updated_at"
];
// build update query
let updateQuery = `UPDATE sellers SET ${databaseUpdateColumnArray[0]} = @${databaseUpdateColumnArray[0]}`;
for (let i = 1; i < databaseUpdateColumnArray.length; i++) {
    updateQuery = updateQuery + `, ${databaseUpdateColumnArray[i]} = @${databaseUpdateColumnArray[i]}`;
}
updateQuery = updateQuery + " WHERE id = @id";

// export validation queries
exports.zoneLeaderValidationQuery = "SELECT document, id FROM sellers WHERE (document = @document OR cellphone = @cellphone OR seller_code = @seller_code)" 
exports.getAllZoneLeaders = "SELECT * FROM sellers WHERE seller_type = 3";
exports.getZoneLeaderById = "SELECT * FROM sellers WHERE seller_type = 3 AND id = @id";
exports.deleteZoneLeaderById = "DELETE FROM sellers WHERE seller_type = 3 AND id = @id";
exports.updateZoneLeaderById = updateQuery;
exports.createNewZoneLeader = createQuery;
