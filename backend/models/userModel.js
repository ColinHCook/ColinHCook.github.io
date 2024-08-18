const { Pool } = require("pg");
const pool = require("../config/db"); // Assuming db.js exports the pool

// Create Users table if not exists
pool.query(
  `
    CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
    );
`,
  (err, res) => {
    if (err) throw err;
    console.log("Users table ready");
  }
);

module.exports = {
  // Method to find user by email
  findByEmail: async (email) => {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  },

  // Method to create a new user
  createUser: async (name, email, hashedPassword) => {
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword]
    );
    return result.rows[0];
  },
};
