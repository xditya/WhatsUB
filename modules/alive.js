const { MessageMedia } = require("whatsapp-web.js");
const axios = require("axios");

const img_link = "https://graph.org/file/c579bc78d6e204ed123a1.png";

const execute = async(client, msg, args) => {
    await msg.delete(true);
    await client.sendMessage(
      msg.to,
      new MessageMedia("image/png", Buffer.from(
        (
          await axios.get(img_link, {responseType: "arraybuffer"})
        ).data
      ).toString("base64"), 
      "alive.png"),
      {caption: `*Up and working!*\n\n*WhatsUB* _v${process.env.npm_package_version}_\n\n*Developer*: https://xditya.me`});
}

module.exports = { execute };