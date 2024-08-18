const cartModel = require("../models/cartModel");
const db = require("../config/db");

exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  try {
    console.log("Finding or creating cart for user:", userId);
    let cart = await db.query("SELECT * FROM carts WHERE user_id = $1", [
      userId,
    ]);

    if (cart.rows.length === 0) {
      console.log("No cart found, creating a new one.");
      cart = await db.query(
        "INSERT INTO carts (user_id) VALUES ($1) RETURNING *",
        [userId]
      );
    }

    const cartId = cart.rows[0].id;
    console.log("Cart ID:", cartId);

    console.log("Checking if product is already in cart.");
    let cartItem = await db.query(
      "SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2",
      [cartId, productId]
    );

    if (cartItem.rows.length > 0) {
      console.log("Product already in cart, updating quantity.");
      await db.query(
        "UPDATE cart_items SET quantity = quantity + $1 WHERE cart_id = $2 AND product_id = $3",
        [quantity, cartId, productId]
      );
    } else {
      console.log("Product not in cart, adding it.");
      await db.query(
        "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3)",
        [cartId, productId, quantity]
      );
    }

    console.log("Updating product stock.");
    await db.query("UPDATE products SET stock = stock - $1 WHERE id = $2", [
      quantity,
      productId,
    ]);

    res.status(200).json({ message: "Item added to cart successfully" });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ message: "Failed to add item to cart" });
  }
};

exports.getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await cartModel.findOrCreateCart(userId);
    const items = await cartModel.getCartItems(cart.id);
    res.status(200).json({ cart: items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;

  try {
    const cart = await cartModel.findOrCreateCart(userId);
    const result = await cartModel.removeFromCart(cart.id, productId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.clearCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await cartModel.findOrCreateCart(userId);
    const result = await cartModel.clearCart(cart.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCartQuantity = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id; // Assuming you get user ID from auth middleware

  try {
    // Ensure the quantity is a positive integer
    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    // Update the cart item quantity using the model
    const updatedItem = await cartModel.updateCartQuantity(
      userId,
      productId,
      quantity
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res
      .status(200)
      .json({ message: "Cart item updated successfully", item: updatedItem });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
