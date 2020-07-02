const Discord = require("discord.js");
const config = require("./config");

/**
 * Create our client
 */
const Bumper = new Discord.Client({
  disabledEvents: [
    "CHANNEL_PINS_UPDATE",
    "RELATIONSHIP_ADD",
    "RELATIONSHIP_REMOVE",
    "TYPING_START"
  ],
  messageCacheMaxSize: 100,
  messageCacheLifetime: 240,
  messageSweepInterval: 300,
  fetchAllMembers: true
});

/**
 * Require external files that Bumper needs.
 */
require("./Handlers/EventHandler.js")(Bumper);
require("./Handlers/CommandHandler.js")(Bumper);
require("./Handlers/functions")(Bumper);

Bumper.Developers = ["338192747754160138" /* Tea Cup#9999 */];
Bumper.Staff = ["364007557045551106", "320602199006642178"];

//require('./Data/Database.js')(Bumper);
Bumper.Commands = new Discord.Collection();
Bumper.Aliases = new Discord.Collection();

Bumper.Color = "#DAF7A6";
Bumper.ErrorColor = 0xf64465;

let client = Bumper;

const emoji = require("./Handlers/emoji");
client.emoji = emoji;

// Auto-Filter Message Reminder Counts
client.imageOnlyFilterCount = 0;
client.newlineLimitFilterCount = 0;
client.noMentionFilterCount = 0;

// Raid Mode
client.raidMode = false;
client.raidBanning = false;
client.raidJoins = [];
client.raidMessage = null;
client.raidMembersPrinted = 0;

require('./StarBoard')

module.exports = Bumper;
