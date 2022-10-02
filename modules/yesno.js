const { MessageMedia } = require("whatsapp-web.js");
const axios = require("axios");

const execute = async(client, msg, args) => {
    var request = (await axios.get("https://yesno.wtf/api")).data;
    var img_link = request["image"];
    const media = await MessageMedia.fromUrl(img_link);

    media.mimetype = "image/gif";
    media.filename = "yesno.gif";

    await msg.delete(true);
    await client.sendMessage(
      msg.to,
      media,
      {caption: request["answer"]}
    );
}

module.exports = { execute };
