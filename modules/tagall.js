const execute = async (client, msg, args) => {
    await msg.delete(true);
    const chat = await msg.getChat();
    let mentions = [];
    let text = "";
    if (chat.isGroup) {
      for(let participant of chat.participants) {
        let contact = await client.getContactById(participant.id._serialized);
        mentions.push(contact);
        text += `@${participant.id.user}\n`;
      }
      chat.sendMessage(text, { mentions });
    }
  };
  
  module.exports = { execute };
