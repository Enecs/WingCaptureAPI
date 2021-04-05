const Command = require("@bot/base/Command.js");

class Reboot extends Command {
  constructor (client) {
    super(client, {
      name: "reboot",
      description: "If running under PM2, bot will restart.",
      category: "System",
      usage: "",
      botOwner: true,
      aliases: [],
      cooldown: 0,
    });
  }

  async run (ctx) { // eslint-disable-line no-unused-vars
    if(ctx.args.length >= 1 && ctx.args[0].toLowerCase() == 'git') {
      await require('child_process').execSync('git reset --hard HEAD');
      ctx.args = ['git', 'pull']
      await ctx.client.commands.get('execute').run(ctx)
    }
    try {
      const em = new ctx.MessageEmbed().setColor('RED').setDescription("Bot is rebooting...");
      await ctx.channel.send(em).then(async (m) => {
        await ctx.database.reboot.update({ rebooted: true, channelid: m.channel.id, messageid: m.id, ranuser: ctx.author.tag });
      });
      process.exit(1);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Reboot;
