const { MessageMedia } = require("whatsapp-web.js");

// TODO: Multiple uploads.

const execute = async (client, msg) => {
    if (msg.body.substring(1) == msg.args) {
        await msg
        return;
    }
    const args = msg.args.replace(' ', '%20');
    let data = await (await fetch(`https://search.imdbot.workers.dev/?q=${args}`)).json();
    if (data['description'].length < 1) {
        await msg.reply("No Results found..");
        return;
    }
    data = data["description"][0];
    let parse = `*Title*: ${data['#TITLE']} [${data['#YEAR']}]\nActors: ${data['#ACTORS']}`;
    if (data['#IMDb_SHORT_DESC']) {
        parse += `\n${data['#IMDb_SHORT_DESC']}`
    }
    parse += `\n\n${data["#IMDB_URL"]}`;
    if (data['#IMG_POSTER']) {
        await client.sendMessage(msg.id.remote,
            await MessageMedia.fromUrl(data["#IMG_POSTER"]), { caption: parse });
    }
    else {
        await msg.reply(parse);
    }

}

module.exports = { execute };