const Discord = require("discord.js");

module.exports = async (client, oldMember, newMember) => {
  if (oldMember.nickname !== newMember.nickname) {
    const embed = new Discord.MessageEmbed()
      .setAuthor(newMember.user.tag, newMember.user.displayAvatarURL())
      .setTimestamp()
      .setColor("#00e5ff")
      .setFooter(`ID: ${newMember.id}`)
      .addField(
        "**Nickname Update**",
        `**Before:**${
          oldMember.nickname
            ? oldMember.nickname.replace(/(\*|~|_|`|<|\|)/g, "\\$1")
            : oldMember.user.username.replace(/(\*|~|_|`|<|\|)/g, "\\$1")
        }
**+After:**${
          newMember.nickname
            ? newMember.nickname.replace(/(\*|~|_|`|<|\|)/g, "\\$1")
            : newMember.user.username.replace(/(\*|~|_|`|<|\|)/g, "\\$1")
        }`
      );

    oldMember.guild.channels.cache.get("663241077297250344").send(embed);
  }
};
