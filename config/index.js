const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
  user: 'dgana',
  host: 'localhost',
  database: 'goess',
  password: 'password',
  port: 5432,
});

module.exports = {
  pool
}