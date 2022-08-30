const fs = require("fs");

const { Deta } = require("deta");
const { zip, COMPRESSION_LEVEL } = require("zip-a-folder");
const { extract } = require("extract-zip");

const { DETA_PROJ_KEY } = require("../config.js")

const deta = Deta(DETA_PROJ_KEY);
const whatsDB = deta.Drive("WhatsUB")

const checkSessionAndLoad = async () => {
    if (!fs.existsSync("./WhatsUB")) {
        try {
            console.log("No session file found. Trying to load from database...")
            const get_s = await whatsDB.get("whatsubsession");
            if (get_s) {
                const buffer = await get_s.arrayBuffer();
                fs.writeFileSync("./WhatsUB.zip", Buffer.from(buffer));
                await extract("./WhatsUB.zip", { dir: __dirname + "./WhatsUB" });
                fs.unlinkSync("./WhatsUB.zip");
                console.log("Session restored from database.")
                return true;
            }
            else {
                console.log("Session does not exist in database.")
                return false;
            }
        } catch (err) {
            console.log("Error loading session from db: " + err);
        }
    }
    else {
        console.log("Local session already exists!");
        const get_s = await whatsDB.get("whatsubsession");
        if (get_s == null) { await storeSession() }
        return true;
    }
}


const storeSession = async () => {
    if(fs.existsSync("./WhatsUB")) {
        try
        {
            console.log("Saving session file to database for future use...")
            await zip("./WhatsUB", "./WhatsUB.zip", {compression: COMPRESSION_LEVEL.high});
            await whatsDB.put("whatsubsession", {path: "./WhatsUB.zip"});
            fs.unlink("./WhatsUB.zip");
            console.log("Saved session to database.")
        }
        catch (err) 
        {
            console.log("Error saving session to db: " + err);
        }
    }
}

module.exports = { storeSession,checkSessionAndLoad };