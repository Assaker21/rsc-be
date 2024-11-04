const express = require("express");
const AuthenticationController = require("../controllers/authentication.controller");
const authenticationRoutes = express.Router();
const Authenticate = require("../middlewares/authentication.middleware");

authenticationRoutes.post("/login", AuthenticationController.login);
authenticationRoutes.post("/register", AuthenticationController.register);
authenticationRoutes.get(
  "/",
  Authenticate(),
  AuthenticationController.authenticate
);

authenticationRoutes.get(
  "/logout",
  Authenticate(),
  AuthenticationController.logout
);

module.exports = authenticationRoutes;
