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
  ssl: false,
  user: config.user,
  host: config.host,
  database: config.database,
  password: config.password,
  port: 5432
});

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
  manager_id: {
    type: Sequelize.STRING
  },
  hcmga_id: {
    type: Sequelize.STRING
  }
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
  manager_id: {
    type: Sequelize.STRING
  },
  hcmga_id: {
    type: Sequelize.STRING
  }
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
  manager_id: {
    type: Sequelize.STRING
  },
  hcmga_id: {
    type: Sequelize.STRING
  }
});

// TABLE MANAGER APPROVAL
const ManagerApproval = sequelize.define("managerApproval", {
  notes: {
    type: Sequelize.STRING
  },
  status: {
    type: Sequelize.ENUM,
    values: ["waiting", "rejected", "approved"]
  },
  approved_by: {
    type: Sequelize.INTEGER
  },
  rejected_by: {
    type: Sequelize.INTEGER
  }
});

// TABLE HCMGA APPROVAL
const HCMGAApproval = sequelize.define("hcmgaApproval", {
  notes: {
    type: Sequelize.STRING
  },
  status: {
    type: Sequelize.ENUM,
    values: ["waiting", "rejected", "approved"]
  },
  approved_by: {
    type: Sequelize.INTEGER
  },
  rejected_by: {
    type: Sequelize.INTEGER
  }
});

sequelize.sync();

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

const checkTokenEmployee = (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    const result = JWT.verify(auth, process.env.SECRET_KEY);
    if (result.role === "employee") {
      // req.user = result;
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

const getUsers = async (request, response) => {
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
    response.status(200).json(result);
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
  } catch (error) {
    response.status(401).json({
      message: "Unauthorized"
    });
  }
};

app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(express.static(path.join(__dirname, "public")))
  .post("/login", postLogin)
  .get("/users", checkTokenEmployee, getUsers)
  .post("/users", checkTokenEmployee, upload.single("profile"), postUser)
  .put("/users/:id", checkTokenEmployee, updateUser)
  .post("/seedUsers", seedUsers)
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
