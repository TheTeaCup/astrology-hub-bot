const Discord = require("discord.js");
const { caseNumber } = require("../Handlers/caseNumber.js");
const { parseUser } = require("../Handlers/parseUser.js");

exports.run = async (Mythical, message, args) => {
  const deniedEmbed = new Discord.MessageEmbed()
    .setTitle("Astrolgy - Hub")
    .setColor(Mythical.Color)
    .setDescription("Sorry, you don't have permission to use this..");

  if (!Mythical.Developers.includes(message.author.id)) {
    return message.channel.send(deniedEmbed);
  }

  let guild = Mythical.guilds.cache.get("662738753374257203");

  const user = message.mentions.users.first();
  if (!user) return message.channel.send(`Sorry you didn't mention a User.`);
  parseUser(message, user);

  const modlog = Mythical.channels.cache.get("710506319626502215");
  if (!modlog) return message.reply("I cannot find a mod-log channel");
  const caseNum = await caseNumber(Mythical, modlog);

  const muteRole = guild.roles.cache.get("710333511034339389");
  if (!muteRole)
    return message.reply("I cannot find a mute role").catch(console.error);

  const reason =
    args.splice(1, args.length).join(" ") ||
    `Awaiting moderator's input. Use !reason ${caseNum} reason.`;

  const embed = new Discord.MessageEmbed()
    .setColor("#fac10b")
    .setTitle(`Mute | Case #${caseNum}`)
    .setTimestamp()
    .addField("Target", `${user.tag} (<@${user.id}>)`, true)
    .addField("Moderator", `${message.author.tag}`, true)
    .addField("Reason", `${reason}`)
    .setFooter(`Case ${caseNum}`);

  const embed2 = new Discord.MessageEmbed()
    .setColor("#07de05")
    .setTitle(`Unmute | Case #${caseNum}`)
    .setTimestamp()
    .addField("Target", `${user.tag} (<@${user.id}>)`, true)
    .addField("Moderator", `${message.author.tag}`, true)
    .addField("Reason", `Times up!`)
    .setFooter(`Case ${caseNum}`);

  if (
    !message.guild
      .member(Mythical.user)
      .hasPermission("MANAGE_ROLES_OR_PERMISSIONS")
  )
    return message
      .reply("I do not have the correct permissions.")
      .catch(console.error);

  if (message.guild.member(user).roles.cache.has(muteRole.id)) {
    message.guild
      .member(user)
      .roles.remove(muteRole)
      .then(() => {
        Mythical.channels.cache
          .get(modlog.id)
          .send(embed2)
          .catch(console.error);
      });

    return message.channel
      .send(`Successfully un-muted ${user}!`)
      .catch(err => console.error(err));
  } else {
    message.guild
      .member(user)
      .roles.add(muteRole)
      .then(() => {
        Mythical.channels.cache
          .get(modlog.id)
          .send({ embed })
          .catch(console.error);
      });

    // Kick member if in voice
    if (user.voice.channel) {
      user.voice.kick();
    }

    return message.channel
      .send(`Successfully muted ${user}!`)
      .catch(err => console.error(err));
  }
};

exports.help = {
  name: "mute",
  description: "mutes or unmutes a mentioned user",
  usage: "mute [mention] [reason]"
};

exports.conf = {
  Aliases: []
};
