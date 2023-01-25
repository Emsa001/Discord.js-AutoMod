const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { Broadcast } = require('../classes/Broadcast');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bc')
        .setDescription('Create broadcast')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        return await new Broadcast(interaction).create();
    },
};
