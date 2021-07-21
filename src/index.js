const app = require('./app');
const config = require('./config');

// Conection with DataBAse
const db = require('./data/database');

// Models imports
require('./models/Grocers');
require('./models/Suppliers');

db.sync()
    .then(() => console.log('conectado al servidor'))
    .catch(error => console.log(error));

const server = async () => {
    await app.listen(config.port, () => {
    console.log('server dashboard on port:' + config.port)
    })
}
server()
