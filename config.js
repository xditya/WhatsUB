require("dotenv").config();

const CMD_HANDLER = process.env.CMD_HANDLER;
const DETA_PROJ_KEY = process.env.DETA_PROJ_KEY;

module.exports ={ CMD_HANDLER, DETA_PROJ_KEY };