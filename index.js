const Sequelize = require("sequelize");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const cool = require("cool-ascii-faces");
const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000;
const config = require("./config");
const seedUser = require("./seeder/seedUser");

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

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
  gender: {
    type: Sequelize.ENUM,
    values: ["male", "female"]
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
const Permit = sequelize.define(
  "permit",
  {
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
  },
  {
    // options
  }
);

/**
 * TABLE LEAVE
 */
const Leave = sequelize.define(
  "leave",
  {
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
  },
  {
    // options
  }
);

/**
 * TABLE TRAVEL
 */
const Travel = sequelize.define(
  "travel",
  {
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
  },
  {
    // options
  },
  {
    associate: models => {
      models.Travel.belongsTo(models.ManagerApproval);
    }
  }
);

// TABLE MANAGER APPROVAL
const ManagerApproval = sequelize.define(
  "managerApproval",
  {
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
  },
  {
    // options
  },
  {
    associate: models => {
      models.ManagerApproval.hasMany(models.Travel);
    }
  }
);

// TABLE HCMGA APPROVAL
const HCMGAApproval = sequelize.define(
  "hcmgaApproval",
  {
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
  },
  {
    // options
  }
);

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

const getUsers = async (request, response) => {
  try {
    const result = await User.findAll({
      include: [
        {
          model: User,
          as: "superior",
          attributes: ["id", "name"]
        }
      ],
      attributes: ["id", "name", "group", "email", "password", "gender"]
    });
    response.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

app
  .use(express.static(path.join(__dirname, "public")))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .get("/", (req, res) => res.render("pages/index"))
  .get("/cool", (req, res) => res.send(cool()))
  .get("/times", (req, res) => res.send(showTimes()))
  .get("/db", async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query("SELECT * FROM users");
      const results = { results: result ? result.rows : null };
      res.render("pages/db", results);
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  .get("/users", getUsers)
  .post("/users", postUser)
  .post("/seedUsers", seedUsers)
  .put("/users/:id", updateUser)
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

showTimes = () => {
  let result = "";
  const times = process.env.TIMES || 5;
  for (i = 0; i < times; i++) {
    result += i + " ";
  }
  return result;
};
