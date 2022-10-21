const { MessageMedia } = require("whatsapp-web.js");

const execute = async (client, msg) => {
  const media = await MessageMedia.fromUrl('https://graph.org/file/c579bc78d6e204ed123a1.png');
  await client.sendMessage(
    msg.id.remote,
    media,
    {
      caption: `*Up and working!*\n\n*WhatsUB:* _v2.0.0_\n\n*Source:* _github.com/xditya/WhatsUB_`
    });
}

module.exports = { execute };