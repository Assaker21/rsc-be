const delay = require("../utils/delay");

async function Delay(req, res, next) {
  await delay(1000);
  next();
}

module.exports = Delay;
