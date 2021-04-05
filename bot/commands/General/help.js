const Command = require("@bot/base/Command.js");

class HelpCMD extends Command {
  constructor (client) {
    super(client, {
      name: "help",
      description: "Displays all the commands.",
      category: "General",
      usage: "",
      aliases: ["h", "?"],
      cooldown: 1.5
    });
  }

  async run (ctx) {
    const embed = new ctx.MessageEmbed()
      .setColor('6879EE')

    if(ctx.query) {
      let command = ctx.query;
      let hasCommand = ctx.client.commands.has(command) || ctx.client.commands.has(ctx.client.aliases.get(command));
      if(!hasCommand) {
        embed
          .setTitle('Something went wrong!')
          .setColor('RED')
          .setDescription(`It seems **${ctx.query}** not a valid command name`);
        return ctx.channel.send(embed);
      } else {
        command = ctx.client.commands.get(command) || ctx.client.commands.get(client.aliases.get(command));
        embed
          .setTitle(`Help » ${command.help.name.toProperCase()}`)
          .setDescription(`\`\`\`asciidoc\nDescription:: ${command.help.description}\nUsage:: ${ctx.prefix}${command.help.name} ${command.help.usage}\nAliases:: ${command.conf.aliases.join(", ")}\nCategory:: ${command.help.category}\`\`\``)
        return ctx.channel.send(embed);
      }
    }

    embed
      .setAuthor(ctx.client.user.username, ctx.client.user.displayAvatarURL({dynamic: true, format: 'png'}))
      .setDescription(`You can do \`${ctx.prefix}help [command]\` for more info on a command\nYou can also join the [support server](${process.env.GUILD_INVITE}) for more information.`)
      .addField('➤ General', ctx.client.commands.filter(m => m.help.category == "General").map(m => `\`${m.help.name}\``).join(' '))
    if (process.env.SUPERADMINS.split(' ').includes(ctx.author.id)) embed.addField('➤ System', ctx.client.commands.filter(m => m.help.category == "System").map(m => `\`${m.help.name}\``).join(' '))
    ctx.channel.send(embed)
  }
}

module.exports = HelpCMD;