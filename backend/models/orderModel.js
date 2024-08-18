const db = require("../config/db");

exports.createOrder = async (order) => {
  const { userId, productId, quantity, totalPrice, status } = order;
  const res = await db.query(
    "INSERT INTO orders (user_id, product_id, quantity, total_price, status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [userId, productId, quantity, totalPrice, status]
  );
  return res.rows[0];
};

exports.getAllOrders = async () => {
  const res = await db.query("SELECT * FROM orders");
  return res.rows;
};

exports.getOrderById = async (id) => {
  const res = await db.query("SELECT * FROM orders WHERE id = $1", [id]);
  return res.rows[0];
};

exports.updateOrder = async (id, orderData) => {
  const { status } = orderData;
  const res = await db.query(
    "UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
    [status, id]
  );
  return res.rows[0];
};

exports.deleteOrder = async (id) => {
  const res = await db.query("DELETE FROM orders WHERE id = $1 RETURNING *", [
    id,
  ]);
  return res.rows[0];
};
