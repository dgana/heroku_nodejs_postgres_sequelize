if (process.env.APP_ENV === "production") {
  module.exports = {
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    database_url: process.env.DATABASE_URL
  };
} else {
  module.exports = {
    user: process.env.USER_DEV,
    host: process.env.HOST_DEV,
    database: process.env.DATABASE_DEV,
    password: process.env.PASSWORD_DEV,
    database_url: process.env.DATABASE_URL
  };
}
