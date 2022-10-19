const execute = async (client, msg) => {
  let ms = ((new Date()).getTime()) - msg.timestamp;
  if (ms) ms = `${ms}ms`; else ms = '';
  await msg.reply(`Pong! ${ms}`);
};

module.exports = { execute };
