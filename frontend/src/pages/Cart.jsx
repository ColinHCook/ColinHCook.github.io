import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // If user is logged in, fetch the cart from the backend
      const fetchCartItems = async () => {
        try {
          const response = await fetch("http://localhost:5000/api/cart", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch cart items");
          }

          const data = await response.json();
          setCartItems(data.cart);
        } catch (error) {
          console.error("Error fetching cart items:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchCartItems();
    } else {
      // If user is not logged in, load the cart from localStorage
      const savedCartItems = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(savedCartItems);
      setIsLoading(false);
    }
  }, [navigate]);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return; // Ensure quantity doesn't go below 1

    const token = localStorage.getItem("token");

    if (token) {
      // Update quantity in backend cart for logged-in users
      const updateBackendCartQuantity = async () => {
        try {
          const response = await fetch(
            "http://localhost:5000/api/cart/update-quantity",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ productId, quantity: newQuantity }),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to update item quantity");
          }

          setCartItems(
            cartItems.map((item) =>
              item.id === productId ? { ...item, quantity: newQuantity } : item
            )
          );
        } catch (error) {
          console.error("Error updating item quantity:", error);
        }
      };

      updateBackendCartQuantity();
    } else {
      // Update quantity in localStorage cart for guest users
      const updatedCartItems = cartItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCartItems);
      localStorage.setItem("cart", JSON.stringify(updatedCartItems));
    }
  };

  const handleRemoveFromCart = (productId) => {
    const token = localStorage.getItem("token");

    if (token) {
      // Remove item from backend cart for logged-in users
      const removeItemFromBackendCart = async () => {
        try {
          const response = await fetch(
            "http://localhost:5000/api/cart/remove",
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ productId }),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to remove item from cart");
          }

          setCartItems(cartItems.filter((item) => item.id !== productId));
        } catch (error) {
          console.error("Error removing item from cart:", error);
        }
      };

      removeItemFromBackendCart();
    } else {
      // Remove item from localStorage cart for guest users
      const updatedCartItems = cartItems.filter(
        (item) => item.id !== productId
      );
      setCartItems(updatedCartItems);
      localStorage.setItem("cart", JSON.stringify(updatedCartItems));
    }
  };

  const handleClearCart = () => {
    const token = localStorage.getItem("token");

    if (token) {
      // Clear backend cart for logged-in users
      const clearBackendCart = async () => {
        try {
          const response = await fetch("http://localhost:5000/api/cart/clear", {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to clear cart");
          }

          setCartItems([]);
        } catch (error) {
          console.error("Error clearing cart:", error);
        }
      };

      clearBackendCart();
    } else {
      // Clear localStorage cart for guest users
      localStorage.removeItem("cart");
      setCartItems([]);
    }
  };

  const handleProceedToCheckout = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    // Calculate the total price
    const totalPrice = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // Save the total price in sessionStorage as a fallback
    sessionStorage.setItem("totalPrice", totalPrice.toFixed(2));

    // Navigate to checkout page with the total price
    navigate("/checkout", { state: { totalPrice: totalPrice.toFixed(2) } });
  };

  if (isLoading) {
    return <p className="cart-empty">Loading your cart...</p>;
  }

  if (cartItems.length === 0) {
    return <p className="cart-empty">Your cart is empty.</p>;
  }

  if (isLoading) {
    return <p className="cart-empty">Loading your cart...</p>;
  }

  if (cartItems.length === 0) {
    return (
      <p className="cart-empty">
        Your cart is empty, please add items from our shop page to view your
        cart.
      </p>
    );
  }

  // Calculate the total price
  const totalPrice = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      <ul className="cart-items">
        {cartItems.map((item) => (
          <li key={item.id} className="cart-item">
            <img src={`${item.image_url}`} alt={item.name} />
            <div>
              <h3>{item.name}</h3>
              <p className="price">Price: ${Number(item.price).toFixed(2)}</p>
              <div className="quantity-controls">
                <p>Quantity: {item.quantity}</p>
                <button
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity - 1)
                  }
                >
                  -
                </button>
                <button
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity + 1)
                  }
                >
                  +
                </button>
              </div>
              <button onClick={() => handleRemoveFromCart(item.id)}>
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="cart-total">
        <h3>Total: ${totalPrice.toFixed(2)}</h3>
      </div>
      <div className="cart-actions">
        <button onClick={handleClearCart} className="clear-cart-button">
          Clear Cart
        </button>
        <button onClick={handleProceedToCheckout} className="checkout-button">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
