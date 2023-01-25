const {
    ActionRowBuilder,
    Events,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    StringSelectMenuBuilder,
    ButtonStyle,
    ButtonBuilder,
    EmbedBuilder,
} = require('discord.js');

const embedConfig = require('../components/embed');
const config = require('../config.json');

class Broadcast {
    constructor(interaction) {
        this.interaction = interaction;
    }

    async create() {
        const modal = new ModalBuilder()
            .setCustomId('broadcast')
            .setTitle('Create a new broadcast');

        const title = new TextInputBuilder()
            .setCustomId('title')
            .setLabel('Broadcast title')
            .setStyle(TextInputStyle.Short);

        const description = new TextInputBuilder()
            .setCustomId('description')
            .setLabel('Broadcast descriptions')
            .setStyle(TextInputStyle.Paragraph);

        const image = new TextInputBuilder()
            .setCustomId('image')
            .setLabel('Image url')
            .setRequired(false)
            .setStyle(TextInputStyle.Short);

        const color = new TextInputBuilder()
            .setCustomId('color')
            .setLabel('Color in hex')
            .setMinLength(3)
            .setMaxLength(7)
            .setRequired(false)
            .setStyle(TextInputStyle.Short);

        const firstActionRow = new ActionRowBuilder().addComponents(title);
        const secondActionRow = new ActionRowBuilder().addComponents(description);
        const thirdActionRow = new ActionRowBuilder().addComponents(image);
        const fourActionRow = new ActionRowBuilder().addComponents(color);

        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourActionRow);
        return await this.interaction.showModal(modal);
    }
    async chooseChannel() {
        const title = this.interaction.fields.getTextInputValue('title');
        const description = this.interaction.fields.getTextInputValue('description');
        const image =
            this?.interaction?.fields?.getTextInputValue('image') || 'http://localhost.png';
        const color = this?.interaction?.fields?.getTextInputValue('color') || '#0275d8';

        let selectmenu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('chooseChannel')
                .setPlaceholder('Nothing selected')
                .addOptions([
                    {
                        label: `Cancel`,
                        description: 'Cancel the embed',
                        value: 'cancel',
                    },
                ])
        );

        this.interaction.guild.channels.cache.first(24).forEach((channel) => {
            selectmenu.components[0].addOptions([
                {
                    label: `${channel.name}`,
                    description: `\u200B`,
                    value: `${channel.id}`,
                },
            ]);
        });

        const embed = new EmbedBuilder()
            .setColor(color)
            .setAuthor({
                name: 'Broadcast',
                iconURL: config.icons.minereality,
                url: config.url,
            })
            .setTitle(title)
            .setDescription(description)
            .setImage(image)
            .setFooter(embedConfig.footer);

        await this.interaction.reply({ embeds: [embed], components: [selectmenu] });
    }
    async sendMessage(title, description, image, color, channel) {
        const embed = new EmbedBuilder()
            .setColor(color)
            .setAuthor({
                name: 'Broadcast',
                iconURL: config.icons.minereality,
                url: config.url,
            })
            .setTitle(title)
            .setDescription(description)
            .setImage(image)
            .setFooter(embedConfig.footer);

        await this.interaction.reply({ content: 'Sent', ephemeral: true });
        return this.interaction.client.channels.cache.get(channel).send({ embeds: [embed] });
    }
}

module.exports = { Broadcast };
