const Enmap = require("enmap");

module.exports = async Bumper => {
  console.log("( Bot ) Connected to Discord.");

  Bumper.user.setActivity(`Over the Astrology Hub`, {
    type: "WATCHING"
  });
  Bumper.user.setStatus("idle");

  let guild = Bumper.guilds.cache.get("662738753374257203");

  // Save the current collection of guild invites.
  guild.fetchInvites().then(guildInvites => {
    Bumper.invites = guildInvites;
  });

  //Dashboard Owner Sync
  Bumper.appInfo = await Bumper.fetchApplication();
  setInterval(async () => {
    Bumper.appInfo = await Bumper.fetchApplication();
  }, 60000);

  Object.assign(
    Bumper,
    Enmap.multi(
      [
        "enabledCmds",
        "userDB",
        "emojiDB",
        "villagerDB",
        "tags",
        "playlist",
        "infractionDB",
        "sessionDB",
        "muteDB",
        "memberStats",
        "reactionRoleDB"
      ],
      { ensureProps: true }
    )
  );

  let client = Bumper;

  // Reschedule any unmutes from muteDB
  const now = Date.now();
  client.muteDB.keyArray().forEach(memID => {
    const unmuteTime = client.muteDB.get(memID);
    guild.members
      .fetch(memID)
      .then(member => {
        if (unmuteTime < now) {
          // Immediately unmute
          client.muteDB.delete(memID);
          member.roles.remove(
            "710333511034339389",
            "Scheduled unmute through reboot."
          );
        } else {
          // Schedule unmute
          setTimeout(() => {
            if ((client.muteDB.get(memID) || 0) < Date.now()) {
              client.muteDB.delete(memID);
              member.roles.remove(
                "710333511034339389",
                "Scheduled unmute through reboot."
              );
            }
          }, unmuteTime - now);
        }
      })
      .catch(() => {
        // Probably no longer a member, don't schedule their unmute and remove entry from DB.
        client.muteDB.delete(memID);
      });
  });

  // Emoji usage tracking database init
  guild.emojis.cache.forEach(e => {
    // If EmojiDB does not have the emoji, add it.
    if (!client.emojiDB.has(e.id)) {
      client.emojiDB.set(e.id, 0);
    }
  });
  // Sweep emojis from the DB that are no longer in the guild emojis
  client.emojiDB.sweep((v, k) => !guild.emojis.cache.has(k));

  require("../RoleReaction.js")(Bumper);
};
