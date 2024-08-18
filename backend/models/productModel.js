const { Pool } = require("pg");
const pool = require("../config/db"); // Assuming db.js exports the pool

// Create Products table if not exists
pool.query(
  `
    CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price NUMERIC(10, 2) NOT NULL,
        stock INT DEFAULT 0,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    );
`,
  (err, res) => {
    if (err) throw err;
    console.log("Products table ready");
  }
);

module.exports = {
  // Method to get all products
  getAllProducts: async () => {
    const result = await pool.query("SELECT * FROM products");
    return result.rows;
  },

  // Method to get a product by ID
  getProductById: async (id) => {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);
    return result.rows[0];
  },

  // Method to create a new product
  createProduct: async (name, description, price, stock, imageUrl) => {
    const result = await pool.query(
      "INSERT INTO products (name, description, price, stock, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, description, price, stock, imageUrl]
    );
    return result.rows[0];
  },

  // Method to update a product's details
  updateProduct: async (id, name, description, price, stock, imageUrl) => {
    const result = await pool.query(
      `UPDATE products
       SET name = $2, description = $3, price = $4, stock = $5, image_url = $6, updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [id, name, description, price, stock, imageUrl]
    );
    return result.rows[0];
  },

  // Method to delete a product
  deleteProduct: async (id) => {
    await pool.query("DELETE FROM products WHERE id = $1", [id]);
    return { message: "Product deleted" };
  },
};
