require("dotenv").config();

const Sequelize = require("sequelize");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000;
const JWT = require("jsonwebtoken");
const multer = require("multer");
const upload = multer({ storage: multer.MemoryStorage });
const fs = require("fs");
const config = require("./config");
const app = express();

const seedUser = require("./seeder/seedUser");

const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: true,
  user: config.user,
  host: config.host,
  database: config.database,
  password: config.password,
  port: 5432
});

// const client = await pool.connect();
// client.release();

// Passing parameters separately
const sequelize = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  dialect: "postgres" /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

/**
 * TABLE USER
 */
const User = sequelize.define("user", {
  name: {
    type: Sequelize.STRING
  },
  group: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING
    // allowNull defaults to true
  },
  role: {
    type: Sequelize.ENUM,
    values: ["employee", "manager", "hcmga"]
  },
  gender: {
    type: Sequelize.ENUM,
    values: ["male", "female"]
  },
  image: {
    type: Sequelize.STRING
  },
  superior_id: {
    type: Sequelize.INTEGER
  },
  leave_balance: {
    type: Sequelize.INTEGER
  },
  reimburse_balance: {
    type: Sequelize.INTEGER
  },
  phone_number: {
    type: Sequelize.STRING
  },
  address: {
    type: Sequelize.STRING
  },
  birth_date: {
    type: Sequelize.DATE
  },
  birth_place: {
    type: Sequelize.STRING
  },
  division: {
    type: Sequelize.STRING
  }
});

User.belongsTo(User, {
  as: "superior",
  foreignKey: "superior_id"
});

User.hasMany(User, {
  as: "junior",
  foreignKey: "superior_id"
});

/**
 * TABLE PERMIT
 */
const Permit = sequelize.define("permit", {
  name: {
    type: Sequelize.STRING
  },
  created_by: {
    type: Sequelize.INTEGER
  },
  start_date: {
    type: Sequelize.DATE
  },
  end_date: {
    type: Sequelize.DATE
  },
  start_time: {
    type: Sequelize.DATE
  },
  end_time: {
    type: Sequelize.DATE
  },
  working_shift: {
    type: Sequelize.INTEGER
  },
  notes: {
    type: Sequelize.STRING
  },
  manager_notes: {
    type: Sequelize.STRING
  },
  manager_status: {
    type: Sequelize.ENUM,
    values: ["waiting", "rejected", "approved"]
  },
  hcmga_notes: {
    type: Sequelize.STRING
  },
  hcmga_status: {
    type: Sequelize.ENUM,
    values: ["waiting", "rejected", "approved"]
  },
  hcmga_by: {
    type: Sequelize.INTEGER
  }
});

Permit.belongsTo(User, {
  as: "user",
  foreignKey: "created_by"
});

User.hasMany(Permit, {
  as: "permit",
  foreignKey: "id"
});

Permit.belongsTo(User, {
  as: "hcmga",
  foreignKey: "hcmga_by"
});

User.hasMany(Permit, {
  as: "hcmga_permit",
  foreignKey: "id"
});

/**
 * TABLE LEAVE
 */
const Leave = sequelize.define("leave", {
  name: {
    type: Sequelize.STRING
  },
  created_by: {
    type: Sequelize.INTEGER
  },
  start_date: {
    type: Sequelize.DATE
  },
  end_date: {
    type: Sequelize.DATE
  },
  notes: {
    type: Sequelize.STRING
  },
  manager_notes: {
    type: Sequelize.STRING
  },
  manager_status: {
    type: Sequelize.ENUM,
    values: ["waiting", "rejected", "approved"]
  },
  hcmga_notes: {
    type: Sequelize.STRING
  },
  hcmga_status: {
    type: Sequelize.ENUM,
    values: ["waiting", "rejected", "approved"]
  },
  hcmga_by: {
    type: Sequelize.INTEGER
  }
});

Leave.belongsTo(User, {
  as: "user",
  foreignKey: "created_by"
});

User.hasMany(Leave, {
  as: "leave",
  foreignKey: "id"
});

Leave.belongsTo(User, {
  as: "hcmga",
  foreignKey: "hcmga_by"
});

User.hasMany(Leave, {
  as: "hcmga_leave",
  foreignKey: "id"
});

/**
 * TABLE TRAVEL
 */
const Travel = sequelize.define("travel", {
  name: {
    type: Sequelize.STRING
  },
  created_by: {
    type: Sequelize.INTEGER
  },
  start_date: {
    type: Sequelize.DATE
  },
  end_date: {
    type: Sequelize.DATE
  },
  destination: {
    type: Sequelize.STRING
  },
  agenda: {
    type: Sequelize.STRING
  },
  advance_amount: {
    type: Sequelize.INTEGER
  },
  notes: {
    type: Sequelize.STRING
  },
  manager_notes: {
    type: Sequelize.STRING
  },
  manager_status: {
    type: Sequelize.ENUM,
    values: ["waiting", "rejected", "approved"]
  },
  hcmga_notes: {
    type: Sequelize.STRING
  },
  hcmga_status: {
    type: Sequelize.ENUM,
    values: ["waiting", "rejected", "approved"]
  },
  hcmga_by: {
    type: Sequelize.INTEGER
  }
});

Travel.belongsTo(User, {
  as: "user",
  foreignKey: "created_by"
});

User.hasMany(Travel, {
  as: "travel",
  foreignKey: "id"
});

Travel.belongsTo(User, {
  as: "hcmga",
  foreignKey: "hcmga_by"
});

User.hasMany(Travel, {
  as: "hcmga_travel",
  foreignKey: "id"
});

sequelize.sync();

const getToken = token => {
  return JWT.verify(token, process.env.SECRET_KEY);
};

const dropPermit = async (req, res) => {
  try {
    const result = await Permit.drop();
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

const dropLeave = async (req, res) => {
  try {
    const result = await Leave.drop();
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

const dropTravel = async (req, res) => {
  try {
    const result = await Travel.drop();
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

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
    const dataFile = `${config.baseUrl}/${file}`;
    req.body.image = dataFile;
    const result = await User.create(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const url = `public/uploads/${req.file.originalname}`;
    fs.writeFileSync(url, req.file.buffer);
    const file = `uploads/${req.file.originalname}`;
    const dataFile = `${config.baseUrl}/${file}`;
    req.body.image = dataFile;
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
      next();
    } else {
      res.status(401).json({
        message: "Unauthorized"
      });
    }
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized"
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const result = await User.findAll({
      include: [
        {
          model: User,
          as: "superior"
          // attributes: ["id", "name"]
        }
      ]
    });
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

const getUser = async (req, res) => {
  try {
    const authResult = getToken(req.headers.authorization);
    const result = await User.findOne({
      include: [
        {
          model: User,
          as: "superior"
          // attributes: ["id", "name"]
        }
      ],
      where: {
        id: authResult.id
      }
    });
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

const postLogin = async (req, res) => {
  try {
    let checkUser = await User.findOne({
      where: {
        email: req.body.email
      }
    });
    checkUser = JSON.parse(JSON.stringify(checkUser));
    if (checkUser) {
      if (checkUser.password === req.body.password) {
        const token = JWT.sign(
          { id: checkUser.id, role: checkUser.role },
          process.env.SECRET_KEY,
          { expiresIn: "6h" }
        );
        res.status(200).json({
          message: "You have succesfully logged in!",
          token
        });
      } else {
        res.status(400).json({
          message: "Wrong password!"
        });
      }
    } else {
      res.status(400).json({
        message: "Wrong email!"
      });
    }
  } catch (error) {
    res.status(401).json({
      message: "Unauthorized"
    });
  }
};

const postPermit = async (req, res) => {
  try {
    req.body.hcmga_status = "waiting";
    const result = await Permit.create(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({
      message: "Unauthorized"
    });
  }
};

const getPermit = async (req, res) => {
  try {
    const authResult = getToken(req.headers.authorization);
    const result = await Permit.findOne({
      include: [
        {
          model: User,
          as: "user",
          include: [
            {
              model: User,
              as: "superior"
            }
          ]
          // attributes: ["id", "name"]
        },
        {
          model: User,
          as: "hcmga"
        }
      ],
      where: {
        hcmga_status: "waiting",
        created_by: authResult.id
      }
    });
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

const getPermits = async (req, res) => {
  try {
    const authResult = getToken(req.headers.authorization);
    const result = await Permit.findAll({
      include: [
        {
          model: User,
          as: "user",
          include: [
            {
              model: User,
              as: "superior"
            }
          ]
          // attributes: ["id", "name"]
        },
        {
          model: User,
          as: "hcmga"
        }
      ],
      where: {
        created_by: authResult.id,
        hcmga_status: "approved" || "rejected"
      }
    });
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

const postLeave = async (req, res) => {
  try {
    req.body.hcmga_status = "waiting";
    const result = await Leave.create(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(401).json({
      message: "Unauthorized"
    });
  }
};

const getLeave = async (req, res) => {
  try {
    const authResult = getToken(req.headers.authorization);
    const result = await Leave.findOne({
      include: [
        {
          model: User,
          as: "user",
          include: [
            {
              model: User,
              as: "superior"
            }
          ]
          // attributes: ["id", "name"]
        },
        {
          model: User,
          as: "hcmga"
        }
      ],
      where: {
        hcmga_status: "waiting",
        created_by: authResult.id
      }
    });
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

const getLeaves = async (req, res) => {
  try {
    const authResult = getToken(req.headers.authorization);
    const result = await Leave.findAll({
      include: [
        {
          model: User,
          as: "user",
          include: [
            {
              model: User,
              as: "superior"
            }
          ]
          // attributes: ["id", "name"]
        },
        {
          model: User,
          as: "hcmga"
        }
      ],
      where: {
        created_by: authResult.id,
        hcmga_status: "approved" || "rejected"
      }
    });
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

const postTravel = async (req, res) => {
  try {
    req.body.hcmga_status = "waiting";
    const result = await Travel.create(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(401).json({
      message: "Unauthorized"
    });
  }
};

const getTravel = async (req, res) => {
  try {
    const authResult = getToken(req.headers.authorization);
    const result = await Travel.findOne({
      include: [
        {
          model: User,
          as: "user",
          include: [
            {
              model: User,
              as: "superior"
            }
          ]
          // attributes: ["id", "name"]
        },
        {
          model: User,
          as: "hcmga"
        }
      ],
      where: {
        hcmga_status: "waiting",
        created_by: authResult.id
      }
    });
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

const getTravels = async (req, res) => {
  try {
    const authResult = getToken(req.headers.authorization);
    const result = await Travel.findAll({
      include: [
        {
          model: User,
          as: "user",
          include: [
            {
              model: User,
              as: "superior"
            }
          ]
          // attributes: ["id", "name"]
        },
        {
          model: User,
          as: "hcmga"
        }
      ],
      where: {
        created_by: authResult.id,
        hcmga_status: "approved" || "rejected"
      }
    });
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

const updatePermit = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Permit.update(
      {
        manager_notes: req.body.manager_notes,
        manager_status: req.body.manager_status,
        hcmga_notes: req.body.hcmga_notes,
        hcmga_status: req.body.hcmga_status,
        hcmga_by: req.body.hcmga_by
      },
      {
        where: {
          id
        }
      }
    );
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

const updateLeave = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Leave.update(
      {
        manager_notes: req.body.manager_notes,
        manager_status: req.body.manager_status,
        hcmga_notes: req.body.hcmga_notes,
        hcmga_status: req.body.hcmga_status,
        hcmga_by: req.body.hcmga_by
      },
      {
        where: {
          id
        }
      }
    );
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

const updateTravel = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Travel.update(
      {
        manager_notes: req.body.manager_notes,
        manager_status: req.body.manager_status,
        hcmga_notes: req.body.hcmga_notes,
        hcmga_status: req.body.hcmga_status,
        hcmga_by: req.body.hcmga_by
      },
      {
        where: {
          id
        }
      }
    );
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(express.static(path.join(__dirname, "public")))

  .post("/login", postLogin)

  .post("/dropPermit", dropPermit)
  .post("/dropLeave", dropLeave)
  .post("/dropTravel", dropTravel)

  .post("/seedUsers", seedUsers)
  .get("/users", checkToken, getUsers)
  .get("/user", checkToken, getUser)
  .post("/users", checkToken, upload.single("profile"), postUser)
  .put("/users/:id", checkToken, updateUser)

  .post("/permit", checkToken, postPermit)
  .get("/permit", checkToken, getPermit)
  .get("/permits", checkToken, getPermits)

  .post("/leave", checkToken, postLeave)
  .get("/leave", checkToken, getLeave)
  .get("/leaves", checkToken, getLeaves)

  .post("/travel", checkToken, postTravel)
  .get("/travel", checkToken, getTravel)
  .get("/travels", checkToken, getTravels)

  .put("/permit/:id", checkToken, updatePermit)
  .put("/leave/:id", checkToken, updateLeave)
  .put("/travel/:id", checkToken, updateTravel)
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
