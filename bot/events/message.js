const Event = require('@bot/base/Event.js');
const colors = require('colors');
const { MessageEmbed } = require('discord.js');
const CommandContext = require('@bot/base/CommandContext');

module.exports = class extends Event {
  constructor (client) {
    super(client, {
      name: 'message',
      enabled: true,
    });
  }

  async run (client, message, isEdited = false) {
    const { author, channel, content, guild } = message;

    if (message.author.id == client.user.id) return;

    if (author.bot) return;
    if (guild && !channel.permissionsFor(message.guild.me).missing("SEND_MESSAGES")) return;

    const prefix = process.env.PREFIX;
    const fixedPrefix = escapeRegExp(prefix);
    const fixedUsername = escapeRegExp(client.user.username);

    const PrefixRegex = new RegExp(`^(<@!?${client.user.id}>|${fixedPrefix}|${fixedUsername})`, 'i', '(\s+)?');

    let usedPrefix = content.match(PrefixRegex);
    usedPrefix = usedPrefix && usedPrefix.length && usedPrefix[0];

    // Mention related tasks
    const MentionRegex = new RegExp(`^(<@!?${client.user.id}>)`);
    const mentioned = MentionRegex.test(content);
    const helpPrefix = `Sup, you can type \`${process.env.PREFIX}help\` for a list of comamnds!`;

    if(!usedPrefix) return; // Exit if its not using a prefix
    const args = message.content.slice(usedPrefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // If the member on a guild is invisible or not cached, fetch them.
    if (message.guild && !message.member) await message.guild.members.fetch(message.author);

    // Check whether the command, or alias, exist in the collections defined
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
    if (!cmd && mentioned) return message.channel.send(helpPrefix);
    if (!cmd) return;

    // && cmd.conf.guildOnly
    if (cmd && !message.guild) return message.channel.send("This command is unavailable via private message. Please run this command in a guild.").then(m => setTimeout(() => m.delete(), 5000));

    // Bot Permission Lock
    if (cmd.conf.botOwner == true && !process.env.SUPERADMINS.split(" ").includes(message.author.id)) {
      const e = new MessageEmbed()
        .setTitle("Unauthorized")
        .setColor("RED")
        .setDescription(`You have to be ${process.env.SUPERADMINS.split(" ").length == 1 ? "the" : "a"} **Bot Owner** to use this command.`);
      message.channel.send(e);
      client.logger.log(`${message.author.username} (${message.author.id}) ran unauthorized command ${cmd.help.name} ${args.join(" ")}`, "unauthorized");
      return;
    }

    // message.flags = [];
    // while (args[0] &&args[0][0] === "-") {
    //   message.flags.push(args.shift().slice(1));
    // }

    // If the command exists, **AND** the user has permission, run it.
    //this.client.logger.log(`${this.client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name} ${args.join(' ')}`, "cmd");

    try {
      const params = { args, message, prefix: prefix, query: args.join(' ') };
      cmd.run(new CommandContext(params));
    } catch (error) {
      console.log(error);
      message.channel.send('There was an error executing that command.').catch(() => {});
    }
  }
};

function escapeRegExp(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}