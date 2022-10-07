const exec = require('child_process').exec;
const os = require("os");

const execute = async (client, msg, args) => {
    await msg.delete(true);
    if (args.length < 1) return await msg.reply("give some commands to execute");
    var cmds = args.join(" ");
    var { username } = os.userInfo();
    var hostname = os.hostname();
    exec(cmds, async (err, stdout, stderr) => {
        if (err) return await msg.reply('```' + `${username}@${hostname}:~# ${cmds}\n${err}` + '```');
        await msg.reply('```' + `${username}@${hostname}:~# ${cmds}\n${stdout}\nstderr:\n${stderr}` + '```');
    });
};

module.exports = { execute };
