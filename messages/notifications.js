const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: 'notifications',
    async execute(client) {
        const channel = client.channels.cache.find(
            (channel) => channel.id === config.notificationsChannel
        );

        function sendMessage() {
            const embed = new EmbedBuilder()
                .setColor('#A020F0')
                .setAuthor({
                    name: 'Notifications - stay updated!',
                    iconURL: config.icons.minereality,
                    url: config.url,
                })
                .setDescription(
                    `Use the buttons below to select what notifications you want to recieve.`
                );

            const roles = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`role_${config.roles.news}`)
                    .setLabel('News')
                    .setEmoji('1035577657959645184')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId(`role_${config.roles.updates}`)
                    .setLabel('Updates')
                    .setEmoji('1035577664838311977')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`role_${config.roles.leaks}`)
                    .setLabel('Leaks')
                    .setEmoji('1035577656479060038')
                    .setStyle(ButtonStyle.Danger)
            );

            channel.send({
                embeds: [embed],
                components: [roles],
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

        const list = await fetchMore(channel, toDelete);

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
            sendMessage();
        }, i);
    },
};
