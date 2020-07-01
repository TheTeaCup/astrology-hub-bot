const Astro = require("./Bot/AstronomyClient.js");

Astro.login(process.env.TOKEN).catch(err => {
  console.log(
    `[ Astro (Bot) ] Found an error while connecting to Discord.\n${err.stack}`
  );
});
