const Discord = require("discord.js");

module.exports.run = async (Koala, message, args) => {
  // eslint-disable-line no-unused-vars
  const deniedEmbed = new Discord.MessageEmbed()
    .setTitle("Astrolgy - Hub")
    .setColor(Koala.Color)
    .setDescription("Sorry, you don't have permission to use this..");

  if (!Koala.Developers.includes(message.author.id)) {
    return message.channel.send(deniedEmbed);
  }

  Koala.emit(
    "guildMemberAdd",
    message.member || (await message.guild.fetchMember(message.author))
  );
};

exports.help = {
  name: "join",
  description: "Allows you to test the welcome!",
  usage: "k!Join"
};

exports.conf = {
  Aliases: []
};