const { MessageMedia } = require('whatsapp-web.js');
const axios = require('axios');

const carbonize = async (text) => {
    return {
        mimetype: 'image/png',
        data: Buffer.from(
            (
                await axios.post(
                    'https://carbonara-42.herokuapp.com/api/cook',
                    { code: text },
                    { responseType: 'arraybuffer' },
                )
            ).data, 'binary'
        ).toString('base64'),
        name: 'carbon',
    }
};

const execute = async (client, msg) => {
    if (msg.hasQuotedMsg)
        msg.args = msg._data.quotedMsg.body;
    const data = await carbonize(msg.args);
    await client.sendMessage(msg.id.remote, new MessageMedia(data.mimetype, data.data, data.filename));
};

module.exports = { execute, carbonize };