class Command {

  constructor (client, {
    name = null,
    description = "No description provided.",
    category = "Uncategorized",
    usage = "No usage provided.",
    enabled = true,
    guildOnly = false,
    aliases = [],
    adminOnly = false,
    cooldown = 0,
  }) {
    this.client = client;
    this.conf = { enabled, guildOnly, aliases, adminOnly, cooldown };
    this.help = { name, description, category, usage };
  }
}
module.exports = Command;
