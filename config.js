require("dotenv").config();

const CMD_HANDLER = process.env.CMD_HANDLER || '!';
const DETA_PROJ_KEY = process.env.DETA_PROJ_KEY || '';
const FOR_ALL = process.env.FOR_ALL || 'false';

module.exports = { CMD_HANDLER, DETA_PROJ_KEY, FOR_ALL };