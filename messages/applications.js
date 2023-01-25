const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: 'ticket',
    async execute(client) {
        const channel = client.channels.cache.find(
            (channel) => channel.id === config.applicationChannel
        );

        function sendMessage() {
            const embed = new EmbedBuilder()
                .setColor('#A020F0')
                .setAuthor({
                    name: 'Rekrutacja',
                    iconURL: config.icons.minereality,
                    url: config.url,
                })
                .setDescription(
                    `We are looking for people willing to join our administration team.\nIf you want to help us develop this project, we invite you to try your hand at **MineReality** administration!\n\nRequirements:\n ▸ Age: 16+\n▸ Working microphone\n▸ Teamwork skills\n▸ Not panicking during zombie attacks\n\nChoose one of the available recruitment options`
                );

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('application_media-team')
                    .setLabel('Media team')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('1038219369248989224')
                    .setDisabled(false),
                new ButtonBuilder()
                    .setCustomId('application_builder-minecraft')
                    .setLabel('Minecraft Builder')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('1035577659209547786')
                    .setDisabled(false),
                new ButtonBuilder()
                    .setCustomId('application_technic-minecraft')
                    .setLabel('Minecraft Staff')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('1066880664202379355')
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId('application_technic-discord')
                    .setLabel('Discord Staff')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('1067132142468988949')
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId('application_tester')
                    .setLabel('Tester')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('1067228067480748033')
                    .setDisabled(false)
            );

            channel.send({
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
