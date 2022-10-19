const fs = require("fs");
const path = require("path");

const { Deta } = require("deta");
const { zip, COMPRESSION_LEVEL } = require("zip-a-folder");
const extract = require("extract-zip");

const { DETA_PROJ_KEY } = require("../config.js");

let whatsDB = null;
if (DETA_PROJ_KEY) {
  const deta = Deta(DETA_PROJ_KEY);
  whatsDB = deta.Drive("WhatsUB");
}


const storeSession = async (isnew) => {
  if (!whatsDB) return;
  if (!(isnew || !(await whatsDB.list()).names.includes("whatsubsession"))) return;
  if (fs.existsSync("./WhatsUB")) {
    try {
      console.log("\nSaving session file to database for future use...");
      if (fs.existsSync("./WhatsUB.zip")) fs.unlink("./WhatsUB.zip", (err) => { if (err) console.log(err); });
      await zip("./WhatsUB", "./WhatsUB.zip", {
        compression: COMPRESSION_LEVEL.high,
      });
      await whatsDB.put("whatsubsession", { path: "./WhatsUB.zip" });
      await new Promise(resolve => setTimeout(resolve, 2 * 1000));
      fs.unlink("./WhatsUB.zip", (err) => { if (err) console.log(err); });
      console.log("Saved session to database.");
    } catch (err) {
      console.log("Error saving session to db: " + err);
    }
  }
};

const checkSessionAndLoad = async () => {
  if (!fs.existsSync("./WhatsUB")) {
    console.log("No session file found.");
    if (!whatsDB) return false;
    console.log("Trying to load from database...");
    try {
      const get_s = await whatsDB.get("whatsubsession");
      if (get_s) {
        const buffer = await get_s.arrayBuffer();
        fs.writeFileSync("./WhatsUB.zip", Buffer.from(buffer));
        await extract("./WhatsUB.zip", {
          dir: path.resolve("./") + "/WhatsUB",
        });
        fs.unlinkSync("./WhatsUB.zip");
        console.log("Session restored from database.");
        return true;
      } else {
        console.log("Session does not exist in database.");
        return false;
      }
    } catch (err) {
      console.log("Error loading session from db");
      console.error(err);
      return false;
    }
  } else {
    console.log("Local session exists!");
    return true;
  }
};

module.exports = { checkSessionAndLoad, storeSession };
