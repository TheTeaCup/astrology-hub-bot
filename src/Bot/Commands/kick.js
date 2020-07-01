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
  if (message.mentions.users.size < 1)
    return message
      .reply("You must mention someone to ban them.")
      .catch(console.error);

  let member = guild.members.cache.get(user);

  // Sets reason shown in audit logs
  // Kicks the member
  await message.guild
    .member(user)
    .kick({ reason: `Kicked by ${message.author.tag}` })
    .catch(error =>
      Mythical.error(
        message.channel,
        "Kick Failed!",
        `I've failed to kick this member! Error: ${error}`
      )
    );

  const reason =
    args.splice(1, args.length).join(" ") ||
    `Awaiting moderator's input. Use !reason ${caseNum} reason.`;

  Mythical.success(
    message.channel,
    "Kick Successful!",
    `I've successfully kicked **${user.tag}**!`
  );

  const embed = new Discord.MessageEmbed()
    .setColor("#fac10b")
    .setTitle(`Kick | Case #${caseNum}`)
    .setTimestamp()
    .addField("Target", `${user.tag} (<@${user.id}>)`, true)
    .addField("Moderator", `${message.author.tag}`, true)
    .addField("Reason", `${reason}`)
    .setFooter(`Case ${caseNum}`);
  return modlog.send({ embed });
};

exports.help = {
  name: "kick",
  description: "Kicks the mentioned user.",
  usage: "kick [mention] [reason]"
};

exports.conf = {
  Aliases: []
};
