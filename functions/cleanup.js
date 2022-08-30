const fs = require("fs");

const checkSessionAndLoad = async () => {
  if (fs.existsSync("./WhatsUB.zip")) {
    fs.unlinkSync("./WhatsUB.zip");
  }
};

module.exports = checkSessionAndLoad;
