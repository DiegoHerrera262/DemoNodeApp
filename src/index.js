const app = require('./app');
const config = require('./config');

const server = async () => {
    await app.listen(config.port, () => {
        console.log('server dashboard on port:' + config.port)
    });
};

server();
