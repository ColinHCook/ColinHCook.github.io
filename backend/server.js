const express = require("express");
const cors = require("cors"); // Import the cors module
const app = express();
const port = process.env.PORT || 3001;
const sqlite3 = require("sqlite3").verbose();

// Serve static files from the 'images' directory
app.use("/images", express.static("images"));
app.use(cors());

// SQLite database connection
const db = new sqlite3.Database(
  "./db/product-db.db",
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) {
      console.error("Error opening database", err.message);
    } else {
      console.log("Connected to the SQLite database.");
    }
  }
);

// Define API routes
app.get("/api/products", (req, res) => {
  const sql = "SELECT * FROM products";
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).send("Error querying the database: " + err.message);
    } else {
      res.json(rows);
    }
  });
});

app.put("/api/add-to-cart/:productId", (req, res) => {
  const { productId } = req.params;
  console.log(`Received request to add product ${productId} to cart`);

  const sql = "UPDATE products SET Cart = ? WHERE id = ?";
  db.run(sql, [1, productId], function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    console.log(
      `Product ${productId} added to cart, rows affected: ${this.changes}`
    );
    res.json({ productId: productId, Cart: true });
  });
});

// Define a route to remove the item from the cart
app.put("/api/remove-from-cart/:itemId", (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);

  db.run("UPDATE products SET Cart = 0 WHERE id = ?", [itemId], (err) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    // Respond with a success message
    res.json({ message: "Item removed from cart" });
  });
});

app.get("/api/cart-items", (req, res) => {
  const sql = "SELECT * FROM products WHERE Cart = 1";
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).send("Error querying the database: " + err.message);
    } else {
      res.json(rows);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
