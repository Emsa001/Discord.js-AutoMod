const {
    ActionRowBuilder,
    ButtonStyle,
    ButtonBuilder,
    EmbedBuilder,
    PermissionsBitField,
    ChannelType,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
} = require('discord.js');

const Applications = require('../database/models/applications');

const embedConfig = require('../components/embed');
const config = require('../config.json');

const moment = require('moment');

const wait = require('node:timers/promises').setTimeout;

class Application {
    constructor(interaction) {
        this.interaction = interaction;
        this.application = interaction.customId.split('_')[1];

        this.email = interaction?.message?.embeds[0]?.data?.fields?.find(
            (element) => element.name === 'Email'
        );
        this.age = interaction?.message?.embeds[0]?.data?.fields?.find(
            (element) => element.name === 'Age'
        );
        this.whyyou = interaction?.message?.embeds[0]?.data?.fields?.find(
            (element) => element.name === 'Why you'
        );
        this.portfolio = interaction?.message?.embeds[0]?.data?.fields?.find(
            (element) => element.name === 'Portfolio'
        );
    }

    async startApplication() {
        const user = this.interaction.user;
        const age = this.interaction.fields.fields.get('age').value || 'none';
        const email = this.interaction.fields.fields.get('email').value || 'none';
        const whyyou = this.interaction.fields.fields.get('whyyou').value || 'none';
        const portfolio = this.interaction.fields.fields.get('portfolio').value || 'none';
        const applicationId = this.interaction.customId.split('_')[1] || 'error';

        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${user.tag}'s application on ${applicationId}`,
                iconURL: config.icons.minereality,
                url: config.url,
            })
            .addFields(
                { name: 'User', value: `${user}`, inline: true },
                { name: 'Email', value: email, inline: true },
                { name: 'Age', value: age, inline: true },
                { name: 'Why you', value: whyyou },
                { name: 'Portfolio', value: portfolio }
            )
            .setFooter(embedConfig.footer);

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('application_accept')
                .setLabel('Accept')
                .setStyle(ButtonStyle.Success)
                .setEmoji('✅')
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId('application_decline')
                .setLabel('Decline')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('🛑')
                .setDisabled(false)
        );

        const applicationSent = new EmbedBuilder()
            .setAuthor({
                name: `Otrzymaliśmy twoją rekrutację!`,
                iconURL: config.icons.minereality,
                url: config.url,
            })
            .setDescription(
                `Your application **${applicationId}** has been sent to our team!\In **3** days you will get a message from our team.\n**Good luck 🥳**\n\nYour application:`
            )
            .addFields(
                { name: 'Age', value: age, inline: true },
                { name: 'Email', value: email, inline: true },
                { name: 'Why uoi', value: whyyou },
                { name: 'Portfolio', value: portfolio }
            )
            .setFooter(embedConfig.footer);

        await Applications.create({
            userId: `${this.interaction.user.id}`,
            application: applicationId,
            status: 'open',
        });

        await this.interaction.deferUpdate();
        await this.interaction.user.send({ embeds: [applicationSent] });
        return this.interaction.client.channels.cache
            .get(config.applicationReviewChannel)
            .send({ embeds: [embed], components: [row] });
    }

    async create(application, applicationId) {
        const checkUserApplications = await Applications.findOne({
            where: {
                userId: `${this.interaction.user.id}`,
                application: application,
            },
            order: [['createdAt', 'DESC']],
        });

        if (checkUserApplications) {
            if (checkUserApplications.status === 'open') {
                await this.interaction.reply({
                    content: `You have already creaded this application`,
                    ephemeral: true,
                });
                await wait(5000);
                return await this.interaction.deleteReply();
            } else {
                const ApplicationCreatedAt = moment(checkUserApplications.createdAt);

                const now = moment();

                if (now.diff(ApplicationCreatedAt, 'days') <= 3) {
                    await this.interaction.reply({
                        content: 'You can create one application in 3 days',
                        ephemeral: true,
                    });
                    await wait(5000);
                    return await this.interaction.deleteReply();
                }
            }
        }

        const component = this.interaction.message.components[0].components.find(
            (component) => component.data.custom_id === this.interaction.customId
        );

        var modal = new ModalBuilder()
            .setCustomId(`application_${application}`)
            .setTitle(`${component.data.label}`);

        var age = new TextInputBuilder()
            .setCustomId('age')
            .setLabel('Your age:')
            .setMinLength(1)
            .setMaxLength(2)
            .setStyle(TextInputStyle.Short);

        var email = new TextInputBuilder()
            .setCustomId('email')
            .setLabel('Your email')
            .setMinLength(3)
            .setMaxLength(100)
            .setStyle(TextInputStyle.Short);

        var whyyou = new TextInputBuilder()
            .setCustomId('whyyou')
            .setLabel('Why you?')
            .setMinLength(100)
            .setStyle(TextInputStyle.Paragraph);

        var portfolio = new TextInputBuilder()
            .setCustomId('portfolio')
            .setLabel('Your portfolio')
            .setRequired(false)
            .setStyle(TextInputStyle.Short);

        var ageRow = new ActionRowBuilder().addComponents(age);
        var emailRow = new ActionRowBuilder().addComponents(email);
        var whyyouRow = new ActionRowBuilder().addComponents(whyyou);
        var portfolioRow = new ActionRowBuilder().addComponents(portfolio);

        modal.addComponents(ageRow, emailRow, whyyouRow, portfolioRow);

        return await this.interaction.showModal(modal);
    }

    async accept(applicationUser, applicationId) {
        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${applicationUser.tag}'s ${applicationId} application`,
                iconURL: config.icons.minereality,
                url: config.url,
            })
            .setColor('#22bb33')
            .addFields(
                {
                    name: 'User',
                    value: `${applicationUser}`,
                    inline: true,
                },
                { name: 'Email', value: this.email.value || 'none', inline: true },
                { name: 'Age', value: this.age.value || 'none', inline: true },
                { name: 'Why you', value: this.whyyou.value || 'none' },
                { name: 'Portfolio', value: this.portfolio.value || 'none' }
            )
            .setFooter({
                text: `Application accepted by ${this.interaction.user.tag}`,
            })
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('application_accepted')
                .setLabel('Accepted')
                .setStyle(ButtonStyle.Success)
                .setEmoji('✅')
                .setDisabled(true),
            new ButtonBuilder()
                .setLabel('See application chat')
                .setURL(`${invite}`)
                .setStyle(ButtonStyle.Link)
                .setDisabled(false)
        );

        const userMessage = new EmbedBuilder()
            .setAuthor({
                name: `${applicationUser.tag}'s ${applicationId} application`,
                iconURL: config.icons.minereality,
                url: config.url,
            })
            .setColor('#22bb33')
            .setDescription(
                `Congratulations! 🥳\n\nYour application has been positively accepted!\nWe'd like to invite you to the second and final stage of recruitment!\n\nWe have created a private chat especially for you with people who will recruit you.\n\nI hope they won't scare you 🫣`
            )
            .addFields(
                {
                    name: 'user',
                    value: `${applicationUser}`,
                    inline: true,
                },
                { name: 'Email', value: this.email.value || 'none', inline: true },
                { name: 'Age', value: this.age.value || 'none', inline: true },
                { name: 'Why you', value: this.whyyou.value || 'none' },
                { name: 'Portfolio', value: this.portfolio.value || 'none' }
            )
            .setTimestamp();

        await this.interaction.guild.channels
            .create({
                name: `application-${applicationUser.username}`,
                type: ChannelType.GuildText,
                parent: config.channels.applicationsParentId,
                permissionOverwrites: [
                    {
                        id: this.interaction.guild.id,
                        deny: [
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.ReadMessageHistory,
                        ],
                    },
                    {
                        id: applicationUser.id,
                        allow: [
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.ReadMessageHistory,
                            PermissionsBitField.Flags.AttachFiles,
                        ],
                    },
                    {
                        id: this.interaction.user.id,
                        allow: [
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.ReadMessageHistory,
                            PermissionsBitField.Flags.AttachFiles,
                        ],
                    },
                ],
            })
            .then(async (channel) => {
                const channelEmbed = new EmbedBuilder()
                    .setAuthor({
                        name: `${applicationUser.tag}'s ${applicationId} application`,
                        iconURL: config.icons.minereality,
                        url: config.url,
                    })
                    .setColor('#bb2124')
                    .addFields(
                        {
                            name: 'User',
                            value: `${applicationUser}`,
                            inline: true,
                        },
                        {
                            name: 'Email',
                            value: this.email.value || 'none',
                            inline: true,
                        },
                        {
                            name: 'Age',
                            value: this.age.value || 'none',
                            inline: true,
                        },
                        { name: 'Why you', value: this.whyyou.value || 'none' },
                        { name: 'Portfolio', value: this.portfolio.value || 'none' }
                    )
                    .setTimestamp();

                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('application_close')
                        .setLabel('Close application')
                        .setStyle(ButtonStyle.Secondary)
                );

                channel.send({ embeds: [channelEmbed], components: [row] });

                const invite = await channel.createInvite().catch(console.error);

                const userMessageRows = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel('See application chat')
                        .setURL(`${invite}`)
                        .setStyle(ButtonStyle.Link)
                        .setDisabled(false)
                );

                await applicationUser.send({
                    embeds: [userMessage],
                    components: [userMessageRows],
                });
            });

        return await this.interaction.update({ embeds: [embed], components: [row] });
    }

    async decline(applicationUser, applicationId) {
        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${applicationUser.tag}'s ${applicationId} application`,
                iconURL: config.icons.minereality,
                url: config.url,
            })
            .setColor('#bb2124')
            .addFields(
                {
                    name: 'User',
                    value: `${applicationUser}`,
                    inline: true,
                },
                { name: 'Email', value: this.email.value || 'none', inline: true },
                { name: 'Age', value: this.age.value || 'none', inline: true },
                { name: 'Why you', value: this.whyyou.value || 'none' },
                { name: 'Portfolio', value: this.portfolio.value || 'none' }
            )
            .setFooter({
                text: `Application declined by ${this.interaction.user.tag}`,
            })
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('application_declined')
                .setLabel('Declined')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('🛑')
                .setDisabled(true)
        );

        const userMessage = new EmbedBuilder()
            .setAuthor({
                name: `${applicationUser.tag}'s ${applicationId} application`,
                iconURL: config.icons.minereality,
                url: config.url,
            })
            .setDescription(
                `Unfortunately, your application for the position of **${applicationId}** has been rejected.\n\If you want to know more, please contact the administration of the recruitment department.\n\n`
            )
            .setColor('#bb2124')
            .addFields(
                {
                    name: 'User',
                    value: `${applicationUser}`,
                    inline: true,
                },
                { name: 'Email', value: this.email.value || 'none', inline: true },
                { name: 'Age', value: this.age.value || 'none', inline: true },
                { name: 'Why you', value: this.whyyou.value || 'none' },
                { name: 'Portfolio', value: this.portfolio.value || 'none' }
            )
            .setTimestamp();

        await this.interaction.update({ embeds: [embed], components: [row] });
        await applicationUser.send({
            embeds: [userMessage],
        });
        return new Application(this.interaction).updateStatus(
            `${applicationUser.id}`,
            applicationId,
            'closed'
        );
    }

    async close(applicationUser, applicationId) {
        try {
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('application_close')
                    .setLabel('Close application')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true)
            );

            await this.interaction.update({ components: [row] });

            await this.interaction.message.channel.send({
                content: 'The chat will be archived in 10 seconds',
            });

            await wait(10000);

            await this.interaction.message.channel.permissionOverwrites.edit(applicationUser?.id, {
                deny: [
                    PermissionsBitField.Flags.ViewChannel,
                    PermissionsBitField.Flags.SendMessages,
                    PermissionsBitField.Flags.ReadMessageHistory,
                ],
            });

            await this.interaction.message.channel.setParent(config.channels.applicationArchives);
        } catch (err) {
            console.error(err);
        }
        return new Application(this.interaction).updateStatus(
            `${applicationUser.id}`,
            `${applicationId}`,
            'closed'
        );
    }

    async updateStatus(userId, applicationId, status) {
        await Applications.update(
            {
                status: status,
            },
            {
                where: {
                    userId: userId,
                    application: applicationId,
                },
            }
        );
    }
}

module.exports = { Application };
