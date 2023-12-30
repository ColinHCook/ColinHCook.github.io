import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Cart.css"; // Ensure the CSS file path is correct

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/cart-items")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Initialize the quantity to 1 for each item
        const itemsWithQuantity = data.map((item) => ({
          ...item,
          quantity: 1,
        }));
        setCartItems(itemsWithQuantity);
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  const handleQuantityChange = (itemId, newQuantity) => {
    // Ensure the newQuantity is at least 1
    newQuantity = Math.max(newQuantity, 1);

    const updatedCartItems = cartItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    setCartItems(updatedCartItems);
  };

  const calculateItemTotal = (item) => {
    return (item.price * item.quantity).toFixed(2);
  };

  const calculateTotal = () => {
    // Assuming cartItems is your state that contains the cart items
    return cartItems
      .reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0)
      .toFixed(2);
  };

  const totalPrice = calculateTotal();
  console.log("Total Price in Cart:", totalPrice);

  const handleRemoveFromCart = (productId) => {
    // PUT request to update Cart status of the product to 0
    fetch(`http://localhost:3001/api/remove-from-cart/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(() => {
        // Update the cartItems state to remove the item
        setCartItems((prevCartItems) =>
          prevCartItems.filter((item) => item.id !== productId)
        );
      })
      .catch((error) => console.error("Error removing item from cart:", error));
  };

  const navigateToCheckout = () => {
    sessionStorage.setItem("totalPrice", totalPrice);
    // then navigate to Checkout page
  };

  return (
    <div className="cart-container">
      <h1>Your Shopping Cart</h1>
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.id}>
              <td>
                <img src={`http://localhost:3001/images/${item.image}`} />
              </td>
              <td>{item.name}</td>
              <td>${item.price.toFixed(2)}</td>
              <td>
                <button
                  classname="quantity-button"
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity - 1)
                  }
                >
                  -
                </button>
                <span className="quantity">{item.quantity}</span>

                <button
                  className="quantity-button"
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity + 1)
                  }
                >
                  +
                </button>
              </td>
              <td>${calculateItemTotal(item)}</td>
              <td>
                <button onClick={() => handleRemoveFromCart(item.id)}>x</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="cart-summary">
        <div className="cart-totals">
          <h2>Your Cart Totals:</h2>
          <div className="total-row">
            <span>Sub-Total</span>
            <span>${calculateTotal()}</span>
          </div>
          <div className="total-row">
            <span>Total</span>
            <span>${calculateTotal()}</span>
          </div>
          <Link
            to={{
              pathname: "/checkout",
              state: { totalPrice: totalPrice },
            }}
          >
            <button className="checkout-btn" onClick={navigateToCheckout}>
              Proceed to Checkout
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
