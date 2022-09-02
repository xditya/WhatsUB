const { PrivateChat, GroupChat } = require("whatsapp-web.js");

const execute = async (client, msg, args) => {
  await msg.delete(true);
  let chats = await client.getChats();
  let pms = 0,
    groups = 0,
    unlisted = 0;
  for (let i = 0; i < chats.length; i++)
    if (chats[i] instanceof PrivateChat) pms++;
    else if (chats[i] instanceof GroupChat) groups++;
    else {
      console.log(chats[i]);
      unlisted++;
    }
  var txt = `*Total Chats*: ${chats.length}

• *PMs*: ${pms}
• *Groups*: ${groups}`;
  if (unlisted != 0) txt += `\n• *UnListed*: ${unlisted}`;
  await msg.reply(txt);
};

module.exports = { execute };
