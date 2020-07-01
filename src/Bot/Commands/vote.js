const Discord = require("discord.js");

exports.run = async (Mythical, message, args) => {
  const embed = new Discord.MessageEmbed()
    .setTitle("Astrolgy - Hub")
    .setColor(Mythical.Color)
    .setDescription(
      "Would you like to Upvote Astrology Hub so that we can get more members? \n Then look at the link's and bot commands below!"
    )
    .addField(
      "Links",
      `[ServersList.Space](https://serverlist.space/server/662738753374257203)  **(every 24hrs)**`
    )
    .addField("Commands", 
`
Disboard - \`!d bump\` (**Every 2hrs**) 
PYS - \`py!bump\` (**Every 2hrs**)
Bump Central - \`~bump\` (**Every 1hr**)

`);
  
  message.channel.send(embed)
};

exports.help = {
  name: "vote",
  description: "Updates an unset moderator action.",
  usage: "vote"
};

exports.conf = {
  Aliases: []
};
