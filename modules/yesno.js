const { MessageMedia } = require("whatsapp-web.js");
const axios = require("axios");

const execute = async (client, msg) => {
    var request = (await axios.get("https://yesno.wtf/api")).data;
    const media = await MessageMedia.fromUrl(request["image"]);

    media.mimetype = "image/gif";
    media.filename = "yesno.gif";

    await client.sendMessage(
        msg.id.remote,
        media,
        { caption: request["answer"] }
    );
}

module.exports = { execute };
