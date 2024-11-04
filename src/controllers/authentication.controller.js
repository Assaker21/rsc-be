const { getUser, updateUser, createUser } = require("../services/user.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function login(req, res, next) {
  try {
    const query = {};

    if (req.body.emailOrUsername.includes("@")) {
      query.email = req.body.emailOrUsername;
    } else {
      query.username = req.body.emailOrUsername;
    }

    const user = await getUser(query);

    if (!user) {
      throw new Error(
        `No user with this ${query.email ? "email" : "username"} was found.`
      );
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (validPassword) {
      const accessToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );

      await updateUser({ id: user.id }, {}, { accessToken });

      delete user.accessToken;
      delete user.password;
      res
        .status(200)
        .cookie("accessToken", accessToken, {
          httpOnly: true,
          sameSite: "none",
          partitioned: true,
          secure: true,
        })
        .send(user);
    } else {
      throw new Error("Invalid credentials.");
    }
  } catch (err) {
    next(err);
  }
}

async function register(req, res, next) {
  try {
    if (!req.body.email || req.body.email.length == 0) {
      throw new Error("Email is invalid");
    }

    if (!req.body.username || req.body.username.length == 0) {
      throw new Error("Username is invalid");
    }

    if (!req.body.firstName || req.body.firstName.length == 0) {
      throw new Error("First name is invalid");
    }

    if (!req.body.lastName || req.body.lastName.length == 0) {
      throw new Error("Last name is invalid");
    }

    let user = await getUser({
      OR: [{ email: req.body.email }, { username: req.body.username }],
    });

    if (user?.email == req.body.email) {
      throw new Error("Email is already in use.");
    }

    if (user?.username == req.body.username) {
      throw new Error("Username is already in use.");
    }

    const password = req.body.password;

    if (!password || password.length < 8) {
      throw new Error("Password must be at least 8 characters long.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    user = await createUser({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      username: req.body.username,
      password: hashPassword,
    });

    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    await updateUser({ id: user.id }, {}, { accessToken });

    delete user.password;
    res
      .status(200)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "none",
        partitioned: true,
        secure: true,
      })
      .send(user);
  } catch (err) {
    next(err);
  }
}

async function authenticate(req, res, next) {
  res.status(200).send({ user: req.user });
}

async function logout(req, res, next) {
  try {
    await updateUser({ id: req.user.id }, {}, { accessToken: "" });
    res
      .status(200)
      .clearCookie("accessToken", { path: "/" })
      .send("Logged out successfully!");
  } catch (err) {
    next(err);
  }
}

module.exports = { login, register, authenticate, logout };
