const express = require("express");
const postRoutes = express.Router();
const Authenticate = require("../middlewares/authentication.middleware");
const PostController = require("../controllers/post.controller");
const Upload = require("../middlewares/upload.middleware");

postRoutes.get("/", Authenticate(true), PostController.getPosts);
postRoutes.get("/:id", Authenticate(true), PostController.getPost);
postRoutes.post("/", Authenticate(), PostController.createPost);
postRoutes.post(
  "/image",
  Authenticate(),
  Upload.single("image"),
  PostController.uploadImage
);
postRoutes.post(
  "/:id/interactions/:type",
  Authenticate(),
  PostController.addInteraction
);

module.exports = postRoutes;
