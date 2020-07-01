const Discord = require("discord.js");
const Canvas = require("canvas");
const { get } = require("snekfetch");

module.exports = async (Bumper, member) => {
  // GuildMemberAdd Event.

  let guild = Bumper.guilds.cache.get("662738753374257203");
  let unverifed = guild.roles.cache.get("710273885744136233");
  let blank = guild.roles.cache.get("662740721240899594");
  let bots = guild.roles.cache.get("710310790162284646");

  if (member.user.bot) {
    member.roles
      .add(bots, "Auto assigned role / bot")
      .catch(e => console.log(e)); // Adds the blank role to the user.
  } else {
    let Roles = [];
    Roles.push(blank);
    Roles.push(unverifed);
    member.roles.add(Roles, "Auto assigned role").catch(e => console.log(e)); // Adds the blank role to the user.
    addInv(Bumper, member);
  }

  let channel = Bumper.channels.cache.get("663240746941546539");

  let msg = `Welcome ${member.user} To Astrology Hub, do us a favor and answer the security question in <#710273730286190592>`;

  let backk =
    "https://cdn.glitch.com/0ce75f44-0720-4204-9b62-85f1028d9f7a%2Fbumper-welcome.png?v=1561759460814";

  const canvas = Canvas.createCanvas(700, 250);

  const ctx = canvas.getContext("2d");

  const background = await Canvas.loadImage(`${backk}`);
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#74037b";
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  // Slightly smaller text placed above the member's display name
  ctx.font = "22px sans-serif";
  ctx.fillStyle = "#7289DA";
  ctx.fillText(
    "Welcome to the server,",
    canvas.width / 3.2,
    canvas.height / 2.5
  );

  // Add an exclamation point here and below
  ctx.fillStyle = "#7289DA";
  ctx.fillText(
    `${member.user.username}!`,
    canvas.width / 2.5,
    canvas.height / 1.8
  );

  ctx.beginPath();
  ctx.arc(120, 125, 88, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();

  const { body: buffer } = await get(
    `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png`
  );
  const avatar = await Canvas.loadImage(buffer);
  ctx.drawImage(avatar, 25, 25, 200, 200);

  if (!member.guild.member(Bumper.user).hasPermission("SEND_MESSAGES")) return;
  // if (!member.guild.member(Bumper.user).hasPermission('MANAGE_ROLES')) return;

  const attachment = new Discord.MessageAttachment(
    canvas.toBuffer(),
    "welcome-image.png"
  );

  channel.send(`${msg}`, attachment);
  channel.setTopic(
    `${member.guild.name} Now has #${guild.memberCount} members`
  );
};

async function addInv(client, member) {
  const time = Date.now();
  let accountAge = client.humanTimeBetween(time, member.user.createdTimestamp);

  // 172,800,000 ms is 48 hours.
  if (time - member.user.createdTimestamp < 172800000) {
    accountAge = `${client.emoji.warning} **NEW ACCOUNT** ${client.emoji.warning} ${accountAge}`;
  }

  let inviteField = "Unknown";
  // Check which invite was used.
  const guildInvites = await member.guild.fetchInvites();
  // Existing invites
  const ei = client.invites;
  // Update cached invites
  client.invites = guildInvites;
  // Discover which invite was used
  const invite = guildInvites.find(i => {
    if (!ei.has(i.code)) {
      // This is a new code, check if it's used.
      return i.uses > 0;
    }
    // This is a cached code, check if it's uses increased.
    return ei.get(i.code).uses < i.uses;
  });
  // If invite isn't valid, that most likely means the vanity URL was used so default to it.
  if (invite) {
    // Inviter
    const inviter = client.users.cache.get(invite.inviter.id);
    inviteField = `${invite.code} from ${inviter.tag} (${inviter.id}) with ${invite.uses}`;
  } else {
    // Vanity URL was used
    inviteField = "Vanity URL";
  }

  const embed = new Discord.MessageEmbed()
    .setTitle("User Joined")
    .setColor(client.Color)
    .setThumbnail(
      "https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/mail-128.png"
    )
    .setDescription(`**${member.user.tag}**\`(${member.user.id})\` has joined!`)
    // .addField('**Member Joined**', `<@${member.id}>`, true)
    .addField("**Join Position**", member.guild.memberCount, true)
    .addField("**Account Age**", accountAge, true)
    .addField("**Invite Used**", inviteField, true);

  client.channels.cache.get("710277930764337193").send(embed);
}
