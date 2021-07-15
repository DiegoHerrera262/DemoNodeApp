const app = require('./app');
const config = require('./config');

// Conexión a la base de datos 
const db = require('./data/database');

// Importa modelo de Clientes
require('./models/Grocers');

db.sync()
    .then(() => console.log('conectado al servidor'))
    .catch(error => console.log(error));

const server = async () => {
    await app.listen(config.port, () => {
        console.log('server dashboard on port:' + config.port)
    });
};

server();
