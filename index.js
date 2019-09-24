require("dotenv").config();

const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000;
const JWT = require("jsonwebtoken");
const multer = require("multer");
const upload = multer({ storage: multer.MemoryStorage });
const fs = require("fs");
const app = express();

const seedUser = require("./seeder/seedUser");

const seedUsers = async (req, res) => {
  try {
    await User.destroy({ truncate: true });
    const result = await User.bulkCreate(seedUser);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

const postUser = async (req, res) => {
  try {
    const url = `public/uploads/${req.file.originalname}`;
    fs.writeFileSync(url, req.file.buffer);
    const file = `uploads/${req.file.originalname}`;
    const dataFile = `http://localhost:5000/${file}`;
    req.body.image = dataFile;
    const result = await User.create(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

const updateUser = async (req, res) => {
  var id = req.params.id;
  try {
    const result = await User.update(req.body, {
      where: {
        id
      }
    });
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

const checkToken = (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    const result = JWT.verify(auth, process.env.SECRET_KEY);
    if (result.role === "employee") {
      req.user = result;
      next();
    } else {
      res.status(401).json({
        message: "Unauthorized"
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "unauthorized"
    });
  }
};

const getUsers = async (request, response) => {
  try {
    const result = await User.findAll({
      include: [
        {
          model: User,
          as: "superior",
          attributes: ["id", "name"]
        }
      ]
    });
    response.status(200).json({
      result,
      user: request.user
    });
  } catch (error) {
    console.log(error);
  }
};

const postLogin = async (request, response) => {
  try {
    let checkUser = await User.findOne({
      where: {
        email: request.body.email
      }
    });
    checkUser = JSON.parse(JSON.stringify(checkUser));
    if (checkUser) {
      if (checkUser.password === request.body.password) {
        const token = JWT.sign(
          { id: checkUser.id, role: checkUser.role },
          process.env.SECRET_KEY,
          { expiresIn: "6h" }
        );
        response.status(200).json({
          message: "You have succesfully logged in!",
          token
        });
      } else {
        response.status(400).json({
          message: "Wrong password!"
        });
      }
    } else {
      response.status(400).json({
        message: "Wrong email!"
      });
    }
  } catch (error) {}
};

app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(express.static(path.join(__dirname, "public")))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .get("/", (req, res) => res.render("pages/index"))
  .post("/login", postLogin)
  .get("/users", checkToken, getUsers)
  .post("/users", checkToken, upload.single("profile"), postUser)
  .post("/seedUsers", seedUsers)
  .put("/users/:id", updateUser)
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
