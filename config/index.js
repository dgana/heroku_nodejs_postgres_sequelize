if (process.env.APP_ENV === "production") {
  module.exports = require("../prd");
} else {
  module.exports = require("../dev");
}
