const fs = require("fs");
const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");
const { CMD_HANDLER, FOR_ALL } = require("./config.js");
const { checkSessionAndLoad, storeSession } = require("./functions/sessions.js");

(async () => {
  // check and load old session
  await checkSessionAndLoad();

  const client = new Client({
    authStrategy: new LocalAuth({
      dataPath: "./WhatsUB",
    }),
    puppeteer: { headless: true, args: ["--no-sandbox"] },
  });

  // load modules
  // https://github.com/tuhinpal/WhatsBot/blob/main/main.js#L18-L27
  client.commands = new Map();
  fs.readdir("./modules", (err, files) => {
    if (err) return console.error(err);
    files.forEach((commandFile) => {
      if (commandFile.endsWith(".js")) {
        let commandName = commandFile.replace(".js", "");
        const command = require(`./modules/${commandName}`);
        client.commands.set(commandName, command);
      }
    });
  });
  client.new = false;
  client.on("qr", (qr) => {
    console.log("Generating QR Code...");
    console.log("QR RECEIVED", qr);
    console.log(qrcode.generate(qr, { small: true }));
    client.new = true;
  });

  client.on("authenticated", async () => {
    console.log("Authenticated!");
    await new Promise(resolve => setTimeout(resolve, 2 * 1000));
    await storeSession(client.new);
  });

  client.on("ready", async () => {
    console.log(`\n\t\t${client.info.pushname} WhatsUB has started!\n\t\t\t©xditya`);
    // await client.sendMessage(client.info.me._serialized, "*Bot is Active Now*");
  });

  client.on("message_create", async (msg) => {
    // https://github.com/tuhinpal/WhatsBot/blob/main/main.js#L18-L27
    if (msg.body.startsWith(CMD_HANDLER)) {
      let _args = msg.body.slice(1).trim();
      let command = _args.split(' ', 1)[0].toLowerCase();

      if (client.commands.has(command)) {
        try {
          if (FOR_ALL.toLocaleLowerCase() == 'false' && !msg.fromMe)
            return;
          msg.args = _args.substr(_args.indexOf(' ') + 1).trim();
          msg.timestamp = (new Date()).getTime();
          if (msg.fromMe) {
            await msg.delete(true);
            await msg.delete();
          }
          await client.commands.get(command).execute(client, msg);
        } catch (error) {
          console.error(error);
        }
      }
    }
  });

  console.log("Initializing Client...");
  client.initialize();
})().catch((e) => {
  console.error(e);
});
