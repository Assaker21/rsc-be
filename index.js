const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const Delay = require("./src/middlewares/delay.middleware");

const authenticationRoutes = require("./src/routes/authentication.route");
const postRoutes = require("./src/routes/post.route");

const app = express();
app.use("/uploads", express.static("uploads"));

const allowedOrigins = [
  "http://127.0.0.1:5173",
  "http://localhost:5173",
  "http://127.0.0.1:5174",
  "http://localhost:5174",
  "http://localhost:5173/images",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(Delay);

app.use("/authentication", authenticationRoutes);
app.use("/posts", postRoutes);
app.use("/ho", (req, res) => {
  res.send("Hey!");
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send(err?.message || "Something broke!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
