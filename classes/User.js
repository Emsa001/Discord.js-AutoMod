const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

class User {
    constructor(user_id, guild_id) {
        this.user_id = user_id;
        this.guild_id = guild_id;
    }

    async register() {
        const data = {
            username: 'Emsa001',
            uuid: '0b6aff56-6cee-469a-a64b-0441fd2cb6ae',
            name: 'Emanuel Scura',
            email: 'emikscura123@gmail.com',
            password: 'Scura123',
        };

        axios
            .post('http://152.70.61.227:3000/api/register', data)
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    async findAccount() {
        return 'test';
    }
}

module.exports = { User };
