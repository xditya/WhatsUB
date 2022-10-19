const fs = require('fs');
const { spawn } = require('child_process');
const { carbonize } = require('./carbon');
const { MessageMedia } = require('whatsapp-web.js');

async function spawnChild(uid, prog) {
    const file = uid.split('@')[0];
    fs.writeFile(`${file}.c`, prog, (er) => {
        if (er) return console.error(er);
    });
    await new Promise(resolve => setTimeout(resolve, 0.5 * 1000));
    const compile = spawn('g++', [`./${file}.c`, `-lm`, `-o`, file], {
        detached: true,
        shell: true,
    });
    let error = "";
    let data = "";
    for await (const chunk of compile.stderr) {
        error += chunk;
    }
    if (error) {
        new spawn("rm", [`${file}*`], {
            detached: true,
            shell: true,
        });
        return error;
    }
    const child = spawn(`timeout`, ['2', `./${file}`], {
        timeout: 2 * 1000, shell: true, detached: true,
    });
    for await (const chunk of child.stdout) {
        data += chunk;
    }
    new spawn("rm", [`${file}*`], {
        detached: true,
        shell: true,
    });
    return data || "Success";
}

let sudo_code = `
#include <iostream>
#include <math.h>
using namespace std;

int main(){
!code
return 0;
}
`

const execute = async (client, msg) => {
    if (msg.args.includes('scanf(') || msg.args.includes('gets(')) {
        if (msg.fromMe)
            msg = await client.sendMessage(msg.id.remote, msg.args);
        return await msg.reply("```Can't process scanf()\nPlease initialize the values\nSo u dont have to use scanf in code.```")
    }
    if (!(msg.args.includes('main(')))
        msg.args = sudo_code.replace('!code', msg.args);
    const output = await spawnChild(msg.author || msg.from, msg.args);
    const data = await carbonize(msg.args);
    await client.sendMessage(
        msg.id.remote,
        new MessageMedia(data.mimetype, data.data, data.filename),
        {
            caption:
                `*Code*:\n` +
                "```" +
                msg.args +
                "```" +
                `\n\n*Output*:\n` +
                "```" +
                output.trim() +
                "```"
        }
    );
};

module.exports = { execute };