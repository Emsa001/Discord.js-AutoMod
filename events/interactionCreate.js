const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

const config = require('../config.json');
const wait = require('node:timers/promises').setTimeout;

const { User } = require('../classes/User');
const { Broadcast } = require('../classes/Broadcast');
const { Application } = require('../classes/Application');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        try {
            if (interaction.isButton()) {
                switch (true) {
                    case interaction.customId == 'register':
                        // Create the modal
                        var modal = new ModalBuilder()
                            .setCustomId('register')
                            .setTitle('Registration');

                        // Add components to modal

                        // Create the text input components
                        var username = new TextInputBuilder()
                            .setCustomId('username')
                            .setLabel('Username')
                            .setMinLength(3)
                            .setMaxLength(48)
                            .setStyle(TextInputStyle.Short);

                        var email = new TextInputBuilder()
                            .setCustomId('email')
                            .setLabel('Email')
                            .setMinLength(3)
                            .setMaxLength(100)
                            .setStyle(TextInputStyle.Short);

                        // An action row only holds one text input,
                        // so you need one action row per text input.
                        var usernameRow = new ActionRowBuilder().addComponents(username);
                        var emailRow = new ActionRowBuilder().addComponents(email);

                        // Add inputs to the modal
                        modal.addComponents(usernameRow, emailRow);

                        // Show the modal to the user
                        await interaction.showModal(modal);
                        break;
                    case interaction.customId.includes('role'):
                        const roleId = interaction.customId.split('_')[1];
                        const role =
                            interaction?.guild?.roles?.cache?.find((r) => r.id === roleId) || false;

                        if (!role) return console.log(`Role ${roleId} does not exist`);

                        if (!interaction.member.roles.cache.has(roleId)) {
                            await interaction.member.roles.add(role);

                            if (
                                interaction.member.roles.cache.has(config.roles.news) &&
                                interaction.member.roles.cache.has(config.roles.updates) &&
                                interaction.member.roles.cache.has(config.roles.leaks)
                            ) {
                                await interaction.reply({
                                    content: 'Yay <a:beeeee:1035577628066857000> Thank you!',
                                    ephemeral: true,
                                });
                                await wait(5000);
                                return await interaction.deleteReply();
                            }
                        } else {
                            interaction.member.roles.remove(role);
                        }
                        interaction.deferUpdate();

                        break;
                    case interaction.customId.includes('application'):
                        var application = interaction.customId.split('_')[1];

                        var user = await interaction?.message?.embeds[0]?.data?.fields?.find(
                            (element) => element.name === 'User'
                        );
                        var applicationId =
                            application.split('_')[1] ||
                            interaction?.message?.embeds[0].author.name.split(' na ')[1] ||
                            'error';

                        var applicationUser = await interaction?.client?.users
                            ?.fetch(user?.value?.replace(/\D/g, ''), false)
                            .catch((e) => false);

                        if (application === 'accept') {
                            return new Application(interaction).accept(
                                applicationUser,
                                applicationId
                            );
                        } else if (application === 'decline') {
                            return new Application(interaction).decline(
                                applicationUser,
                                applicationId
                            );
                        } else if (application === 'close') {
                            return new Application(interaction).close(
                                applicationUser,
                                applicationId
                            );
                        }
                        return new Application(interaction).create(application, applicationId);

                        break;
                }
            } else if (interaction.isModalSubmit()) {
                switch (true) {
                    case interaction.customId === 'register':
                        return new User(interaction.user.id, interaction.guild.id).register();
                    case interaction.customId === 'broadcast':
                        return new Broadcast(interaction).chooseChannel();
                    case interaction.customId.includes('application'):
                        return new Application(interaction).startApplication();
                }
            } else if (interaction.isStringSelectMenu()) {
                switch (interaction.customId) {
                    case 'chooseChannel':
                        const title = interaction.message.embeds[0].data.title;
                        const description = interaction.message.embeds[0].data.description;
                        const image = interaction.message.embeds[0].data.image.url;
                        const color = interaction.message.embeds[0].data.color;
                        const channel = interaction.values[0];

                        if (channel == 'cancel') {
                            interaction.message.delete();
                            return interaction.reply({ content: 'canceled', ephemeral: true });
                        }

                        return new Broadcast(interaction).sendMessage(
                            title,
                            description,
                            image,
                            color,
                            channel
                        );
                }
            }
        } catch (err) {
            console.error(err);
        }
    },
};
