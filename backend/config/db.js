const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Extracting the database name from the connection string
const dbName = process.env.DATABASE_URL.split("/").pop().split("?")[0];

console.log(`Connected to database: ${dbName}`);

module.exports = {
  query: (text, params) => {
    console.log(`Executing query on database ${dbName}:`, text);
    return pool.query(text, params);
  },
};
