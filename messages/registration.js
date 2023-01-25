const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: 'registration',
    async execute(client) {
        const register_channel = client.channels.cache.find(
            (channel) => channel.id === config.registerChannel
        );

        function sendTicketMSG() {
            const embed = new EmbedBuilder()
                .setColor('#A020F0')
                .setAuthor({
                    name: 'Registration',
                    iconURL: config.icons.minereality,
                    url: config.url,
                })
                .setDescription(`Registration isn't open yet`);

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('register')
                    .setLabel('Register')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true)
            );

            register_channel.send({
                embeds: [embed],
                components: [row],
            });
        }

        const toDelete = 10000;

        async function fetchMore(channel, limit) {
            if (!channel) {
                throw new Error(`Channel created ${typeof channel}.`);
            }
            if (limit <= 100) {
                return channel.messages.fetch({
                    limit,
                });
            }

            let collection = [];
            let lastId = null;
            let options = {};
            let remaining = limit;

            while (remaining > 0) {
                options.limit = remaining > 100 ? 100 : remaining;
                remaining = remaining > 100 ? remaining - 100 : 0;

                if (lastId) {
                    options.before = lastId;
                }

                let messages = await channel.messages.fetch(options);

                if (!messages.last()) {
                    break;
                }

                collection = collection.concat(messages);
                lastId = messages.last().id;
            }
            collection.remaining = remaining;

            return collection;
        }

        const list = await fetchMore(register_channel, toDelete);

        let i = 1;

        list.forEach((underList) => {
            underList.forEach((msg) => {
                i++;
                if (i < toDelete) {
                    setTimeout(function () {
                        msg.delete();
                    }, 1000 * i);
                }
            });
        });

        setTimeout(() => {
            sendTicketMSG();
        }, i);
    },
};
