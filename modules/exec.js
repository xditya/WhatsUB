const exec = require('child_process').exec;
const os = require("os");

const execute = async (client, msg) => {
    if (msg.args.length < 1) return await msg.reply("give some commands to execute");
    var { username } = os.userInfo();
    var hostname = os.hostname();
    exec(msg.args, async (err, stdout, stderr) => {
        if (err) return await client.sendMessage(msg.id.remote, '```' + `${username}@${hostname}:~# ${msg.args}\n${err}` + '```');
        await msg.reply('```' + `${username}@${hostname}:~# ${msg.args}\n${stdout}\nstderr:\n${stderr}` + '```');
    });
};

module.exports = { execute };
