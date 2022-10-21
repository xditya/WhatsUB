const { PrivateChat, GroupChat, ClientInfo } = require("whatsapp-web.js");

const execute = async (client, msg) => {
  let chats = await client.getChats();
  let pms = 0,
    groups = 0,
    unlisted = 0;
  const me = client.info;
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
  if (unlisted) txt += `\n    • *UnListed*: ${unlisted}`;
  await client.sendMessage(msg.id.remote, txt);
};

module.exports = { execute };
