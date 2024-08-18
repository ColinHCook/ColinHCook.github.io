const db = require("../config/db");

// Create a new cart or get the existing cart for a user
const findOrCreateCart = async (userId) => {
  try {
    let cart = await db.query("SELECT * FROM carts WHERE user_id = $1", [
      userId,
    ]);

    if (cart.rows.length === 0) {
      cart = await db.query(
        "INSERT INTO carts (user_id) VALUES ($1) RETURNING *",
        [userId]
      );
    }

    return cart.rows[0];
  } catch (error) {
    throw new Error("Error finding or creating cart");
  }
};

// Add an item to the cart
const addToCart = async (cartId, productId, quantity) => {
  try {
    // Check if the product is already in the cart
    let cartItem = await db.query(
      "SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2",
      [cartId, productId]
    );

    if (cartItem.rows.length > 0) {
      // Update the quantity if the product already exists in the cart
      await db.query(
        "UPDATE cart_items SET quantity = quantity + $1 WHERE cart_id = $2 AND product_id = $3",
        [quantity, cartId, productId]
      );
    } else {
      // Add the product to the cart if it's not already there
      await db.query(
        "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3)",
        [cartId, productId, quantity]
      );
    }

    // Update the product stock
    await db.query(
      "UPDATE products SET stock = stock - $1 WHERE id = $2 AND stock >= $1",
      [quantity, productId]
    );

    return { message: "Product added to cart" };
  } catch (error) {
    throw new Error("Error adding item to cart");
  }
};

// Get all items in the cart for a user
const getCartItems = async (cartId) => {
  try {
    const items = await db.query(
      `SELECT p.*, ci.quantity 
       FROM cart_items ci 
       JOIN products p ON ci.product_id = p.id 
       WHERE ci.cart_id = $1`,
      [cartId]
    );

    return items.rows;
  } catch (error) {
    throw new Error("Error fetching cart items");
  }
};

// Remove an item from the cart
const removeFromCart = async (cartId, productId) => {
  try {
    await db.query(
      "DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2",
      [cartId, productId]
    );

    return { message: "Product removed from cart" };
  } catch (error) {
    throw new Error("Error removing item from cart");
  }
};

// Clear the cart
const clearCart = async (cartId) => {
  try {
    await db.query("DELETE FROM cart_items WHERE cart_id = $1", [cartId]);

    return { message: "Cart cleared" };
  } catch (error) {
    throw new Error("Error clearing cart");
  }
};

async function updateCartQuantity(userId, productId, quantity) {
  try {
    const result = await db.query(
      "UPDATE cart_items SET quantity = $1 WHERE product_id = $2 RETURNING *",
      [quantity, productId]
    );

    if (result.rowCount === 0) {
      return null; // Item not found
    }

    return result.rows[0]; // Return the updated cart item
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    throw error;
  }
}

module.exports = {
  findOrCreateCart,
  addToCart,
  getCartItems,
  removeFromCart,
  clearCart,
  updateCartQuantity,
};
