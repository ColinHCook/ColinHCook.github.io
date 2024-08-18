const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // This ensures SSL is used without rejecting self-signed certificates
  },
});

pool.connect();

pool.query("SET search_path TO public;", (err, res) => {
  if (err) {
    console.error("Error setting search path:", err.stack);
  } else {
    console.log("Search path set to public");
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
