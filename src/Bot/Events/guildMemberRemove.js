const Discord = require("discord.js");
const Canvas = require("canvas");
const { get } = require("snekfetch");

module.exports = async (Bumper, member) => {
 

  let channel = Bumper.channels.cache.get("663240746941546539");
 channel.send(`${member.user} has left the server, hopefully they come back :)`) 
}