const execute = async(client, msg, args) => {
    await msg.delete(true);
    await msg.reply("Pong!");
}

module.exports = { execute };