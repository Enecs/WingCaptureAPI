'use strict';

const Discord = require('discord.js');
// const FlagParser = require('@structures/FlagParser');

/**
 * This class provides a object of options for the run method
 */

/* { totalLength, message, mentions, member, guild, author, channel, client, voiceChannel, level, prefix, database, query, args, discord, MessageEmbed, sendMessage } */
class CommandContext {
  /**
   * Available properties for this class
   * @param {*} options properties
   * @property `totalLength`
   * @property `message`
   * @property `member`
   * @property `guild`
   * @property `author`
   * @property `channel`
   * @property `client`
   * @property `voiceChannel`
   * @property `level`
   * @property `prefix`
   * @property `database`
   * @property `query`
   * @property `args`
   * @property `sendMessage`
   */
  constructor(options) {
    this.totalLength = options.totalLength;

    this.message = options.message;
    this.mentions = options.message.mentions;
    this.member = options.message.member;
    this.guild = options.message.guild;
    this.author = options.message.author;
    this.channel = options.message.channel;
    this.client = options.message.client;
    this.voiceChannel = this.member && this.member.voice && this.member.voice.channel;

    this.level = options.level;
    this.prefix = options.prefix;
    this.database = options.message.client.database;
    this.query = options.query;
    this.args = options.args;

    this.discord = Discord;

    this.sendMessage = (c) => options.message.channel.send(c);
    this.MessageEmbed = Discord.MessageEmbed;
    this.pagify = this.pagify;

    this.flags = new (require("string-toolkit"))().parseOptions(this.args).flags
    this.parser = new (require("string-toolkit"))().parseOptions(this.args)
  }

  async pagify(embeds, options) {
    let reactions = ["◀️", "⏹️", "▶️"];
    if(embeds.length == 1) reactions = ["⏹️"]
    
    if(options && typeof options !== 'object') throw Error(`options cannot be a ${typeof options} must be an object`)
    if(options && options.xReact == true) reactions.push("❌");

    let currentPage = (options && options.currentPage) || 0

    let pages = embeds.length;
    embeds[currentPage].setFooter(`Requested by ${this.message.author.username} • Page ${currentPage + 1} of ${pages}`);
    const queueEmbed = await this.message.channel.send(embeds[currentPage]);

    await Promise.all(reactions.map(r => queueEmbed.react(r)));
    const filter = (reaction, user) => reactions.includes(reaction.emoji.name) && this.message.author.id === user.id;
    const collector = queueEmbed.createReactionCollector(filter);

    collector.on("collect", async (reaction, user) => {
      try {
        switch (reaction.emoji.name) {
          case "▶️":
            currentPage++;
            if(currentPage == pages) currentPage = 0;
            if(this.guild.me.permissions.has('MANAGE_MESSAGES')) reaction.users.remove(user.id);
            queueEmbed.edit(embeds[currentPage].setFooter(`Requested by ${this.message.author.username} • Page ${currentPage + 1} of ${pages}`));
            break;
          case "⏹️":
            collector.stop();
            if(this.guild.me.permissions.has('MANAGE_MESSAGES')) {
              reaction.message.reactions.removeAll();
            } else {
              for(let r of queueEmbed.reactions.cache.filter(r => r.users.cache.has(this.client.user.id)).array()) {
                await r.users.remove(this.client.user.id);
              }
            }
            break;

          case "◀️":
            --currentPage;
            if(currentPage == -1) currentPage = pages-1;
            if(this.guild.me.permissions.has('MANAGE_MESSAGES')) reaction.users.remove(user.id);
            queueEmbed.edit(embeds[currentPage].setFooter(`Requested by ${this.message.author.username} • Page ${currentPage + 1} of ${pages}`));
            break;

          case "❌":
            collector.stop();
            queueEmbed.delete();
            break;
        }
      } catch (err) {
        console.log(err.message);
      }
    });
  }
}

module.exports = CommandContext;