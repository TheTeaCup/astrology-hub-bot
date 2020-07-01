const Discord = require("discord.js");

module.exports = async (Mythical, message) => {
  if (
    message.author.bot ||
    !message.author ||
    message.channel.type !== "text"
  ) {
    return undefined;
  }

  // User activity tracking
  Mythical.userDB.set(
    message.author.id,
    message.createdTimestamp,
    "lastMessageTimestamp"
  );

  // Emoji finding and tracking
  const regex = /<a?:\w+:([\d]+)>/g;
  const msg = message.content;
  let regMatch;
  while ((regMatch = regex.exec(msg)) !== null) {
    // If the emoji ID is in our emojiDB, then increment its count
    if (Mythical.emojiDB.has(regMatch[1])) {
      Mythical.emojiDB.inc(regMatch[1]);
    }
  }

  if (message.channel.id === "710273730286190592") {
    if (message.content.toLowerCase() === "grape") {
      message.delete();
      let guild = Mythical.guilds.cache.get("662738753374257203");
      let user = guild.members.cache.get(`${message.author.id}`);
      let role = guild.roles.cache.get("662739959043850260");

      let un = guild.roles.cache.get("710273885744136233");

      await user.roles.remove(un, "Verified").catch(e => console.log(e));
      await user.roles.add(role).catch(e => console.log(e));

      Mythical.channels.cache
        .get("663226999317463091")
        .send(
          `Howdy ${user.user}! Now that you're ~ **Verified** ~ you can get more roles, \n so go ahead and check out <#663225839206400010> & <#710325145893601300> for more info!`
        );
    }
  }

  if (message.content === `<@!710267520602603621>`) {
    const embed2 = new Discord.MessageEmbed()
      .setColor(Mythical.Color)
      .setDescription(`Need Help? My prefix is: **!**`);

    message.channel.send(embed2);
  }

  let Prefix = "!";
  if (message.content.indexOf(Prefix) !== 0) {
    return undefined;
  }

  const guildUsed = message.guild ? `#${message.channel.name}` : "DMs";

  console.log(
    `${message.guild.name}[${message.guild.id}] - ${message.author.tag} - ${message.content} used in ${guildUsed}!`
  );

  let args = message.content
    .slice(Prefix.length)
    .trim()
    .split(/ +/g);
  let Command = args.shift().toLowerCase();

  let MythicalCommand;
  if (Mythical.Commands.has(Command)) {
    MythicalCommand = Mythical.Commands.get(Command);
  } else if (Mythical.Aliases.has(Command)) {
    MythicalCommand = Mythical.Commands.get(Mythical.Aliases.get(Command));
  } else {
    return; //Not a command
  }

  MythicalCommand.run(Mythical, message, args);
};
