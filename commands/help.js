const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { footer } = require('../components/embed.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Help command')
        .setDMPermission(false),
    async execute(interaction) {
        const returnMessage = new EmbedBuilder()
            .setColor(0x0099ff)
            .setDescription(`Hi! I am MineReality official bot`)
            .setTimestamp()
            .setFooter(footer);

        return await interaction.reply({ embeds: [returnMessage], ephemeral: true });
    },
};
