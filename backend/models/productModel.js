// backend/models/productModel.js
const db = require("../config/db");

exports.getAllProducts = async () => {
  try {
    // Debugging the current database connection
    const dbNameRes = await db.query("SELECT current_database();");
    console.log("Connected to database:", dbNameRes.rows[0].current_database);

    // Perform the query
    const res = await db.query("SELECT * FROM public.products");
    console.log("Query result:", res.rows);
    return res.rows;
  } catch (err) {
    console.error("Error executing query", err.stack);
    throw err; // Re-throw the error after logging it
  }
};

exports.getProductById = async (id) => {
  const res = await db.query("SELECT * FROM products WHERE id = $1", [id]);
  return res.rows[0];
};

exports.createProduct = async (product) => {
  const { name, description, price, stock, imageUrl } = product;
  const res = await db.query(
    "INSERT INTO products (name, description, price, stock, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [name, description, price, stock, imageUrl]
  );
  return res.rows[0];
};

exports.updateProduct = async (id, product) => {
  const { name, description, price, stock, imageUrl } = product;
  const res = await db.query(
    "UPDATE products SET name = $1, description = $2, price = $3, stock = $4, image_url = $5, updated_at = NOW() WHERE id = $6 RETURNING *",
    [name, description, price, stock, imageUrl, id]
  );
  return res.rows[0];
};

exports.deleteProduct = async (id) => {
  const res = await db.query("DELETE FROM products WHERE id = $1 RETURNING *", [
    id,
  ]);
  return res.rows[0];
};
