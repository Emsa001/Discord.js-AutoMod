const fs = require('fs');

// Database
const db = require('../database/database');
const Applications = require('../database/models/applications');

module.exports = {
    name: 'ready',
    async execute(client) {
        const eventFiles = fs.readdirSync('./messages').filter((file) => file.endsWith('.js'));

        for (const file of eventFiles) {
            const event = require(`../messages/${file}`);
            event.execute(client);
        }

        await db
            .authenticate()
            .then(() => {
                console.log('Logged in to DB!');
                Applications.init(db);
                Applications.sync();
            })
            .catch((err) => console.log(err));
    },
};
