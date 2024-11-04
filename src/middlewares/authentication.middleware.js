const { getUser } = require("../services/user.service");
const { verifyToken } = require("../utils/jwt");

function Authenticate(proceed) {
  return async (req, res, next) => {
    try {
      if (!req.cookies["accessToken"]) {
        throw new Error("Not logged in.");
      }
      const accessToken = req.cookies["accessToken"].replace("Bearer ", "");

      const decoded = verifyToken(accessToken);
      if (!decoded) {
        throw new Error("Token expired.");
      }

      const user = await getUser({ id: decoded.id });
      if (!user || user.accessToken != accessToken) {
        throw new Error("User was not found or the token isn't the same.");
      }

      req.user = user;

      next();
    } catch (err) {
      if (!proceed) {
        console.log("Authentication error: ", err);
        res.status(401).send(err.message);
      } else {
        next();
      }
    }
  };
}

module.exports = Authenticate;
