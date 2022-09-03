const { PrivateChat, GroupChat, ClientInfo } = require("whatsapp-web.js");

const execute = async (client, msg, args) => {
  await msg.delete(true);
  let chats = await client.getChats();
  let pms = 0,
    groups = 0,
    unlisted = 0;
  const me = await client.info;
  for (let i = 0; i < chats.length; i++)
    if (chats[i] instanceof PrivateChat) pms++;
    else if (chats[i] instanceof GroupChat) groups++;
    else {
      console.log(chats[i]);
      unlisted++;
    }
  var txt =
    `*Name*: ` +
    "```" +
    `${me.pushname}` +
    "```" +
    `
*Server*: ` +
    "```" +
    `${me.me.server}` +
    "```" +
    `
*Platform*: ` +
    "```" +
    `${me.platform}` +
    "```" +
    `
*Total Chats*: ${chats.length}
    • *PMs*: ${pms}
    • *Groups*: ${groups}`;
  if (unlisted != 0) txt += `\n    • *UnListed*: ${unlisted}`;
  await msg.reply(txt);
};

module.exports = { execute };
