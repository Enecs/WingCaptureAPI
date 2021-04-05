'use strict';
const Command = require("@bot/base/Command.js");
const stringTools = (new (require('string-toolkit')))
const { inspect } = require('util');

class Eval extends Command {
  constructor (client) {
    super(client, {
      name: "eval",
      description: "Evaluates arbitrary Javascript.",
      category:"System",
      usage: "<expression>",
      aliases: ["evaluate"],
      botOwner: true,
      cooldown: 0,
    });
  }

  async run (ctx) {
    const dscformat = (lang, value) => (`\`\`\`${lang}\n${value}\n\`\`\``).replace(new RegExp(ctx.client.token, 'g'), '*'.repeat(ctx.client.token.length))
    
    let code = ctx.args.filter(t => !ctx.flags.includes(t.replace(/--/g, ""))).join(" ").replace("```js", "").replace("```", "")
    if (!code) return ctx.message.channel.send('Please, write something so I can evaluate!')
    try {
      let evaled = eval(code) //ctx.flags.includes("async") ? eval(`(async () => {${code}})()`) : eval(code);
      let isPromise = false;
      // let depth = ctx.args[0] || 0;
      if (evaled && evaled instanceof Promise) {
        isPromise = true;
        evaled = await evaled;
      }
      if (typeof evaled !== "string") evaled = inspect(evaled, { depth: 0 });
      let evalEmbeds = stringTools.toChunks(evaled, 1000).map(thing => new ctx.discord.MessageEmbed()
          .setColor('8fff8d')
          .addField('Result', dscformat('js', thing))
          .addField('Type', dscformat('css', `${typeof evaled}${isPromise ? ' (Originally Promise)' : ''}`)));
      // if (ctx.flags.includes("noreply")) return;
      ctx.pagify(evalEmbeds, { xReact: true });
    } catch (err) {
      const embed = new ctx.discord.MessageEmbed()
        .addField('Error', dscformat('js', err))
        .setColor('#ff5d5d')
      ctx.message.channel.send(embed);
    }
  }
}

module.exports = Eval;
