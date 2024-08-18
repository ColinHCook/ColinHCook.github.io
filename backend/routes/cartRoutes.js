const express = require("express");
const cartController = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Route to add an item to the cart
router.post("/add", authMiddleware, cartController.addToCart);

// Route to get all items in the cart
router.get("/", authMiddleware, cartController.getCart);

// Route to remove an item from the cart
router.delete("/remove", authMiddleware, cartController.removeFromCart);

// Route to clear the cart
router.delete("/clear", authMiddleware, cartController.clearCart);

router.put(
  "/update-quantity",
  authMiddleware,
  cartController.updateCartQuantity
);

module.exports = router;
